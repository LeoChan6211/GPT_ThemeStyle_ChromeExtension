# Changelog

This file records both:

- Version-by-version engineering changes.
- Product-level differences vs. native ChatGPT and user-facing benefits.

---

## Product Evolution Summary

### What changes after installing this extension (vs. native ChatGPT)

1. Visual theme layer on top of ChatGPT:
   - Custom background/panel/text/muted/border/link colors.
   - Consistent readability-oriented dark styling.
   - Dynamic CSS variables for easier future tuning.
2. Code block appearance control:
   - Multiple code theme presets (GitHub, Nord, Monokai, Dracula, VS Code-like, etc.).
   - Better alignment between chat UI tone and code-reading comfort.
3. Composer workflow enhancement:
   - Launcher + Composer model for cleaner screen usage.
   - Init page can open composer by default for fast first input.
   - Conversation pages support collapse/reopen behavior.
4. Motion/interaction polish:
   - Fade-in/fade-out transitions (including post-send collapse).
   - Reduced abrupt UI jumps during open/close.
5. Runtime resilience:
   - Safer composer detection in frequently changing ChatGPT DOM.
   - Route-aware behavior for `/` init and `/c/...` conversation pages.
   - Guards against accidental reopen loops.

### Practical convenience for users

1. Faster start on new chat:
   - Composer appears where you need it on init page.
2. Cleaner reading during long conversations:
   - Input area can collapse, reducing visual clutter.
3. More predictable input behavior:
   - Enter only acts as send when sending is truly available.
   - During generation, Enter no longer causes unintended behavior.
4. Better attention flow:
   - Input box no longer randomly pops in normal conversation state.
5. Better consistency:
   - Reduced mismatch between init state and active conversation state.

---

## [Unreleased]

### Planned

1. Optional user-toggle for init auto-open strategy.
2. Optional animation duration settings in options page.
3. Expanded debug diagnostics toggle for non-technical users.

---

## [2026-05-15] - Stability and Interaction Consistency Release

### Added

1. Non-init reopen cooldown guard to reduce transition race-triggered reopen.
2. Explicit launcher-intent window (hover/click/focus/pointer) for controlled reopen behavior.
3. Documentation baseline (`README.md`, structured changelog format).

### Changed

1. Init vs. conversation behavior split:
   - Init/new-chat: composer may auto-open for quick first message.
   - Non-init conversation routes: auto-open paths are heavily restricted.
2. Post-send collapse animation:
   - Send-triggered collapse now uses the same 1-second fade-out path as idle collapse.
3. Enter key policy:
   - Enter now checks whether send is actually available before treating input as send action.
   - If button is stop/cancel/disabled-like state, Enter is ignored for send-collapse logic.
4. Reopen policy hardening:
   - In non-init states, non-user-triggered open paths are blocked.
   - Reopen is allowed by explicit launcher interaction only.

### Fixed

1. Fixed unexpected composer auto-pop during/after first response generation on regular tabs.
2. Fixed init/non-init handoff races causing unwanted re-open after first submit.
3. Fixed cases where post-send close happened without animation consistency.
4. Fixed over-eager Enter handling that assumed every Enter means successful send.

### Technical Notes

1. Core state machine lives in:
   - `content/launcher.state.js`
2. Composer presentation/layout lives in:
   - `content/launcher.view.js`
3. Composer/init detection lives in:
   - `content/launcher.detect.js`
4. Theme/style layer lives in:
   - `content/style.js`
5. Boot/runtime wiring lives in:
   - `content/main.js`, `content/launcher.main.js`

---

## [2026-05-08] - Runtime Split and Modular Foundation

### Added

1. Modular runtime split:
   - detection, view, state, main wiring separated into dedicated files.
2. Build tag + runtime setting pipeline for safer reload/re-apply flow.
3. Launcher/disclaimer helper hooks integrated into top-level runtime bootstrap.

### Changed

1. Shifted to stability-first architecture:
   - theming and interaction logic organized by responsibility.
2. Improved extension setting refresh behavior:
   - launcher state can be rebuilt when settings change.

---

## [2026-05-06 to 2026-05-07] - Theme and Options Maturation

### Added

1. Options page configuration for:
   - enable/disable
   - background/panel/text/muted/border/link colors
   - code theme preset selection
2. Large code-theme preset set for user preference flexibility.
3. Storage-backed persistent settings (`chrome.storage.sync`).

### Changed

1. Improved extension options usability:
   - clearer extension-context handling and safety messaging.
2. Better defaults for readable dark UI palette.

---

## Compatibility Notes

1. Targets:
   - `https://chatgpt.com/*`
   - `https://chat.openai.com/*`
2. Manifest:
   - MV3 content-script injection at `document_start`.
3. Known environment behavior:
   - ChatGPT DOM updates can change frequently; detection logic is designed defensively but should be monitored across major UI updates.

---

## Glossary

1. Init page:
   - New-chat-like state before conversation turns exist.
2. Conversation route:
   - Thread route such as `/c/...` with existing turns or active generation.
3. Launcher intent:
   - User explicit interaction signal to reopen composer (hover/click/focus/pointer).

