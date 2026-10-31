const SERIES = {
  brutalism: {
    code: "001",
    title: "brutalism",
    photoCount: 6,
    trackTotal: 7,
    plates: [
      {
        file: "b04-sebastien-lavalaye",
        tone: "light",
        w: "c",
        wpx: 1920,
        hpx: 1273,
        alt: "Looking up a repeating pattern of curved concrete shell forms",
        credit:
          "Sébastien Lavalaye / Unsplash · https://unsplash.com/photos/abstract-architectural-detail-with-repeating-curved-shapes-WSvuTQGg6sg",
        land: true,
      },
      { pause: true, w: "pause" },
      {
        file: "b03-rowan-heuvel",
        tone: "light",
        w: "e",
        wpx: 1920,
        hpx: 1281,
        alt: "Low-angle view of a concrete facade with deep vertical fins and recessed windows",
        credit:
          "Rowan Heuvel / Unsplash · https://unsplash.com/photos/modern-concrete-building-facade-with-repeating-window-pattern-czJvFnRvaf4",
      },
      {
        file: "b05-declan-sun",
        tone: "dark",
        w: "a",
        wpx: 1920,
        hpx: 2880,
        alt: "Multi-level concrete walkways and beams opening onto a bright void",
        credit:
          "Declan Sun / Unsplash · https://unsplash.com/photos/concrete-architecture-inside-a-brutalist-structure-7WQlCMzGGI8",
      },
      {
        file: "b06-marcio-skull",
        tone: "dark",
        w: "f",
        wpx: 1600,
        hpx: 2133,
        alt: "Worm’s-eye view of a board-marked concrete tower against a pale sky",
        credit:
          "Marcio Skull / Pexels · https://www.pexels.com/photo/dramatic-black-and-white-brutalist-architecture-32191170/",
      },
      {
        file: "b01-julia-taubitz",
        tone: "dark",
        w: "b",
        wpx: 1920,
        hpx: 1280,
        alt: "Brutalist concrete building with horizontal ribbon windows above a stone plaza",
        credit:
          "Julia Taubitz / Unsplash · https://unsplash.com/photos/brutalist-concrete-building-with-many-windows-PBZr1SVALPE",
      },
      {
        file: "b02-julia-taubitz",
        tone: "light",
        w: "d",
        wpx: 1920,
        hpx: 2880,
        alt: "Concrete pillars and stairs framing an empty courtyard under a heavy roof",
        credit:
          "Julia Taubitz / Unsplash · https://unsplash.com/photos/concrete-brutalist-architecture-with-stairs-and-buildings-3TBzCd2ECVE",
      },
    ],
  },
  flesh: {
    code: "002",
    title: "flesh",
    photoCount: 4,
    trackTotal: 5,
    plates: [
      {
        file: "f02-eugenia-pankiv",
        tone: "light",
        w: "c",
        wpx: 1920,
        hpx: 2880,
        alt: "Close black-and-white face half cut by a hard diagonal shadow",
        credit:
          "Eugenia Pan'kiv / Unsplash · https://unsplash.com/photos/black-and-white-portrait-of-a-woman-with-dramatic-lighting-l0uhKKvNaak",
      },
      { pause: true, w: "pause" },
      {
        file: "f04-dave-garcia",
        tone: "light",
        w: "a",
        wpx: 1600,
        hpx: 2400,
        alt: "High-contrast black-and-white portrait of a woman looking into the lens",
        credit:
          "Dave Garcia / Pexels · https://www.pexels.com/photo/high-contrast-black-and-white-portrait-of-a-woman-37573323/",
      },
      {
        file: "f06-italo-melo",
        tone: "dark",
        w: "e",
        wpx: 1600,
        hpx: 2000,
        alt: "Portrait of a bearded man in a crew-neck shirt against a textured wall",
        credit: "Italo Melo / Pexels · https://www.pexels.com/photo/2379005/",
      },
      {
        file: "f07-mohamed-elamine-msiouri",
        tone: "dark",
        w: "d",
        wpx: 2400,
        hpx: 3797,
        alt: "Black-and-white portrait of a man with one side of his face lit and the rest lost in shadow",
        credit: "Mohamed elamine M'siouri / Pexels · https://www.pexels.com/photo/4412516/",
      },
    ],
  },
  wasteland: {
    code: "003",
    title: "wasteland",
    photoCount: 4,
    trackTotal: 5,
    plates: [
      {
        file: "w06-nathan-cowley",
        tone: "dark",
        w: "c",
        wpx: 1600,
        hpx: 2400,
        alt: "Winding forest highway fading into thick fog",
        credit:
          "Nathan Cowley / Pexels · https://www.pexels.com/photo/highway-in-the-middle-of-forest-covered-in-fog-1161375/",
      },
      { pause: true, w: "pause" },
      {
        file: "w07-anna-galimova",
        tone: "light",
        w: "e",
        wpx: 1600,
        hpx: 2133,
        alt: "Two-lane road into fog with a forested embankment",
        credit:
          "Anna Galimova / Pexels · https://www.pexels.com/photo/gray-asphalt-road-between-green-trees-covered-with-fog-9283762/",
      },
      {
        file: "w05-craig-adderley",
        tone: "light",
        w: "a",
        wpx: 1600,
        hpx: 1067,
        alt: "Wet asphalt road running straight between autumn trees under a grey sky",
        credit:
          "Craig Adderley / Pexels · https://www.pexels.com/photo/concrete-road-between-trees-1563356/",
      },
      {
        file: "w04-aleks-magnusson",
        tone: "dark",
        w: "b",
        wpx: 1600,
        hpx: 1280,
        alt: "Fogged bus shelter beside a wet road that disappears into mist",
        credit: "Aleks Magnusson / Pexels · https://www.pexels.com/photo/empty-road-with-fog-3071474/",
      },
    ],
  },
  archive04: {
    code: "004",
    title: "archive",
    photoCount: 0,
    trackTotal: 0,
    emptied: true,
    plates: [{ empty: true, w: "c" }],
  },
};

