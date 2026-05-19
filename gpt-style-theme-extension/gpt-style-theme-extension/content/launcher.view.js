(function () {
  const g = (globalThis.GPTGT = globalThis.GPTGT || {});
  const detect = g.launcherDetect;

  const UI = {
    launcherId: "gptgt-chat-launcher",
    rootOpenClass: "gptgt-open",
    readyClass: "gptgt-ready",
    hasLauncherClass: "gptgt-has-launcher"
  };

  const BOTTOM_OFFSET_PX = 6;
  const SIDE_OFFSET_PX = 54;

  const clearInjectedComposerStyles = (el) => {
    if (!(el instanceof HTMLElement)) return;
    el.classList.remove("gptgt-composer");
    el.style.transition = "";
    el.style.transformOrigin = "";
    el.style.position = "";
    el.style.left = "";
    el.style.right = "";
    el.style.bottom = "";
    el.style.top = "";
    el.style.width = "";
    el.style.maxWidth = "";
    el.style.margin = "";
    el.style.paddingBottom = "";
    el.style.minHeight = "";
    el.style.maxHeight = "";
    el.style.zIndex = "";
    el.style.removeProperty("--sticky-padding-bottom");
    el.style.opacity = "";
    el.style.visibility = "";
    el.style.pointerEvents = "";
    el.style.transform = "";
    el.style.filter = "";
    el.style.display = "";
    el.style.translate = "";
    el.style.flexDirection = "";
    el.style.justifyContent = "";
    el.style.alignItems = "";
  };

  const tagComposer = () => {
    const panel = detect.findComposerPanel();
    for (const bad of document.querySelectorAll("form[data-type='unified-composer'].gptgt-composer")) {
      clearInjectedComposerStyles(bad);
    }
    for (const el of document.querySelectorAll(".gptgt-composer")) {
      if (el !== panel) el.classList.remove("gptgt-composer");
    }
    if (panel && !panel.classList.contains("gptgt-composer")) panel.classList.add("gptgt-composer");
    return panel;
  };

  const focusComposerInput = (panel = detect.findComposerPanel()) => {
    const input = detect.findFocusableComposerInput(panel);
    if (!(input instanceof HTMLElement)) return false;
    input.focus();
    if (input.id === "prompt-textarea") {
      const selection = window.getSelection?.();
      const range = document.createRange?.();
      if (selection && range) {
        range.selectNodeContents(input);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    return true;
  };

  const normalizeComposerLayout = (panel, options = {}) => {
    if (!(panel instanceof HTMLElement)) return;
    const instant = Boolean(options.instant);
    // In first incognito tab boot, ChatGPT may expose only the unified composer <form>.
    // Treat it as a valid panel so follow-up input can still be shown/reopened.

    panel.classList.add("gptgt-composer");
    panel.style.transition = instant
      ? "none"
      : "opacity 1000ms cubic-bezier(0.2, 0.8, 0.2, 1), visibility 1000ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    panel.style.transformOrigin = "bottom center";
    panel.style.position = "fixed";
    panel.style.left = `${SIDE_OFFSET_PX}px`;
    panel.style.right = `${SIDE_OFFSET_PX}px`;
    panel.style.bottom = `calc(env(safe-area-inset-bottom, 0px) + ${BOTTOM_OFFSET_PX}px)`;
    panel.style.top = "auto";
    panel.style.inset = `auto ${SIDE_OFFSET_PX}px calc(env(safe-area-inset-bottom, 0px) + ${BOTTOM_OFFSET_PX}px) ${SIDE_OFFSET_PX}px`;
    panel.style.width = "auto";
    panel.style.maxWidth = "none";
    panel.style.margin = "0";
    panel.style.paddingBottom = "0";
    panel.style.minHeight = "60px";
    panel.style.maxHeight = "min(70vh, 1000px)";
    panel.style.zIndex = "2147483005";
    panel.style.setProperty("--sticky-padding-bottom", "0px");
    panel.style.translate = "none";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.justifyContent = "flex-end";
    panel.style.alignItems = "stretch";

    if (panel.id === "thread-bottom-container") {
      const threadBottom = Array.from(panel.children).find((child) => child instanceof HTMLElement && child.id === "thread-bottom");
      if (threadBottom instanceof HTMLElement) {
        for (const child of Array.from(panel.children)) {
          if (!(child instanceof HTMLElement)) continue;
          if (child === threadBottom) {
            child.style.display = "block";
            child.style.marginBottom = "0";
            child.removeAttribute("aria-hidden");
            continue;
          }
          child.style.display = "none";
          child.setAttribute("aria-hidden", "true");
        }
      }
      for (const bad of panel.querySelectorAll("form[data-type='unified-composer'].gptgt-composer")) {
        clearInjectedComposerStyles(bad);
      }
    }
  };

  const setComposerVisible = (visible, options = {}) => {
    const panel = detect.findComposerPanel();
    if (!(panel instanceof HTMLElement)) return false;
    if (panel.matches?.("main,[role='main'],body,html,#__next,#root")) return false;

    normalizeComposerLayout(panel, { instant: Boolean(options.instant) });

    if (visible) {
      panel.style.opacity = "1";
      panel.style.visibility = "visible";
      panel.style.pointerEvents = "auto";
      panel.style.transform = "none";
      panel.style.translate = "none";
      panel.style.filter = "none";

      // Hard fail-safe: revive hidden composer internals (common on first no-auth/incognito boot).
      const form = panel.querySelector("form[data-type='unified-composer']");
      if (form instanceof HTMLElement) {
        const fcs = getComputedStyle(form);
        if (fcs.visibility === "hidden") form.style.visibility = "visible";
        if (fcs.opacity === "0") form.style.opacity = "1";
        form.style.pointerEvents = "auto";
      }
      for (const el of panel.querySelectorAll(".wcDTda_prosemirror-parent,[data-composer-surface='true']")) {
        if (!(el instanceof HTMLElement)) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden") el.style.visibility = "visible";
        if (cs.opacity === "0") el.style.opacity = "1";
      }
      const richInputs = panel.querySelectorAll("[contenteditable='true']");
      let hasVisibleRichInput = false;
      for (const el of richInputs) {
        if (!(el instanceof HTMLElement)) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden") el.style.visibility = "visible";
        if (cs.opacity === "0") el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        const rect = el.getBoundingClientRect?.();
        if (rect && rect.width > 60 && rect.height > 20) hasVisibleRichInput = true;
      }
      // If rich input is still unavailable, expose textarea fallback so user can type.
      if (!hasVisibleRichInput) {
        for (const ta of panel.querySelectorAll("textarea[name='prompt-textarea'],textarea")) {
          if (!(ta instanceof HTMLElement)) continue;
          const tcs = getComputedStyle(ta);
          if (tcs.visibility === "hidden") ta.style.visibility = "visible";
          if (tcs.opacity === "0") ta.style.opacity = "1";
          ta.style.pointerEvents = "auto";
        }
      }
      return true;
    }

    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
    panel.style.transform = "none";
    panel.style.translate = "none";
    panel.style.filter = "none";
    return true;
  };

  const prepareComposerForReadyState = (runtime) => {
    const panel = detect.findComposerPanel();
    if (!(panel instanceof HTMLElement)) {
      document.documentElement.classList.remove(UI.readyClass);
      return false;
    }
    if (detect.hasChatMessageContent(panel) || panel.matches?.("main,[role='main'],body,html,#__next,#root")) return false;
    if (!(detect.findFocusableComposerInput(panel) instanceof HTMLElement)) {
      document.documentElement.classList.remove(UI.readyClass);
      return false;
    }

    if (runtime) runtime.lastComposerEl = panel;
    if (runtime?.isOpen) {
      normalizeComposerLayout(panel, { instant: true });
    } else {
      setComposerVisible(false, { instant: true });
    }

    document.documentElement.classList.add(UI.readyClass);
    return true;
  };

  const setRootOpen = (open) => document.documentElement.classList.toggle(UI.rootOpenClass, open);

  const ensureStatus = () => {
    let el = document.getElementById("gptgt-status");
    if (el) return el;
    el = document.createElement("div");
    el.id = "gptgt-status";
    document.documentElement.appendChild(el);
    return el;
  };

  const showStatus = (msg) => {
    const el = ensureStatus();
    el.textContent = msg;
    el.style.opacity = "0.92";
    window.clearTimeout(showStatus._t);
    showStatus._t = window.setTimeout(() => {
      el.style.opacity = "0";
    }, 1600);
  };

  g.launcherView = {
    UI,
    BOTTOM_OFFSET_PX,
    SIDE_OFFSET_PX,
    clearInjectedComposerStyles,
    tagComposer,
    focusComposerInput,
    normalizeComposerLayout,
    setComposerVisible,
    prepareComposerForReadyState,
    setRootOpen,
    ensureStatus,
    showStatus
  };
})();
