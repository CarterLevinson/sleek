function goToSearchPage(query) {
  window.location.href = "/search?query=" + query;
}

function searchPageOnEnterKey(event, query) {
  if(event.key === "Enter" || event.keyCode === 13) {
    goToSearchPage(query);
  }
}

function init() {
  var $mainSearch = document.getElementById("main-search");
  if ($mainSearch !== null) {

    $mainSearch.addEventListener("keydown", function(event) {
      searchPageOnEnterKey(event, $mainSearch.value.trim());
    });

    var $mainButton = document.getElementById("main-button");
    $mainButton.addEventListener("click", function(event) {
      event.preventDefault();
      goToSearchPage($mainSearch.value.trim());
    });
  }

  var $navSearch = document.getElementById("nav-search");
  if ($navSearch !== null) {
    $navSearch.addEventListener("keydown", function(event) {
      searchPageOnEnterKey(event, $navSearch.value.trim());
    });


    var $navButton = document.getElementById("nav-button");
    $navButton.addEventListener("click", function(event) {
      event.preventDefault();
      if ($navSearch.matches(":focus-within")) {
        goToSearchPage($navSearch.value.trim());
      }
    });
  }

  var $spotlightSearch = document.getElementById("spotlight-search");
  if ($spotlightSearch !== null) {
    $spotlightSearch.addEventListener("keydown", function(event) {
      searchPageOnEnterKey(event, $spotlightSearch.value.trim());
    });

    var $spotlightButton = document.getElementById("spotlight-button");
    $spotlightButton.addEventListener("click", function(event) {
      goToSearchPage($spotlightSearch.value.trim());
    });
  }
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
