# GPT Style Theme Extension

A Chrome extension that restyles ChatGPT and adds a launcher-driven composer workflow with smooth open/close transitions.

## What This Extension Does

- Applies a custom visual theme to ChatGPT (background, panel, text, links, code colors).
- Adds a launcher/composer interaction model:
  - Composer can appear on init/new-chat flow for quick start.
  - Composer can collapse back to launcher after send/idle.
  - Uses smooth fade-in/fade-out transitions.
- Improves behavior consistency across route changes and dynamic ChatGPT DOM updates.

## Key Features

- Theme system with configurable colors and code theme presets.
- Launcher + composer state management for input focus workflow.
- Safe composer detection logic for frequently changing ChatGPT structure.
- Auto-collapse safeguards:
  - Only user-intent reopen in non-init conversation state.
  - Post-send cooldown to prevent accidental auto-reopen.
  - Better handling between init page and conversation page transitions.
- Enter key behavior aligned with native GPT expectations:
  - Enter triggers send only when send is actually available.
  - During generation (stop/cancel state), Enter does not trigger unintended send/collapse.

## Project Structure

```text
gpt-style-theme-extension/
  manifest.json
  options.html
  options.css
  options.js
  content/
    main.js
    style.js
    theme-presets.js
    codemirror-theme.js
    launcher.detect.js
    launcher.view.js
    launcher.state.js
    launcher.main.js
    disclaimer.js
```

## Installation (Developer Mode)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `gpt-style-theme-extension`.
5. Open ChatGPT and refresh the page.

## Usage Notes

- Init/new-chat page can show composer by default for faster first input.
- After entering conversation state, composer should not auto-pop without explicit launcher interaction.
- Send collapse and idle collapse use the same 1-second fade-out transition.

## Recommended GitHub Docs

- `README.md` for project overview and setup.
- `CHANGELOG.md` for release history.
- `LICENSE` (if you plan to open source).
- Optional: `CONTRIBUTING.md` for collaboration rules.

## Chinese Overview (繁體中文)

### 這個 Extension 在做什麼

這是一個針對 ChatGPT 介面的主題與互動強化擴充套件，核心目標是：

- 提供一致、可讀性更高的主題風格。
- 讓輸入框（Composer）與啟動按鈕（Launcher）之間的切換更自然。
- 在初始化頁、一般對話頁、動態 DOM 變化情境下維持穩定。

### 這次修復重點

- 修正首次對話後在一般分頁中，Composer 會在生成中/生成後意外彈出的問題。
- 僅允許初始化頁自動展開 Composer；進入正式對話後需由使用者明確互動才重新開啟。
- 送出後收合改為 1 秒淡出（與 idle 收合一致）。
- Enter 鍵邏輯比照 GPT 原生行為：只有可送出時才視為送出。

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.
