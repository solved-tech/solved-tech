const META = {
  brutalism: { code: "001", title: "brutalism", total: 7, photos: 6, emptied: false },
  flesh: { code: "002", title: "flesh", total: 5, photos: 4, emptied: false },
  wasteland: { code: "003", title: "wasteland", total: 5, photos: 4, emptied: false },
  archive04: { code: "004", title: "archive", total: 0, photos: 0, emptied: true },
};

const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

const scroller = document.getElementById("scroller");
const well = document.getElementById("well");
const announce = document.getElementById("announce");
const depthMark = document.getElementById("depthMark");
const dlg = document.getElementById("focusDlg");
const focusTitle = document.getElementById("focusTitle");
const focusStage = document.getElementById("focusStage");
let focusImg = document.getElementById("focusImg");
const vaultEl = document.getElementById("vault");
const vaultToggle = document.getElementById("vaultToggle");
const stamp04 = document.getElementById("stamp04");
const exitBtn = document.getElementById("exitBtn");
const reticle = document.getElementById("reticle");

document.documentElement.classList.add("is-zooming");

let active = "brutalism";
let index = 0;
let plates = [];
let vaultOn = false;
let diving = false;
let moveGen = 0;
let latchedUntil = 0;
let booted = false;
let wheelAccum = 0;

function motionAllowed() {
  return !reduceQuery.matches;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function visiblePlates() {
  if (!scroller) return [];
  return [...scroller.querySelectorAll(".plate")].filter((plate) => !plate.hidden);
}

function trackLabel() {
  const series = META[active];
  if (series.emptied) return "004 / archive — this archive has been removed.";
  return `${series.code} / ${series.title}, ${series.total} plates, ${series.photos} photos`;
}

function photoOrdinal() {
  let count = 0;
  for (let cursor = 0; cursor <= index; cursor += 1) {
    if (plates[cursor]?.dataset.kind === "photo") count += 1;
  }
  return count;
}

function depthText(plate) {
  if (!plate || plate.dataset.kind === "empty") return "depth —";
  if (plate.dataset.kind === "pause") return "void";
  return `depth ${pad2(photoOrdinal())}`;
}

function clearMotion() {
  scroller?.querySelectorAll(".is-diving, .is-arriving").forEach((plate) => {
    plate.classList.remove("is-diving", "is-arriving");
  });
  dlg?.classList.remove("is-flash", "is-zoom");
}

function align(nextIndex) {
  const plate = plates[nextIndex];
  if (!plate || !scroller) return;
  const top = plate.offsetTop;
  if (Math.abs(scroller.scrollTop - top) > 1) {
    scroller.scrollTo({ top, behavior: "auto" });
  }
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
    btn.tabIndex = 0;
    btn.setAttribute("aria-pressed", key === active ? "true" : "false");
  });
}

function updateChrome(seriesChange) {
  const plate = plates[index];
  if (depthMark) depthMark.textContent = depthText(plate);
  if (well) well.setAttribute("aria-label", trackLabel());
  if (!booted) {
    booted = true;
    return;
  }
  if (!announce) return;
  if (seriesChange) {
    announce.textContent = trackLabel();
    return;
  }
  if (plate?.dataset.kind === "pause") {
    announce.textContent = plate.querySelector(".visually-hidden")?.textContent ?? "";
    return;
  }
  if (plate?.dataset.kind === "empty") {
    announce.textContent = "this archive has been removed.";
    return;
  }
  const series = META[active];
  const serial = plate?.dataset.serial ?? "";
  const alt = plate?.querySelector("img")?.getAttribute("alt") ?? "";
  announce.textContent = `${serial} · plate ${index + 1} of ${series.total}. ${alt}`.trim();
}

function applySeries(key, startIndex, seriesChange) {
  if (!META[key] || !scroller) return;
  moveGen += 1;
  diving = false;
  clearMotion();
  active = key;
  scroller.querySelectorAll(".plate").forEach((plate) => {
    plate.hidden = plate.dataset.series !== key;
  });
  plates = visiblePlates();
  index = Math.max(0, Math.min(startIndex, Math.max(plates.length - 1, 0)));
  syncStamps();
  window.requestAnimationFrame(() => {
    align(index);
    updateChrome(seriesChange);
  });
}

