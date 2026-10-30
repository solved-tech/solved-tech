(function () {
  var note = {
    gazeLive: document.getElementById("gazeLive"),
    takeHuge: document.getElementById("takeHuge"),
    sitter: document.getElementById("nSitter"),
    gaze: document.getElementById("nGaze"),
    kept: document.getElementById("nKept"),
    asked: document.getElementById("nAsked"),
    credit: document.getElementById("nCredit"),
  };
  var spreads = Array.prototype.slice.call(document.querySelectorAll(".spread"));
  var desktop = window.matchMedia("(min-width: 821px)");
  var current = "";
  var barH = 44;
  var ticking = false;

  function measureBar() {
    var bar = document.querySelector(".bar");
    barH = bar ? bar.getBoundingClientRect().height : 44;
  }

  function apply(el) {
    if (!el || !note.gazeLive || el.id === current) return;
    current = el.id;
    note.gazeLive.textContent = el.getAttribute("data-label") || "";
    note.takeHuge.textContent = el.getAttribute("data-take") || "";
    note.sitter.textContent = el.getAttribute("data-sitter") || "";
    note.gaze.textContent = el.getAttribute("data-gaze") || "";
    note.kept.textContent = el.getAttribute("data-kept") || "";
    note.asked.textContent = el.getAttribute("data-asked") || "";
    note.credit.textContent = el.getAttribute("data-credit") || "";
  }

  /* Active = last .spread whose top <= bar height + 0.35 * vh. */
  function spy() {
    if (!desktop.matches || spreads.length === 0) return;
    var threshold = barH + 0.35 * window.innerHeight;
    var active = spreads[0];
    for (var i = 0; i < spreads.length; i++) {
      if (spreads[i].getBoundingClientRect().top <= threshold) active = spreads[i];
    }
    apply(active);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      spy();
      ticking = false;
    });
  }

  function onResize() {
    measureBar();
    onScroll();
  }

  measureBar();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  if (typeof desktop.addEventListener === "function") {
    desktop.addEventListener("change", function () {
      current = "";
      onResize();
    });
  }
  spy();
})();
