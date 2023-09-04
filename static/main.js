function performSearch(query) {
  if (query === "") {
    window.location.href = "/search";
  } else {
    window.location.href = "/search?query=" + query;
  }
}

function init() {
  var $search = document.getElementById("search")
  $search.addEventListener("keydown",
    function(event) {
      if (event.keyCode === 13 || event.key === "Enter") {
        event.preventDefault();
        performSearch($search.value.trim())
      }
    }
  );

  var $button = document.getElementById("button");
  $button.addEventListener("click",
    function(event) {
      event.preventDefault();
      performSearch($search.value.trim())
    }
  );
}

if (document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
