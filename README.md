# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 台灣醫藥監管週報（`/regulatory/`）

每週整理食藥署（TFDA）與衛生福利部（MOHW）官方公告／新聞中，與腎臟科、藥品、醫療器材、臨床試驗、查驗登記、GMP/GDP、藥品安全、供應與健保給付異動相關的重點；並掃描 FDA／EMA 國際監管 feed，僅收錄與腎臟相關（kidney-relevant）的項目。

**核心原則：機器跑到草稿，醫師審閱後才發布。** AI 只負責抓取、去重、初步分類與生成草稿；臨床／法規意義與是否公開，必須由醫師審閱定稿。草稿一律 `review_status: needs_physician_review`（noindex、不列入列表與 RSS）；翻成 `physician_reviewed` 並 push 後才會由 Vercel 上線。

### 相關檔案

- `src/content/regulatory/<YYYY-MM-DD>-tfda-weekly.md` — 每期週報（content collection）
- `src/content.config.ts` — `regulatory` schema（含 `review_status` gate）
- `src/layouts/RegulatoryLayout.astro`、`src/pages/regulatory/` — 版型、列表、單篇、專屬 RSS
- `scripts/fetch-tfda-updates.mjs` — 抓取食藥署＋衛福部＋FDA/EMA RSS、初整、產草稿（Tier 2 衛福部套 `strict` 藥政關鍵字門檻；FDA/EMA 套 `intl` kidney-only 門檻）
- `scripts/tfda-publish.mjs` — 發布前驗證 + 翻 `review_status` + 本地 commit
- `.github/workflows/tfda-weekly.yml` — 每週自動抓取並開 draft PR
- `scripts/verify-p0.mjs` Check 9 — 驗證草稿 gate（noindex、不外露）

### 指令

| Command | Action |
| :------ | :----- |
| `npm run tfda:weekly` | 抓最近 7 天，輸出草稿到 `work/tfda/<date>/`（gitignored） |
| `npm run tfda:fetch -- --from 2026-06-08 --to 2026-06-14` | 指定區間抓取 |
| `npm run tfda:fetch -- --weekly --promote` | 抓取並直接把草稿落到 `src/content/regulatory/` |
| `npm run tfda:publish -- <slug>` | 發布前驗證 → 翻 `review_status` → 本地 commit（不 push） |
| `npm run tfda:publish -- <slug> --dry-run` | 只驗證與預覽，不寫不 commit |

### Tier 0：手動產下一期週報

1. `npm run tfda:weekly` —— 產出 `work/tfda/<date>/{items.json,digest.md,weekly-draft.md}`。
2. 審閱 `weekly-draft.md`，逐項核對官方原文連結、補寫「一句話摘要／可能影響（只寫『可能／需確認』）」、補 TL;DR 表格與 `description`/`tags`，移除所有「（待審）」placeholder。
3. 存成 `src/content/regulatory/<date>-tfda-weekly.md`（保持 `review_status: needs_physician_review` 先預覽）。
4. `npm run dev` → 開 `/regulatory/<slug>/` 看 rendered。
5. 確認無誤：`npm run tfda:publish -- <slug>`（驗證 + 翻 status + 本地 commit）。
6. `npm run build:verify`（含 Check 9）→ `git push` → Vercel 上線。

### Tier 1：自動排程（GitHub Actions）

`.github/workflows/tfda-weekly.yml` 每週一台灣早上自動跑，或在 Actions 頁手動 `Run workflow`（可指定區間）。它會抓取、`--promote` 草稿、**開一個 draft PR** 等審。流程**不會 push main、不會自動合併、不會自動上線**——你在 PR 審稿、補完、翻 `review_status`、merge 後才部署。

> 註：draft PR 分支會觸發 Vercel preview deploy（非 production）；草稿本身 noindex。若不要 preview，可在 `vercel.json` 對 `tfda-weekly/*` 分支關閉。

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
