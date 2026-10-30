(function () {
  var wide = window.matchMedia("(min-width: 901px)");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var rest = document.getElementById("loupe-rest");
  var floatLoupe = document.getElementById("loupe-float");
  var floatImg = document.getElementById("loupe-float-img");
  var floatLabel = document.getElementById("loupe-float-label");
  var layer = document.getElementById("loupe-layer");
  var layerImg = document.getElementById("loupe-full-img");
  var layerLabel = document.getElementById("loupe-layer-label");
  var keeps = Array.prototype.slice.call(document.querySelectorAll(".keep"));
  var rolls = Array.prototype.slice.call(document.querySelectorAll(".roll"));
  var strips = Array.prototype.slice.call(document.querySelectorAll(".strip"));
  var pinned = false;
  var pinOpener = null;
  var touchOpener = null;
  var active = null;
  var dragged = false;
  var startX = 0;
  var startY = 0;
  var ticking = false;

  function setImage(img, keep) {
    var src = keep.getAttribute("data-loupe");
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.classList.toggle("is-zoom", keep.getAttribute("data-zoom") === "1");
  }

  function positionFloat(keep) {
    var rect = keep.getBoundingClientRect();
    var size = 148;
    floatLoupe.style.left = rect.left + rect.width / 2 - size / 2 + "px";
    floatLoupe.style.top = rect.top + rect.height / 2 - size / 2 + "px";
  }

  function showFloat(keep) {
    if (!wide.matches) return;
    active = keep;
    setImage(floatImg, keep);
    floatLabel.textContent = "loupe · " + keep.getAttribute("data-keep");
    positionFloat(keep);
    floatLoupe.hidden = false;
    rest.classList.add("is-quiet");
  }

  var suppressFocus = false;

  function showRest() {
    active = null;
    floatLoupe.hidden = true;
    rest.classList.remove("is-quiet");
  }

  function openLayer(keep) {
    touchOpener = keep;
    setImage(layerImg, keep);
    layerLabel.textContent = "loupe · " + keep.getAttribute("data-keep");
    layer.hidden = false;
    window.requestAnimationFrame(function () {
      layer.focus();
    });
  }

  function closeLayer() {
    layer.hidden = true;
    if (touchOpener) touchOpener.focus();
  }

  function spy() {
    var line = window.innerHeight * 0.35;
    var current = rolls[0];
    rolls.forEach(function (roll) {
      if (roll.getBoundingClientRect().top <= line) current = roll;
    });
    rolls.forEach(function (roll) {
      if (roll === current) roll.setAttribute("aria-current", "true");
      else roll.removeAttribute("aria-current");
    });
  }

  function snapSpy(strip) {
    if (wide.matches) {
      strip.querySelectorAll(".frame").forEach(function (frame) {
        frame.removeAttribute("aria-current");
      });
      return;
    }
    var box = strip.getBoundingClientRect();
    var mid = box.left + box.width / 2;
    var best = null;
    var bestDist = Infinity;
    strip.querySelectorAll(".frame").forEach(function (frame) {
      var rect = frame.getBoundingClientRect();
      var dist = Math.abs(rect.left + rect.width / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = frame;
      }
      frame.removeAttribute("aria-current");
    });
    if (best) best.setAttribute("aria-current", "true");
  }

  function syncStrips() {
    strips.forEach(function (strip) {
      if (wide.matches) strip.removeAttribute("tabindex");
      else strip.tabIndex = 0;
      snapSpy(strip);
    });
    if (!wide.matches) {
      floatLoupe.hidden = true;
      pinned = false;
      pinOpener = null;
      active = null;
    } else if (!active) {
      showRest();
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      spy();
      strips.forEach(snapSpy);
      if (active && wide.matches && !floatLoupe.hidden) positionFloat(active);
      ticking = false;
    });
  }

  keeps.forEach(function (keep) {
    keep.addEventListener("pointerenter", function () {
      if (!fine.matches || !wide.matches || pinned) return;
      showFloat(keep);
    });
    keep.addEventListener("pointerleave", function () {
      if (pinned) return;
      if (document.activeElement && document.activeElement.classList.contains("keep")) {
        showFloat(document.activeElement);
        return;
      }
      showRest();
    });
    keep.addEventListener("focus", function () {
      if (suppressFocus) {
        suppressFocus = false;
        return;
      }
      if (wide.matches && fine.matches) showFloat(keep);
    });
    keep.addEventListener("blur", function () {
      window.requestAnimationFrame(function () {
        var next = document.activeElement;
        if (pinned) return;
        if (!next || !next.classList.contains("keep")) showRest();
      });
    });
    keep.addEventListener("click", function () {
      if (dragged) {
        dragged = false;
        return;
      }
      if (!wide.matches || !fine.matches) {
        openLayer(keep);
        return;
      }
      pinned = true;
      pinOpener = keep;
      showFloat(keep);
    });
  });

  strips.forEach(function (strip) {
    strip.addEventListener(
      "pointerdown",
      function (event) {
        dragged = false;
        startX = event.clientX;
        startY = event.clientY;
      },
      { passive: true },
    );
    strip.addEventListener(
      "pointermove",
      function (event) {
        if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) dragged = true;
      },
      { passive: true },
    );
    strip.addEventListener("scroll", onScroll, { passive: true });
  });

  strips.forEach(function (strip) {
    strip.addEventListener("pointerup", function () {
      window.setTimeout(function () {
        dragged = false;
      }, 0);
    });
  });

  layer.addEventListener("pointerdown", function (event) {
    startY = event.clientY;
  });
  layer.addEventListener("pointerup", function () {
    closeLayer();
  });

  document.addEventListener("keydown", function (event) {
    if (!layer.hidden && event.key === "Tab") {
      event.preventDefault();
      layer.focus({ focusVisible: true });
      return;
    }
    if (event.key !== "Escape") return;
    if (!layer.hidden) {
      event.preventDefault();
      closeLayer();
      return;
    }
    if (pinned && pinOpener) {
      event.preventDefault();
      var back = pinOpener;
      pinned = false;
      pinOpener = null;
      showRest();
      if (document.activeElement !== back) {
        suppressFocus = true;
        back.focus();
      }
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  wide.addEventListener("change", syncStrips);
  syncStrips();
  spy();
})();
