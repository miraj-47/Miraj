const loader = document.querySelector(".loader");
const revealBoxes = [...document.querySelectorAll("[data-reveal]")];
const preloader = document.querySelector("[data-flip-source]");
const postloader = document.querySelector("[data-flip-target]");
const workSections = [...document.querySelectorAll("[data-work-section]")];
const workPreview = document.querySelector("[data-work-preview]");
const workPreviewImage = document.querySelector("[data-work-preview-image]");
const workPreviewTitle = document.querySelector("[data-work-preview-title]");
const workPreviewCounter = document.querySelector("[data-work-preview-counter]");
const workPreviewPrevious = document.querySelector("[data-work-preview-prev]");
const workPreviewNext = document.querySelector("[data-work-preview-next]");
const workPreviewClosers = [...document.querySelectorAll("[data-work-preview-close]")];
const contactPreview = document.querySelector("[data-contact-preview]");
const contactForm = document.querySelector("[data-contact-form]");
const contactTriggers = [...document.querySelectorAll("[data-contact-trigger]")];
const contactPreviewClosers = [...document.querySelectorAll("[data-contact-preview-close]")];
const contactSubmit = document.querySelector(".contact-submit");
const contactStatus = document.querySelector(".contact-status");

// EmailJS configuration (provided)
const EMAILJS_SERVICE = "service_ylqmyuk";
const EMAILJS_TEMPLATE = "template_zenekmh";
const EMAILJS_PUBLIC_KEY = "_x5BxfMuQI8FU_snm";

if (typeof emailjs !== "undefined") {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } catch (e) {
    // ignore init errors; SDK might not be loaded yet
    console.warn("EmailJS init error", e);
  }
} else {
  console.warn("EmailJS SDK not loaded. Email send will fail until SDK is available.");
}

