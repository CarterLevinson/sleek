function goToSearchPage(query) {
  window.location.href = "/search?query=" + query;
}

function searchOnEnterKey(event, query) {
  if(event.key === "Enter" || event.keyCode === 13) {
    goToSearchPage(query);
  }
}

function searchOnClick(event, query) {
  event.preventDefault();
  goToSearchPage(query);
}

function init() {
  var $searchInput = document.getElementById("search-input");
  if ($searchInput !== null) {
    $searchInput.addEventListener("keydown", function(event) {
      searchOnEnterKey(event, $searchInput.value.trim());
    });
    var $searchButton = document.getElementById("search-button");
    $searchButton.addEventListener("click", function(event) {
      searchOnClick(event, $searchInput.value.trim());
    });
  }
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
