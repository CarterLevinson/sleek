export function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function() {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

export function formatSuggestionsItem(item) {
  return '<div>'
  + `<a href="${item.ref}">${item.doc.title}</a>`
  + '</div>'
}

export function elasticSuggest() {
  var $mainSearch = document.getElementById("main-search");
  var $suggestionsBox =
}


function init() {
  var $search = document.getElementById("main-search");
  var $suggestionsBox = document.querySelector(".search-suggestions");
  var $suggesttionsItems = document.querySelector(".search-suggestions-items");

  var currentTerm = "";

  $search.addEventListener("keyup", debounce(async function() {
    var term = $search.value.trim();
    if (term === currentTerm) {
      return;
    }

    $suggestionsBox.style.display = term === "" ? "none" : "block";
    $suggesttionsItems.innerHTML = "";

    currentTerm = term;
    if (term === "") {
      return;
    }

    var results = (await initIndex()).search(term, options);
    if (results.length === 0) {
      $searchResults.style.display = "none";
      return;
    }

    for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
      var item = document.createElement("li");
      item.className = "search-suggestions-item"
      item.innerHTML = formatSuggestionsItem(results[i], term.split(" "));
      $suggestionsItems.appendChild(item);
    }
  }, 150));

  window.addEventListener('click', function(e) {
    if ($suggestionsBox.style.display == "block" && !$suggestionsBox.contains(e.target)) {
      $suggestionsBox.style.display = "none";
    }
  });

}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
