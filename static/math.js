window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]]
  },
  output: {
    font: "mathjax-fira"
  }
};

let loadScript = (path) => {
  let script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/" + path;
  script.async = true;
  document.head.appendChild(script);
};

loadScript("mathjax@4.0.0-beta.3/tex-mml-chtml.js");
