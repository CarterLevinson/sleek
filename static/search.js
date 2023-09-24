 function debounce(func, wait) {
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

// Taken and modified from mdbook
// The strategy is as follows:
// First, assign a value to each word in the document:
//  Words that correspond to search terms (stemmer aware): 40
//  Normal words: 2
//  First word in a sentence: 8
// Then use a sliding window with a constant number of words and count the
// sum of the values of the words within the window. Then use the window that got the
// maximum sum. If there are multiple maximas, then get the last one.
// Enclose the terms in <b>.
function makeTeaser(body, terms) {
  const TERM_WEIGHT = 40;
  const NORMAL_WORD_WEIGHT = 2;
  const FIRST_WORD_WEIGHT = 8;
  const TEASER_MAX_WORDS = 30;

  var stemmedTerms = terms.map(function (w) {
    return elasticlunr.stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split(". ");

  for (var i in sentences) {
    var words = sentences[i].split(" ");
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1;  // ' ' or '.' if last word in sentence
    }

    index += 1;  // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  var windowWeights = [];
  var windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  var curSum = 0;
  for (var i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (var i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (var i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (var i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    var word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<b>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</b>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

function formatSearchResultItem(item, terms) {
  return '<div>'
  + `<a href="${item.ref}"><h3>${item.doc.title}</h3></a>`
  + `<div>${makeTeaser(item.doc.body, terms)}</div>`
  + '</div>';
}

let index = undefined;

let options = {
  bool: "AND",
  fields: {
    title: {boost: 2},
    body: {boost: 1},
  }
};

const MAX_ITEMS = 100;

async function initIndex() {
  if (index === undefined || index === null) {
    index = fetch("/search_index.en.json")
      .then(async function(response) {
        return await elasticlunr.Index.load(await response.json());
      }
    );
  }
  return (await index);
}

async function resetSearchResults() {
 document.querySelector(".search-results-items").innerHTML = ""
   + "<ul class=&quot;search-results-item&quot;></ul>";
}

async function elasticSearch(term) {
  resetSearchResults();

  var results = (await initIndex()).search(term, options);
  if (results.length === 0) {
    return;
  }

  for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
    var item = document.createElement("li");
    item.className = "search-results-item";
    item.innerHTML = formatSearchResultItem(results[i], term.split(" "));
    document.querySelector(".search-results-items").appendChild(item);
  };
}

let currentTerm = undefined;

async function elasticSearchAuto(term) {
  if (term === currentTerm) {
   return;
  }

  resetSearchResults();
  currentTerm = term;
  if (term === "") {
    return;
  }

  elasticSearch(term);
}

function processQueryString() {
  var params = new URLSearchParams(window.location.search);
  if (params.has("query")){
    var query = params.get("query");
    elasticSearch(query);
    return query;
  } else {
    return "";
  }
}

function init() {
  var $searchInput = document.getElementById("search-input");
  if ($searchInput !== null) {
    $searchInput.addEventListener("keyup", debounce(async function() {
      elasticSearchAuto($searchInput.value.trim());
    }, 150));

    $searchInput.addEventListener("keydown", async function(event) {
      if (event.key === "Enter" || event.keyCode === 13) {
        elasticSearch($searchInput.value.trim());
      }
    });

    var $searchButton = document.getElementById("search-button");
    $searchButton.addEventListener("click", async function(event) {
      event.preventDefault()
      elasticSearch($searchInput.value.trim());
    });

    $searchInput.value = processQueryString();
  }
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