const LAND = {
  avif: "assets/photos/avif/b04-lcp.avif",
  webp: "assets/photos/webp/b04-lcp.webp",
  jpg: "assets/photos/lcp/b04-lcp.jpg",
  wpx: 1440,
  hpx: 954,
};

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const narrow = () => matchMedia("(max-width: 767px)").matches;

const scroller = document.getElementById("scroller");
const track = document.getElementById("track");
const announce = document.getElementById("announce");
const dlg = document.getElementById("focusDlg");
const focusImg = document.getElementById("focusImg");
const focusTitle = document.getElementById("focusTitle");
const vaultEl = document.getElementById("vault");
const vaultToggle = document.getElementById("vaultToggle");
const stamp04 = document.getElementById("stamp04");
const seriesEdge = document.getElementById("seriesEdge");
const exitBtn = document.getElementById("exitBtn");

let active = "brutalism";
let index = 0;
let plates = SERIES.brutalism.plates;
let vaultOn = false;
let io = null;
let suppressPlateAnnounce = false;

function webpSrc(file) {
  return `assets/photos/webp/${file}.webp`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

function serialOf(i) {
  const series = SERIES[active];
  return `${series.code}·${pad2(i + 1)} / ${pad3(series.trackTotal)}`;
}

function trackLabel() {
  const series = SERIES[active];
  if (series.emptied) return "004 / archive — this archive has been removed.";
  return `${series.code} / ${series.title}, ${series.trackTotal} plates, ${series.photoCount} photos`;
}

function say(text) {
  if (announce.textContent !== text) announce.textContent = text;
}

function easeSnap(t) {
  const cx = 3 * 0.2;
  const bx = 3 * (0 - 0.2) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 0;
  const by = 3 * (1 - 0) - cy;
  const ay = 1 - cy - by;
  const xFor = (u) => ((ax * u + bx) * u + cx) * u;
  const yFor = (u) => ((ay * u + by) * u + cy) * u;
  let u = t;
  for (let i = 0; i < 5; i += 1) {
    const x = xFor(u) - t;
    const dx = 3 * ax * u * u + 2 * bx * u + cx;
    if (Math.abs(dx) < 1e-6) break;
    u -= x / dx;
  }
  return yFor(Math.min(1, Math.max(0, u)));
}

function snapInline(el) {
  if (el && el.classList.contains("is-land") && narrow()) return "start";
  return "center";
}

function targetLeft(el) {
  const inline = snapInline(el);
  const raw =
    inline === "start" ? el.offsetLeft : el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  return Math.max(0, Math.min(max, raw));
}

function snapTo(el) {
  if (!el) return;
  const left0 = scroller.scrollLeft;
  const target = targetLeft(el);
  const dist = target - left0;
  if (Math.abs(dist) < 1) return;
  if (reduceMotion()) {
    scroller.scrollLeft = target;
    return;
  }
  const dur = 450;
  const t0 = performance.now();
  const frame = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    scroller.scrollLeft = left0 + dist * easeSnap(p);
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function bindPlate(el) {
  const i = Number(el.dataset.index);
  if (el.dataset.pause === "1" || el.classList.contains("is-empty-archive")) return;
  const media = el.querySelector("img");
  if (media) media.addEventListener("click", () => openFocus(i));
  el.addEventListener("click", (event) => {
    if (event.target === el) openFocus(i);
  });
}

function observe() {
  if (io) io.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          index = Number(entry.target.dataset.index);
          if (!suppressPlateAnnounce) updateLabel(false);
        }
      });
    },
    { root: scroller, threshold: [0.6] },
  );
  [...scroller.children].forEach((child) => {
    if (child.classList.contains("plate")) io.observe(child);
  });
}

