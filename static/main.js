function goToSearchPage(query) {
  location.href = "/search?query=" + query;
}

function goToSearchOnEnter(event, query) {
  if(event.key === "Enter" || event.keyCode === 13) {
    goToSearchPage(query);
  }
}

function goToSearchOnClick(event, query) {
  event.preventDefault();
  goToSearchPage(query);
}

function init() {
  var $navInput = document.getElementById("navbar-search-input");
  if ($navInput !== null) {
    $navInput.addEventListener("keydown", function(event) {
      goToSearchOnEnter(event, $navInput.value.trim());
    });

    var $navButton = document.getElementById("navbar-search-button");
    $navButton.addEventListener("click", function(event) {
      goToSearchOnClick(event, $navInput.value.trim());
    });
  }

  var $searchInput = document.getElementById("search-input");
  if (window.location.pathname === "/" && $searchInput !== null) {
    $searchInput.addEventListener("keydown", function(event) {
      goToSearchOnEnter(event, $searchInput.value.trim());
    });

    var $searchButton = document.getElementById("search-button");
    $searchButton.addEventListener("click", function(event) {
      goToSearchOnClick(event, $searchInput.value.trim());
    });

  }
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