async function ensureEmailJSSDK(timeoutMs = 10000) {
  if (typeof emailjs !== "undefined") {
    try {
      // ensure initialized
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {}
    return;
  }

  return new Promise((resolve, reject) => {
    const sources = [
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
      "https://unpkg.com/@emailjs/browser@4/dist/email.min.js",
    ];

    const tryLoad = (index = 0) => {
      if (index >= sources.length) {
        reject(new Error("EmailJS SDK failed to load from all sources"));
        return;
      }

      const script = document.createElement("script");
      script.src = sources[index];
      script.async = true;

      const timeoutId = setTimeout(() => {
        script.onload = null;
        script.onerror = null;
        script.remove();
        tryLoad(index + 1);
      }, timeoutMs);

      script.onload = () => {
        clearTimeout(timeoutId);
        if (typeof emailjs === "undefined") {
          script.remove();
          tryLoad(index + 1);
          return;
        }
        try {
          emailjs.init(EMAILJS_PUBLIC_KEY);
        } catch (e) {
          console.warn("EmailJS init after load failed", e);
        }
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        script.remove();
        tryLoad(index + 1);
      };

      document.head.appendChild(script);
    };

    tryLoad(0);
  });
}

const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";
const expoOut = "cubic-bezier(0.16, 1, 0.3, 1)";

document.body.style.overflow = "hidden";
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

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

function syncBodyOverflow() {
  const isPreviewOpen = (workPreview && !workPreview.hidden) || (contactPreview && !contactPreview.hidden);
  document.body.style.overflow = isPreviewOpen ? "hidden" : "auto";
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

  document.querySelectorAll("[data-work-section]").forEach((element, index) => {
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

function openWorkPreview(item) {
  if (!workPreview || !workPreviewImage || !workPreviewTitle || !item) return;

  const previewSource = item.dataset.workPreviewSrc || item.querySelector("img")?.currentSrc || item.querySelector("img")?.src;
  const title = item.dataset.workPreviewTitle || item.querySelector(".work-subtitle")?.textContent?.trim() || "Work preview";
  if (!previewSource) return;

  workPreviewImage.src = previewSource;
  workPreviewImage.alt = title;
  workPreviewTitle.textContent = title;
  workPreview.hidden = false;
  workPreview.setAttribute("aria-hidden", "false");
  updateWorkPreviewNavigation(item.closest("[data-work-section]"));
  syncBodyOverflow();
}

function getSectionPreviewItems(section) {
  return section ? [...section.querySelectorAll("[data-work-preview-trigger]")] : [];
}

function getActiveSectionPreviewItem(section) {
  return section ? section.querySelector("[data-work-preview-trigger].is-active") : null;
}

function refreshWorkSectionLayout(section) {
  const body = section?.querySelector("[data-work-section-body]");
  if (!body) return;

  body.style.height = `${body.scrollHeight}px`;
  body.style.marginTop = "1rem";
}

function setActiveWorkPreviewItem(section, nextIndex) {
  const items = getSectionPreviewItems(section);
  if (!section || !items.length) return;

  const normalizedIndex = ((nextIndex % items.length) + items.length) % items.length;

  items.forEach((item, index) => {
    item.classList.toggle("is-active", index === normalizedIndex);
  });

  const counter = section.querySelector("[data-work-section-counter]");
  if (counter) {
    counter.textContent = `${normalizedIndex + 1} / ${items.length}`;
  }

  refreshWorkSectionLayout(section);
}

function moveWorkSectionPreview(section, step) {
  const items = getSectionPreviewItems(section);
  if (!section || items.length < 2) return;

  const activeItem = getActiveSectionPreviewItem(section) || items[0];
  const currentIndex = Math.max(0, items.indexOf(activeItem));
  setActiveWorkPreviewItem(section, currentIndex + step);

  return getActiveSectionPreviewItem(section) || items[0];
}

function updateWorkPreviewNavigation(section) {
  const previewItems = getSectionPreviewItems(section || workPreviewState.section);
  const total = previewItems.length;
  const index = Math.max(0, workPreviewState.index);

  if (workPreviewCounter) {
    workPreviewCounter.textContent = total ? `${index + 1} / ${total}` : "";
  }

  if (workPreviewPrevious) {
    workPreviewPrevious.disabled = total < 2;
  }

  if (workPreviewNext) {
    workPreviewNext.disabled = total < 2;
  }
}

const workPreviewState = {
  section: null,
  items: [],
  index: 0,
};

function openWorkPreviewFromItem(item) {
  const section = item.closest("[data-work-section]");
  const items = getSectionPreviewItems(section);
  const index = items.indexOf(item);

  if (section) {
    workPreviewState.section = section;
    workPreviewState.items = items;
    workPreviewState.index = index >= 0 ? index : 0;
  }

  openWorkPreview(item);
}

function navigateWorkPreview(step) {
  const { section, items } = workPreviewState;
  if (!section || items.length < 2) return;

  const nextIndex = (workPreviewState.index + step + items.length) % items.length;
  workPreviewState.index = nextIndex;
  openWorkPreview(items[nextIndex]);
}

function closeWorkPreview() {
  if (!workPreview) return;

  workPreview.hidden = true;
  workPreview.setAttribute("aria-hidden", "true");
  syncBodyOverflow();
}

function openContactPreview() {
  if (!contactPreview || !contactForm) return;

  contactPreview.hidden = false;
  contactPreview.setAttribute("aria-hidden", "false");
  setContactStatus("");
  syncBodyOverflow();

  const firstField = contactForm.querySelector("input, textarea, button");
  if (firstField) {
    window.setTimeout(() => firstField.focus(), 0);
  }
}

function closeContactPreview() {
  if (!contactPreview) return;

  contactPreview.hidden = true;
  contactPreview.setAttribute("aria-hidden", "true");
  syncBodyOverflow();
}

function setContactStatus(message, state = "") {
  if (!contactStatus) return;

  contactStatus.textContent = message;
  contactStatus.classList.toggle("is-success", state === "success");
  contactStatus.classList.toggle("is-error", state === "error");
}

async function submitContactForm(formData) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("No network connection. Check your internet connection and try again.");
  }

  if (typeof emailjs === "undefined") {
    // try to load SDK dynamically once
    try {
      setContactStatus("Loading email SDK...");
      await ensureEmailJSSDK(10000);
    } catch (err) {
      throw new Error("EmailJS SDK not available. Ensure the SDK script is loaded.");
    }
  }

  const params = {
    to_email: "nurarts2024@gmail.com",
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    title: "Miraj Portfolio",
    time: new Date().toLocaleString(),
    message: String(formData.get("message") || "").trim(),
  };

  // EmailJS has its own timeout handling; we wrap to provide clearer messages
  try {
    const sendPromise = emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params);
    const timeoutMs = 15000;
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("EmailJS request timed out.")), timeoutMs));
    const result = await Promise.race([sendPromise, timeoutPromise]);
    return result;
  } catch (err) {
    throw new Error(err && err.text ? err.text : err.message || "EmailJS send failed.");
  }
}

