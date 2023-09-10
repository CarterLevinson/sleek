function goToSearchPage(query) {
  if (query === "") {
    window.location.href = "/search";
  } else {
    window.location.href = "/search?query=" + query;
  }
}

function init() {
  var $search = document.getElementById("main-search");
  if ($search !== null) {
    $search.addEventListener("keydown",
      function(event) {
        if (event.keyCode === 13 || event.key === "Enter") {
          event.preventDefault();
          goToSearchPage($search.value.trim())
        }
      }
    );

    var $mainButton = document.getElementById("main-button");
    $mainButton.addEventListener("click",
      function(event) {
        event.preventDefault();
        goToSearchPage($search.value.trim())
      }
    );
  }

  var $navSearch = document.getElementById("nav-search");
  if ($navSearch !== null) {
    $navSearch.addEventListener("keydown",
      function(event) {
        if (event.keyCode === 13 || event.key === "Enter") {
          event.preventDefault();
          goToSearchPage($navSearch.value.trim());
        }
      }
    );

    var $navButton = document.getElementById("nav-button");
    $navButton.addEventListener("click",
      function(event) {
        event.preventDefault();
        goToSearchPage($navSearch.value.trim());
      }
    );
  }
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