function go(delta) {
  if (diving) return;
  const next = index + delta;
  if (next < 0 || next >= plates.length) return;
  const current = plates[index];
  const upcoming = plates[next];
  const bothPhotos = current?.dataset.kind === "photo" && upcoming?.dataset.kind === "photo";
  const allowDive = motionAllowed() && bothPhotos;
  if (!allowDive) {
    index = next;
    align(index);
    updateChrome(false);
    return;
  }
  const gen = moveGen;
  diving = true;
  current.classList.add("is-diving");
  window.setTimeout(() => {
    if (gen !== moveGen) return;
    index = next;
    align(index);
    current.classList.remove("is-diving");
    upcoming.classList.add("is-arriving");
    updateChrome(false);
    window.setTimeout(() => {
      if (gen !== moveGen) return;
      upcoming.classList.remove("is-arriving");
      diving = false;
    }, 280);
  }, 200);
}

function takeStep(delta, hold = 240) {
  const now = performance.now();
  if (now < latchedUntil || diving) return;
  const next = index + delta;
  if (next < 0 || next >= plates.length) return;
  latchedUntil = now + hold;
  go(delta);
}

function jump(next) {
  if (next === index || next < 0 || next >= plates.length) return;
  moveGen += 1;
  diving = false;
  clearMotion();
  index = next;
  align(index);
  updateChrome(false);
}

function openFocus(plateIndex) {
  const plate = plates[plateIndex];
  if (!plate || plate.dataset.kind !== "photo" || !dlg || !focusStage || !focusTitle || !exitBtn) return;
  const img = plate.querySelector("img");
  if (!img) return;
  if (!focusImg) {
    focusImg = document.createElement("img");
    focusImg.id = "focusImg";
    focusImg.alt = "";
    focusStage.appendChild(focusImg);
  }
  index = plateIndex;
  const series = META[active];
  focusTitle.textContent = `${plate.dataset.serial ?? ""} · ${series.code} / ${series.title}`;
  focusImg.alt = img.alt;
  focusImg.src = img.currentSrc || img.src;
  if (!dlg.open) dlg.showModal();
  exitBtn.focus();
  dlg.classList.remove("is-flash", "is-zoom");
  if (!motionAllowed()) return;
  window.requestAnimationFrame(() => {
    if (!motionAllowed() || !dlg.open) return;
    dlg.classList.add("is-flash");
    window.setTimeout(() => {
      if (!dlg.open || !motionAllowed()) {
        dlg.classList.remove("is-flash", "is-zoom");
        return;
      }
      dlg.classList.remove("is-flash");
      dlg.classList.add("is-zoom");
    }, 80);
  });
}

function closeFocus() {
  dlg?.classList.remove("is-flash", "is-zoom");
  if (dlg?.open) dlg.close();
  well?.focus({ preventScroll: true });
}

function setVault(on) {
  vaultOn = on;
  vaultEl?.classList.toggle("is-on", on);
  vaultToggle?.setAttribute("aria-pressed", on ? "true" : "false");
  if (stamp04) {
    stamp04.hidden = !on;
    stamp04.setAttribute("aria-disabled", "true");
    stamp04.tabIndex = -1;
  }
  if (!on && active === "archive04") applySeries("brutalism", 0, true);
  else {
    syncStamps();
    window.requestAnimationFrame(() => align(index));
  }
}

function inWell(event) {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  if (target.closest("footer, #vaultToggle, dialog, .skip, .vault")) return false;
  if (target.closest("#well")) return true;
  return window.innerWidth < 1440 && Boolean(target.closest(".series"));
}

function normalizeWheel(event) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