function photoFigure(plate, serial) {
  const fig = document.createElement("figure");
  let media;
  if (plate.land) {
    const pic = document.createElement("picture");
    const avif = document.createElement("source");
    avif.type = "image/avif";
    avif.srcset = LAND.avif;
    const webp = document.createElement("source");
    webp.type = "image/webp";
    webp.srcset = LAND.webp;
    media = document.createElement("img");
    media.alt = plate.alt;
    media.width = LAND.wpx;
    media.height = LAND.hpx;
    media.decoding = "async";
    media.fetchPriority = "high";
    media.loading = "eager";
    media.src = LAND.jpg;
    pic.append(avif, webp, media);
    fig.append(pic);
  } else {
    media = document.createElement("img");
    media.alt = plate.alt;
    media.width = plate.wpx;
    media.height = plate.hpx;
    media.decoding = "async";
    media.loading = "lazy";
    media.src = webpSrc(plate.file);
    fig.append(media);
  }
  const stamp = document.createElement("span");
  stamp.className = `serial-stamp ${plate.tone === "light" ? "on-light" : "on-dark"}`;
  stamp.setAttribute("aria-hidden", "true");
  stamp.textContent = serial;
  const cap = document.createElement("figcaption");
  cap.className = "visually-hidden";
  cap.textContent = plate.credit;
  fig.append(stamp, cap);
  return fig;
}

function renderTrack(seriesKey, startIndex = 0, seriesChange = true) {
  active = seriesKey;
  const series = SERIES[seriesKey];
  plates = series.plates;
  index = Math.max(0, Math.min(startIndex, plates.length - 1));
  scroller.replaceChildren();
  const edge = seriesEdge.querySelector(".edge-label");
  if (edge) edge.textContent = `${series.code} / ${series.title}`;

  if (series.emptied) {
    const el = document.createElement("article");
    el.className = "plate is-empty-archive";
    el.dataset.w = "c";
    el.dataset.index = "0";
    el.dataset.pause = "0";
    const hidden = document.createElement("p");
    hidden.className = "visually-hidden";
    hidden.textContent = "this archive has been removed.";
    el.append(hidden);
    scroller.append(el);
    plates = [{ empty: true, w: "c" }];
    index = 0;
  } else {
    plates.forEach((plate, i) => {
      const el = document.createElement("article");
      const serial = serialOf(i);
      el.dataset.w = plate.w || "a";
      el.dataset.index = String(i);
      el.dataset.serial = serial;
      if (plate.pause) {
        el.className = "plate is-pause";
        el.dataset.pause = "1";
        const markVoid = document.createElement("span");
        markVoid.className = "void-mark";
        markVoid.dataset.mode = "void";
        markVoid.setAttribute("aria-hidden", "true");
        markVoid.textContent = "void";
        const markSerial = document.createElement("span");
        markSerial.className = "void-mark";
        markSerial.dataset.mode = "serial";
        markSerial.setAttribute("aria-hidden", "true");
        markSerial.textContent = serial;
        const vh = document.createElement("span");
        vh.className = "visually-hidden";
        vh.textContent = `${serial} · plate 2 of ${series.trackTotal}, pause, no image`;
        el.append(markVoid, markSerial, vh);
      } else {
        el.className = `plate${plate.land ? " is-land" : ""}`;
        el.dataset.pause = "0";
        el.append(photoFigure(plate, serial));
      }
      bindPlate(el);
      scroller.append(el);
    });
  }

  observe();
  if (seriesChange) suppressPlateAnnounce = true;
  requestAnimationFrame(() => snapTo(scroller.children[index]));
  updateLabel(seriesChange);
  syncStamps();
  if (seriesChange) window.setTimeout(() => {
    suppressPlateAnnounce = false;
  }, 600);
}

