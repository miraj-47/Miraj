const loader = document.querySelector(".loader");
const revealBoxes = [...document.querySelectorAll("[data-reveal]")];
const preloader = document.querySelector("[data-flip-source]");
const postloader = document.querySelector("[data-flip-target]");
const workItems = [...document.querySelectorAll(".work-item")];

const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";
const expoOut = "cubic-bezier(0.16, 1, 0.3, 1)";

document.body.style.overflow = "hidden";
window.scrollTo({ top: 0 });

function animate(element, keyframes, options = {}) {
  if (!element) return Promise.resolve();
  const animation = element.animate(keyframes, {
    fill: "forwards",
    easing: easeOut,
    ...options,
  });
  return animation.finished.catch(() => {});
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function revealBox(box, index) {
  const fromX = getComputedStyle(box).getPropertyValue("--from-x").trim() || "0";
  const fromY = getComputedStyle(box).getPropertyValue("--from-y").trim() || "0";

  animate(box, [
    { opacity: 0, transform: `translate3d(${fromX}, ${fromY}, 0) scale(0)` },
    { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
  ], { duration: 420, delay: 700 + index * 12, easing: "cubic-bezier(0.25, 0.8, 0.25, 1)" });
}

function revealInnerContent() {
  document.querySelectorAll(".content-rise").forEach((element, index) => {
    animate(element, [
      { opacity: 0, transform: "translateY(30px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 800, delay: 1000 + index * 35 });
  });

  document.querySelectorAll(".content-drop").forEach((element) => {
    animate(element, [
      { opacity: 0, transform: "translateY(-10px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 800, delay: 1000 });
  });

  document.querySelectorAll(".content-spin").forEach((element) => {
    animate(element, [
      { opacity: 0, transform: "rotate(180deg)" },
      { opacity: 1, transform: "rotate(0deg)" },
    ], { duration: 1000, delay: 1000, easing: "cubic-bezier(0.11, 0, 0.5, 0)" });
  });

  document.querySelectorAll(".content-spin-reverse").forEach((element) => {
    animate(element, [
      { opacity: 0, transform: "rotate(-180deg)" },
      { opacity: 1, transform: "rotate(0deg)" },
    ], { duration: 1000, delay: 1000, easing: "cubic-bezier(0.11, 0, 0.5, 0)" });
  });

  animate(document.querySelector(".logo"), [
    { opacity: 0, transform: "translateX(-30px)" },
    { opacity: 1, transform: "translateX(0)" },
  ], { duration: 700, delay: 1000 });

  animate(document.querySelector(".template-link"), [
    { opacity: 0, transform: "translateX(30px)" },
    { opacity: 1, transform: "translateX(0)" },
  ], { duration: 700, delay: 1000 });

  document.querySelectorAll(".work-title").forEach((element, index) => {
    animate(element, [
      { transform: "translateY(100%)" },
      { transform: "translateY(0)" },
    ], { duration: 700, delay: 1000 + index * 180 });
  });

  document.querySelectorAll(".work-item").forEach((element, index) => {
    animate(element, [
      { borderBottomColor: "rgba(86, 84, 73, 0)" },
      { borderBottomColor: "rgba(86, 84, 73, 1)" },
    ], { duration: 700, delay: 1000 + index * 180 });
  });

  document.querySelectorAll(".thumbnail").forEach((element) => {
    animate(element, [
      { opacity: 0 },
      { opacity: 1 },
    ], { duration: 500, delay: 1000 });
  });

  document.querySelectorAll(".socials span").forEach((element, index) => {
    animate(element, [
      { transform: "translateY(100%)" },
      { transform: "translateY(0)" },
    ], { duration: 700, delay: 1000 + index * 180 });
  });
}

async function flipPortrait() {
  if (!preloader || !postloader) return;

  await animate(preloader, [
    { transform: "translate(-50%, -50%) scale(1)" },
    { transform: "translate(-50%, -50%) scale(0.8)" },
  ], { duration: 400, easing: "cubic-bezier(0.39, 0.58, 0.57, 1)" });

  await delay(200);

  const source = preloader.getBoundingClientRect();
  const target = postloader.getBoundingClientRect();
  const deltaX = source.left - target.left;
  const deltaY = source.top - target.top;
  const scaleX = source.width / target.width;
  const scaleY = source.height / target.height;

  postloader.style.opacity = "1";
  preloader.style.visibility = "hidden";
  postloader.animate([
    {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
      transformOrigin: "top left",
      opacity: 1,
    },
    {
      transform: "translate(0, 0) scale(1)",
      transformOrigin: "top left",
      opacity: 1,
    },
  ], {
    duration: 420,
    delay: 0,
    easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    fill: "forwards",
  });
}

function wireArrowLoops() {
  const hoverTargets = [
    ...document.querySelectorAll(".contact"),
    ...document.querySelectorAll(".work-arrow-link"),
    ...document.querySelectorAll(".thumbnail"),
  ];

  hoverTargets.forEach((target) => {
    const arrow = target.querySelector(".arrow") || target.closest(".work-item")?.querySelector(".arrow");
    let loop = null;

    target.addEventListener("mouseenter", () => {
      if (!arrow) return;
      loop?.cancel();
      loop = arrow.animate([
        { transform: "translate(0, 0)" },
        { transform: "translate(50%, -50%)" },
      ], {
        duration: 700,
        easing: "ease-in-out",
        iterations: Infinity,
        direction: "alternate",
      });
    });

    target.addEventListener("mouseleave", () => {
      loop?.cancel();
      loop = null;
      animate(arrow, [
        { transform: getComputedStyle(arrow).transform === "none" ? "translate(0, 0)" : getComputedStyle(arrow).transform },
        { transform: "translate(0, 0)" },
      ], { duration: 260, easing: "ease-out" });
    });
  });
}

function setActiveWorkItem(nextItem) {
  workItems.forEach((item) => {
    const isActive = item === nextItem;
    const thumbnail = item.querySelector(".thumbnail");
    const targetHeight = thumbnail ? `${thumbnail.clientWidth * 2 / 3}px` : "0px";

    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-expanded", String(isActive));

    if (thumbnail) {
      thumbnail.style.height = isActive ? targetHeight : "0px";
      thumbnail.style.marginTop = isActive ? "1rem" : "0px";
    }
  });
}

function wireWorkAccordion() {
  setActiveWorkItem(document.querySelector(".work-item.is-active") || workItems[0]);

  workItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) return;
      setActiveWorkItem(item);
    });
  });

  window.addEventListener("resize", () => {
    const active = document.querySelector(".work-item.is-active");
    if (active) setActiveWorkItem(active);
  });
}

async function boot() {
  await animate(loader, [
    { transform: "scaleX(0)" },
    { transform: "scaleX(1)" },
  ], { duration: 1000, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });

  animate(loader, [
    { opacity: 1 },
    { opacity: 0 },
  ], { duration: 180 });

  flipPortrait();
  revealBoxes.forEach(revealBox);
  revealInnerContent();
  await delay(1500);
  document.body.style.overflow = "auto";
}

wireArrowLoops();
wireWorkAccordion();

if (document.readyState === "complete") {
  boot();
} else {
  window.addEventListener("load", boot, { once: true });
}