function wireWorkPreviews() {
  document.querySelectorAll("[data-work-preview-trigger]").forEach((item) => {
    item.addEventListener("click", () => {
      openWorkPreviewFromItem(item);
    });
  });

  workPreviewPrevious?.addEventListener("click", () => navigateWorkPreview(-1));
  workPreviewNext?.addEventListener("click", () => navigateWorkPreview(1));

  workPreviewClosers.forEach((closer) => {
    closer.addEventListener("click", closeWorkPreview);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && workPreview && !workPreview.hidden) {
      closeWorkPreview();
      return;
    }

    if (!workPreview || workPreview.hidden) {
      return;
    }

    if (event.key === "ArrowLeft") {
      navigateWorkPreview(-1);
    }

    if (event.key === "ArrowRight") {
      navigateWorkPreview(1);
    }
  });
}

function wireContactPreview() {
  contactTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openContactPreview);
  });

  contactPreviewClosers.forEach((closer) => {
    closer.addEventListener("click", closeContactPreview);
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    formData.set("_subject", `New message from ${String(formData.get("name") || "Website visitor").trim()}`);
    formData.set("_captcha", "false");
    formData.set("_template", "table");

    if (contactSubmit) {
      contactSubmit.disabled = true;
    }

    setContactStatus("Sending message...");

    submitContactForm(formData)
      .then(() => {
        contactForm.reset();
        setContactStatus("Message sent successfully.", "success");
        window.setTimeout(() => {
          closeContactPreview();
          setContactStatus("");
        }, 1200);
      })
      .catch((error) => {
        setContactStatus(error.message || "Message could not be sent.", "error");
      })
      .finally(() => {
        if (contactSubmit) {
          contactSubmit.disabled = false;
        }
      });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && contactPreview && !contactPreview.hidden) {
      closeContactPreview();
    }
  });
}

function setActiveWorkSection(nextSection) {
  workSections.forEach((section) => {
    const isActive = section === nextSection;
    const body = section.querySelector("[data-work-section-body]");
    const toggle = section.querySelector("[data-work-section-toggle]");

    section.classList.toggle("is-active", isActive);
    toggle?.setAttribute("aria-expanded", String(isActive));

    if (body) {
      body.style.height = isActive ? `${body.scrollHeight}px` : "0px";
      body.style.marginTop = isActive ? "1rem" : "0px";
    }
  });
}

function wireWorkAccordion() {
  workSections.forEach((section) => {
    const slides = getSectionPreviewItems(section);
    const initialIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    setActiveWorkPreviewItem(section, initialIndex);

    section.querySelector("[data-work-section-preview]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const activeItem = getActiveSectionPreviewItem(section) || getSectionPreviewItems(section)[0];
      if (activeItem) {
        openWorkPreviewFromItem(activeItem);
      }
    });

    section.querySelector("[data-work-section-prev]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = moveWorkSectionPreview(section, -1);
      if (item) {
        openWorkPreviewFromItem(item);
      }
    });

    section.querySelector("[data-work-section-next]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = moveWorkSectionPreview(section, 1);
      if (item) {
        openWorkPreviewFromItem(item);
      }
    });
  });

  setActiveWorkSection(document.querySelector("[data-work-section].is-active") || workSections[0]);

  workSections.forEach((section) => {
    const toggle = section.querySelector("[data-work-section-toggle]");

    toggle?.addEventListener("click", () => {
      if (section.classList.contains("is-active")) return;

      setActiveWorkSection(section);
      refreshWorkSectionLayout(section);
    });
  });

  window.addEventListener("resize", () => {
    const active = document.querySelector("[data-work-section].is-active");
    if (active) {
      setActiveWorkSection(active);
      refreshWorkSectionLayout(active);
    }
  });
}

async function boot() {
  if (boot.hasRun) return;
  boot.hasRun = true;

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
  syncBodyOverflow();
}

wireArrowLoops();
wireWorkPreviews();
wireContactPreview();
wireWorkAccordion();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(boot), { once: true });
} else {
  requestAnimationFrame(boot);
}