if (scroller && well && dlg && exitBtn && vaultToggle && stamp04) {
  scroller.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || target.closest("button, a")) return;
    const plate = target.closest(".plate");
    if (!plate || plate.hidden) return;
    const plateIndex = plates.indexOf(plate);
    if (plateIndex < 0) return;
    index = plateIndex;
    if (plate.dataset.kind === "photo") openFocus(plateIndex);
    else {
      well.focus({ preventScroll: true });
      updateChrome(false);
    }
  });

  well.addEventListener("keydown", (event) => {
    if (dlg.open) return;
    const key = event.key;
    if (key === "ArrowDown" || key === "ArrowRight" || key === "PageDown") {
      event.preventDefault();
      takeStep(1);
    } else if (key === "ArrowUp" || key === "ArrowLeft" || key === "PageUp") {
      event.preventDefault();
      takeStep(-1);
    } else if (key === "Home") {
      event.preventDefault();
      jump(0);
    } else if (key === "End") {
      event.preventDefault();
      jump(plates.length - 1);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      openFocus(index);
    } else if (key === "1") {
      event.preventDefault();
      applySeries("brutalism", 0, true);
      well.focus({ preventScroll: true });
    } else if (key === "2") {
      event.preventDefault();
      applySeries("flesh", 0, true);
      well.focus({ preventScroll: true });
    } else if (key === "3") {
      event.preventDefault();
      applySeries("wasteland", 0, true);
      well.focus({ preventScroll: true });
    }
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!inWell(event) || dlg.open) return;
      const delta = normalizeWheel(event);
      if (delta === 0) return;
      const atStart = index <= 0 && delta < 0;
      const atEnd = index >= plates.length - 1 && delta > 0;
      if (atStart || atEnd) {
        wheelAccum = 0;
        return;
      }
      event.preventDefault();
      const now = performance.now();
      if (now < latchedUntil || diving) return;
      wheelAccum += delta;
      const threshold = event.deltaMode === 0 ? 28 : 1;
      if (Math.abs(wheelAccum) < threshold) return;
      const direction = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      takeStep(direction, motionAllowed() ? 520 : 400);
    },
    { passive: false, capture: true },
  );

  let touch = null;
  scroller.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        touch = null;
        return;
      }
      const target = event.target;
      if (target instanceof Element && target.closest("button, a")) {
        touch = null;
        return;
      }
      const point = event.touches[0];
      touch = { x: point.clientX, y: point.clientY, id: point.identifier };
    },
    { passive: true },
  );

  scroller.addEventListener(
    "touchmove",
    (event) => {
      if (!touch || dlg.open) return;
      const point = [...event.touches].find((item) => item.identifier === touch.id);
      if (!point) return;
      const deltaY = point.clientY - touch.y;
      const leaving = (index <= 0 && deltaY > 12) || (index >= plates.length - 1 && deltaY < -12);
      if (leaving) return;
      if (Math.abs(deltaY) > 8) event.preventDefault();
    },
    { passive: false },
  );

  scroller.addEventListener("touchend", (event) => {
    if (!touch) return;
    const startX = touch.x;
    const startY = touch.y;
    const point = [...event.changedTouches].find((item) => item.identifier === touch.id);
    touch = null;
    if (!point || dlg.open) return;
    const deltaX = point.clientX - startX;
    const deltaY = point.clientY - startY;
    if (Math.abs(deltaY) < 36 || Math.abs(deltaY) < Math.abs(deltaX)) return;
    takeStep(deltaY < 0 ? 1 : -1);
  });

  document.querySelectorAll("#series button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.getAttribute("aria-disabled") === "true") return;
      const key = btn.dataset.series;
      if (!key || !META[key]) return;
      applySeries(key, 0, true);
      well.focus({ preventScroll: true });
    });
    btn.addEventListener("keydown", (event) => {
      if (btn.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      const group = [...document.querySelectorAll("#series button")].filter(
        (item) => !item.hidden && item.getAttribute("aria-disabled") !== "true",
      );
      const groupIndex = group.indexOf(btn);
      if (groupIndex < 0) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        group[(groupIndex + 1) % group.length]?.focus();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        group[(groupIndex - 1 + group.length) % group.length]?.focus();
      }
    });
  });

  exitBtn.addEventListener("click", closeFocus);
  dlg.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || target.closest(".exit")) return;
    if (target === dlg || target.closest(".stage")) closeFocus();
  });
  dlg.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeFocus();
  });
  vaultToggle.addEventListener("click", () => {
    setVault(!vaultOn);
  });

  reduceQuery.addEventListener("change", () => {
    moveGen += 1;
    diving = false;
    clearMotion();
    document.body.classList.remove("has-reticle");
  });

  if (fineQuery.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!fineQuery.matches || !motionAllowed() || event.pointerType !== "mouse" || !reticle) {
          document.body.classList.remove("has-reticle");
          return;
        }
        document.body.classList.add("has-reticle");
        reticle.style.setProperty("--x", `${event.clientX}px`);
        reticle.style.setProperty("--y", `${event.clientY}px`);
      },
      { passive: true },
    );
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("vault") === "1") setVault(true);
  applySeries("brutalism", 0, false);
}