function syncStamps() {
  document.querySelectorAll("#series button").forEach((btn) => {
    const key = btn.dataset.series;
    if (key === "archive04") {
      btn.hidden = !vaultOn;
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("aria-pressed", "false");
      btn.tabIndex = -1;
      return;
    }
    btn.setAttribute("aria-pressed", btn.dataset.series === active ? "true" : "false");
  });
}

function updateLabel(seriesChange) {
  const series = SERIES[active];
  if (series.emptied) {
    track.setAttribute("aria-label", "004 / archive — this archive has been removed.");
    say(seriesChange ? "004 / archive" : "this archive has been removed.");
    return;
  }
  const label = trackLabel();
  track.setAttribute("aria-label", label);
  const plate = plates[index];
  const serial = serialOf(index);
  const total = series.trackTotal;
  const slot = index + 1;
  if (seriesChange) {
    say(label);
    return;
  }
  if (plate && plate.pause) {
    say(`${serial} · plate ${slot} of ${total}, pause, no image`);
    return;
  }
  const alt = plate && plate.alt ? plate.alt : "";
  say(alt ? `${serial} · plate ${slot} of ${total}. ${alt}` : `${serial} · plate ${slot} of ${total}.`);
}

function go(delta) {
  const next = index + delta;
  if (next < 0 || next >= plates.length) return;
  index = next;
  snapTo(scroller.children[index]);
  updateLabel(false);
}

function openFocus(i) {
  const plate = plates[i];
  if (!plate || plate.pause || plate.empty || !plate.file) return;
  index = i;
  snapTo(scroller.children[i]);
  const series = SERIES[active];
  const serial = serialOf(i);
  focusTitle.textContent = `${serial} · ${series.code} / ${series.title}`;
  focusImg.alt = plate.alt || "";
  focusImg.width = plate.wpx || LAND.wpx;
  focusImg.height = plate.hpx || LAND.hpx;
  focusImg.src = webpSrc(plate.file);
  const ready = focusImg.decode ? focusImg.decode().catch(() => {}) : Promise.resolve();
  if (typeof dlg.showModal === "function") dlg.showModal();
  exitBtn.focus();
  dlg.classList.remove("is-flash", "is-zoom");
  if (!reduceMotion()) {
    ready.then(() => {
      if (!dlg.open || reduceMotion()) return;
      dlg.classList.add("is-flash");
      window.setTimeout(() => {
        if (!dlg.open) return;
        dlg.classList.remove("is-flash");
        dlg.classList.add("is-zoom");
      }, 80);
    });
  }
}

function placeTrackFocus(visible) {
  const options = { preventScroll: true };
  if (visible) options.focusVisible = true;
  track.focus(options);
}

function closeFocus(fromKeyboard) {
  if (dlg.open) dlg.close();
  placeTrackFocus(Boolean(fromKeyboard));
  updateLabel(false);
}

function setVault(on) {
  vaultOn = on;
  vaultEl.classList.toggle("is-on", on);
  vaultToggle.setAttribute("aria-pressed", on ? "true" : "false");
  stamp04.hidden = !on;
  stamp04.setAttribute("aria-disabled", "true");
  stamp04.tabIndex = -1;
  if (!on && active === "archive04") {
    renderTrack("brutalism", 0, true);
    return;
  }
  syncStamps();
  if (on) say("archive 04 is gone. forever.");
}

exitBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  closeFocus(false);
});

dlg.addEventListener("click", (event) => {
  if (event.target === dlg || event.target.id === "focusStage" || event.target.id === "focusImg") closeFocus(false);
});

