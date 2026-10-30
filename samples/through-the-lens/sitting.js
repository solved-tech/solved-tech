(function () {
  var note = {
    root: document.getElementById("note"),
    gazeLive: document.getElementById("gazeLive"),
    takeHuge: document.getElementById("takeHuge"),
    sitter: document.getElementById("nSitter"),
    gaze: document.getElementById("nGaze"),
    kept: document.getElementById("nKept"),
    light: document.getElementById("nLight"),
    lens: document.getElementById("nLens"),
    asked: document.getElementById("nAsked"),
    credit: document.getElementById("nCredit"),
  };
  var lightText = note.light ? note.light.textContent : "";
  var lensHtml = note.lens ? note.lens.innerHTML : "";
  var book = document.getElementById("book");
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
    if (note.root) note.root.classList.remove("is-clear");
    note.gazeLive.textContent = el.getAttribute("data-label") || "";
    note.takeHuge.textContent = el.getAttribute("data-take") || "";
    note.sitter.textContent = el.getAttribute("data-sitter") || "";
    note.gaze.textContent = el.getAttribute("data-gaze") || "";
    note.kept.textContent = el.getAttribute("data-kept") || "";
    if (note.light) note.light.textContent = lightText;
    if (note.lens) note.lens.innerHTML = lensHtml;
    note.asked.textContent = el.getAttribute("data-asked") || "";
    note.credit.textContent = el.getAttribute("data-credit") || "";
  }

  function clearNote() {
    if (current === "book") return;
    current = "book";
    if (note.root) note.root.classList.add("is-clear");
    note.gazeLive.textContent = "";
    note.takeHuge.textContent = "";
    note.sitter.textContent = "";
    note.gaze.textContent = "";
    note.kept.textContent = "";
    if (note.light) note.light.textContent = "";
    if (note.lens) note.lens.textContent = "";
    note.asked.textContent = "";
    note.credit.textContent = "";
  }

  /* Active = last .spread whose top <= bar height + 0.35 * vh.
     When #book's top is at or above that line, the note is cleared. */
  function spy() {
    if (!desktop.matches || spreads.length === 0) return;
    var threshold = barH + 0.35 * window.innerHeight;
    if (book && book.getBoundingClientRect().top <= threshold) {
      clearNote();
      return;
    }
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
