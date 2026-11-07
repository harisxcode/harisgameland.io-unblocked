# Haris Game Center 🎮

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arcade: 0% Lag](https://img.shields.io/badge/Performance-60_FPS_0%25_Lag-cyan.svg)](#)
[![Chromebook: Unblocked](https://img.shields.io/badge/Chromebook-100%25_Unblocked-emerald.svg)](#)

> **GitHub Repository Description:**  
> `Haris Game Center - High-performance unblocked arcade with 0% lag, Pablo the Penguin mascot, Google Search Engine, and offline single-screen mode. Licensed under the MIT License.`

Interactive landing hub for Haris's arcade and racing web games, featuring **Nitro League**, **Escape Road**, **Flappy Bird Arcade**, built-in **Google Search Engine**, and **Pablo Penguin Wildlife Charity** with direct play links, in-app playable viewports, and open-source project repositories.

## 🚀 Published Games & Features

- **Nitro League 3D**: [Play Game](https://haris-arcade.local/#nitro-league) · [Repository](https://git.harisgamecenter.com/haris-arcade/nitro-league)
- **Escape Road**: [Direct Play](https://unblockedescaperoads.com/) · 3D Police Getaway Chase
- **Haris Game Center (Arcade Portal)**: [Direct Play](https://haris-arcade.local/#games) · [Repository](https://git.harisgamecenter.com/haris-arcade/haris-game-center)
- **Google Search Engine**: Built-in web search engine with gaming walkthroughs, math tools, and classroom stealth disguise mode
- **Roblox (Cloud Edition)**: [Direct Play on now.gg](https://now.gg/apps/a/19900/b.html)
- **Flappy Bird Arcade**: [Play Game](https://haris-arcade.local/#flappy-bird) · [Repository](https://git.harisgamecenter.com/haris-arcade/flappy-bird)
- **Meme Mania**: [Play Game](https://haris-arcade.local/#meme-mania) · [Repository](https://git.harisgamecenter.com/haris-arcade/meme-mania)
- **Music Stream** (`other` category): [Direct Launch](https://is.gd/musicstream) · High-energy web audio & playlist stream concept
- **Self-Contained Local Offline File**: `haris_gamecenter_offline.html` (Run locally via `file://` with zero network requests)

---

## 🌐 How to Publish to GitHub Pages

This project is pre-configured with **automated GitHub Actions deployment** and relative asset resolution (`base: './'`).

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

1. **Push this code to your GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Haris Game Center"
   git branch -M main
   git remote add origin https://github.com/harisxcode/game-center.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository settings**:
   - Go to your repository on GitHub: `https://github.com/harisxcode/game-center`
   - Click **Settings** (top tabs)
   - Click **Pages** in the left sidebar
   - Under **Build and deployment** -> **Source**, select:
     👉 **GitHub Actions**
   - That's it! Every time you push to the `main` branch, the `.github/workflows/deploy.yml` workflow will automatically build and publish your site at:
     **`https://harisxcode.github.io/game-center/`**

---

### Option 2: Manual Build & Push

If you prefer building locally:

```bash
# 1. Install dependencies
npm install

# 2. Build for production (outputs to /dist)
npm run build

# 3. Preview production build locally
npm run preview
```

---

## 🕹️ Adding Future Games

To add more games to the hub:
1. Open `src/data/games.ts`
2. Add a new game object to `INITIAL_GAMES` with its title, GitHub Pages play link, repository, and controls.
3. Or use the built-in **"Add Game"** button on the website to generate and copy the configuration snippet!

---

## 📄 License & Open Source

This repository and project are open source and available under the terms of the **[MIT License](LICENSE)**.

```text
MIT License
Copyright (c) 2026 Haris (Haris Game Center) & Pablo the Penguin Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

Feel free to fork, customize, and deploy your own arcade instance!
