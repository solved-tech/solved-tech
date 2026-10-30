(() => {
  const body = document.body;
  const rail = document.getElementById("rail");
  const links = [...rail.querySelectorAll("a")];
  const sections = [...document.querySelectorAll(".fold[data-hour], .hour[data-hour]")];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let railLock = false;
  let animating = false;
  let lockTimer = 0;
  let generation = 0;

  function reduced() {
    return motion.matches;
  }

  function stickyOffset() {
    return getComputedStyle(rail).flexDirection === "row" ? rail.getBoundingClientRect().height : 0;
  }

  function setRailSize() {
    document.documentElement.style.setProperty("--rail-sticky-size", `${stickyOffset()}px`);
  }

  function applyHour(hour) {
    body.setAttribute("data-hour", hour);
    const src = document.querySelector(`.fold[data-hour="${hour}"], .hour[data-hour="${hour}"]`) || body;
    const computed = getComputedStyle(src);
    ["--bg", "--ink", "--mute", "--accent", "--rule", "--w-display"].forEach((key) => {
      const value = computed.getPropertyValue(key).trim();
      if (value) body.style.setProperty(key, value);
    });
    links.forEach((link) => {
      if (link.dataset.h === hour) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function spy() {
    if (railLock) return;
    const band = stickyOffset() + 0.35 * window.innerHeight;
    let active = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= band) active = section;
    });
    const hour = active?.getAttribute("data-hour");
    if (hour && body.getAttribute("data-hour") !== hour) applyHour(hour);
  }

  function releaseLock() {
    railLock = false;
    window.clearTimeout(lockTimer);
    spy();
  }

  function armLock() {
    railLock = true;
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(releaseLock, 500);
  }

  function scrollToTarget(target) {
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - stickyOffset());
    const delta = top - window.scrollY;
    const gen = ++generation;
    if (reduced() || Math.abs(delta) < 2) {
      animating = false;
      window.scrollTo(0, top);
      return;
    }
    animating = true;
    const duration = Math.min(400, Math.max(1, Math.abs(delta) * 0.22));
    const start = window.scrollY;
    const t0 = performance.now();
    const step = (now) => {
      if (gen !== generation) {
        animating = false;
        return;
      }
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - progress) ** 3;
      window.scrollTo(0, start + delta * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }
      window.scrollTo(0, top);
      animating = false;
    };
    requestAnimationFrame(step);
  }

  function goTo(hour, hash) {
    const target = document.querySelector(hash);
    if (!target || !hour) return;
    generation += 1;
    armLock();
    applyHour(hour);
    history.replaceState(null, "", hash);
    scrollToTarget(target);
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      goTo(link.dataset.h, link.getAttribute("href"));
    });
  });

  window.addEventListener("scroll", () => spy(), { passive: true });
  window.addEventListener("scrollend", () => {
    if (railLock && !animating) releaseLock();
  });
  window.addEventListener("resize", () => {
    setRailSize();
    spy();
  });

  setRailSize();
  if (document.fonts?.ready) document.fonts.ready.then(setRailSize).catch(() => {});

  const hashTarget = location.hash ? document.querySelector(location.hash) : null;
  const hashHour = hashTarget?.getAttribute("data-hour");
  if (hashHour) {
    armLock();
    applyHour(hashHour);
    const top = window.scrollY + hashTarget.getBoundingClientRect().top - stickyOffset();
    window.scrollTo(0, top);
  } else {
    spy();
  }
})();