dlg.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFocus(true);
});

vaultToggle.addEventListener("click", () => setVault(!vaultOn));

const stampRing = document.getElementById("stampRing");
const mainEl = document.getElementById("main");
const seriesNav = document.getElementById("series");

function placeStampRing(btn) {
  if (!stampRing || !mainEl) return;
  if (!btn || !btn.matches(":focus-visible")) {
    stampRing.hidden = true;
    return;
  }
  const host = mainEl.getBoundingClientRect();
  const box = btn.getBoundingClientRect();
  stampRing.hidden = false;
  stampRing.style.left = `${box.left - host.left}px`;
  stampRing.style.top = `${box.top - host.top}px`;
  stampRing.style.width = `${box.width}px`;
  stampRing.style.height = `${box.height}px`;
}

seriesNav.addEventListener("focusin", (event) => {
  const btn = event.target.closest("button");
  window.requestAnimationFrame(() => placeStampRing(btn));
});
seriesNav.addEventListener("focusout", () => {
  window.requestAnimationFrame(() => {
    const active = document.activeElement;
    if (!active || !seriesNav.contains(active)) stampRing.hidden = true;
  });
});
window.addEventListener("resize", () => {
  const active = document.activeElement;
  if (active && seriesNav.contains(active)) placeStampRing(active);
});

document.querySelectorAll("#series button").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (btn.getAttribute("aria-disabled") === "true") return;
    renderTrack(btn.dataset.series, 0, true);
    placeTrackFocus(event.detail === 0);
  });
  btn.addEventListener("keydown", (event) => {
    const buttons = [...document.querySelectorAll('#series button:not([hidden]):not([aria-disabled="true"])')];
    const i = buttons.indexOf(btn);
    if (i < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      buttons[(i + 1) % buttons.length].focus({ focusVisible: true });
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      buttons[(i - 1 + buttons.length) % buttons.length].focus({ focusVisible: true });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      btn.click();
    }
  });
});

track.addEventListener("keydown", (event) => {
  if (dlg.open) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    go(1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    go(-1);
  } else if (event.key === "Home") {
    event.preventDefault();
    index = 0;
    snapTo(scroller.children[0]);
    updateLabel(false);
  } else if (event.key === "End") {
    event.preventDefault();
    index = plates.length - 1;
    snapTo(scroller.children[index]);
    updateLabel(false);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFocus(index);
  } else if (event.key === "1") {
    renderTrack("brutalism", 0, true);
    placeTrackFocus(true);
  } else if (event.key === "2") {
    renderTrack("flesh", 0, true);
    placeTrackFocus(true);
  } else if (event.key === "3") {
    renderTrack("wasteland", 0, true);
    placeTrackFocus(true);
  }
});

const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reticle = document.getElementById("reticle");
if (fine && reticle) {
  document.body.classList.add("has-reticle");
  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;
  let armed = false;
  let raf = 0;
  const paint = () => {
    reticle.style.left = `${rx}px`;
    reticle.style.top = `${ry}px`;
  };
  const tick = () => {
    raf = 0;
    if (!armed) return;
    if (reduceMotion()) {
      rx = x;
      ry = y;
    } else {
      rx += (x - rx) * 0.25;
      ry += (y - ry) * 0.25;
    }
    paint();
    if (!reduceMotion() && (Math.abs(x - rx) > 0.4 || Math.abs(y - ry) > 0.4)) {
      raf = requestAnimationFrame(tick);
    }
  };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    if (event.clientX < 2 && event.clientY < 2) return;
    x = event.clientX;
    y = event.clientY;
    if (!armed) {
      armed = true;
      document.body.classList.add("is-pointer");
      rx = x;
      ry = y;
    }
    if (reduceMotion()) {
      rx = x;
      ry = y;
      paint();
      return;
    }
    if (!raf) raf = requestAnimationFrame(tick);
  });
}

[...scroller.querySelectorAll(".plate")].forEach((el) => bindPlate(el));
observe();
syncStamps();
suppressPlateAnnounce = true;
updateLabel(true);
window.setTimeout(() => {
  suppressPlateAnnounce = false;
}, 600);

const params = new URLSearchParams(location.search);
if (params.get("vault") === "1") setVault(true);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dlg.open) closeFocus(true);
});
