---
question_id: Q7
title: PA 治療後 K⁺/腎功能監測：兩臂排程 + eGFR dip 判讀 + renin de-suppression 治癒指標
category: Monitoring
version: v1.0
status: ""
last_updated: 2026-07-04
next_review: 2027-07-04
seo_title: "PA 治療後怎麼追蹤？K⁺/eGFR 監測排程 + eGFR dip 判讀 + renin 治癒指標（2025 ES + PASO/PAMO）"
description: "原發性醛固酮症治療後的追蹤要依手術或藥物分流：兩條路各自的回診時程、術後高血鉀與腎功能下降怎麼判讀，以及腎素回升代表什麼。"
quick_answer: "PA 治療後分兩臂追蹤：(1) 手術後 → 立即停 MRA/停 K⁺ 補充/liberal sodium，1 週→2-4 週→3 月→6 月→其後 q6 月查 K⁺/eGFR/BP，PASO 3 月初評/6-12 月終評；persistent hyperkalemia 7.3% [Park 2015, PMID 25766046]，高風險者（age≥53、HTN≥9.5yr、tumor≥1.95cm、preop eGFR 低；CSI<0.47 [Shariq 2018, PMID 29129366]）→ fludrocortisone 0.05-0.1 mg/day 起始橋接、依情況個別滴定。(2) MRA arm → 起始/加量後 2-4 週查 K⁺/eGFR（最關鍵）→ 3 月→6 月→穩定 q6-12 月 + renin。滴定追求 renin 由 suppressed 轉 unsuppressed；PRA ≥1.0 為常用工作切點、非 ES 固定 target，2025 ES 的加量建議限「血壓仍未控制且 renin 仍 suppressed」者。eGFR 早期掉約 5-15 mL/min 多為 hemodynamic unmasking（非驗證門檻）[Wu 2011]；>30% 為 MAKE-associated risk signal 需排查 AKI/volume/藥物 [Chen 2024, PMID 38051943]，10/20/30% 處置門檻無共識。renin de-suppression 為生化治癒現代指標 [Hundemer 2018；Katsuragawa 2025, PMID 41235994]，惟硬終點證據為 observational。"
tags:
  - PA
  - decision-note
  - Q7
  - post-treatment-monitoring
  - hyperkalemia
  - eGFR-dip
  - renin-de-suppression
  - PASO
  - PAMO
---

> **💡 一句話結論**
> PA 治療後監測**依治療臂分流**，核心是避開兩個陷阱：① 把術後 persistent hyperkalemia（**7.3%** [Park 2015]）漏接成「治好了不用追」；② 把預期內的 hemodynamic eGFR dip（約 **5-15 mL/min**）誤判成腎傷害而過早停藥。**手術後**：立即停 MRA/停 K⁺ 補充/liberal sodium → 1 週→2-4 週→3 月→6 月→q6 月；**MRA arm**：起始/加量後 2-4 週查 K⁺/eGFR（最關鍵窗）→ 3 月→6 月→穩定 q6-12 月 + renin。**滴定追求 renin 由 suppressed 轉 unsuppressed**（PRA ≥1 為常用工作切點、非 ES 固定 target），因為「BP 正常 + K⁺ 正常 ≠ 治療到位」——observational cohort 中 renin 仍 suppressed 者 CV/死亡風險偏高 [Hundemer 2018；Katsuragawa 2025]。eGFR dip **>30%** 是與 MAKE 相關的 risk signal [Chen 2024]，但 **10/20/30% 處置門檻無共識**。

> **📝 文件層級分辨**
> **指引建議 ≠ 仿單 label ≠ 臨床實務 ≠ NHI 給付。** 本文監測排程主軸 = 2025 Endocrine Society PA Clinical Practice Guideline（Adler GK et al., **PMID 40658480**）；排程頻率部分節點來自 **spironolactone/eplerenone 仿單**（label），非 RCT；renin-guided titration 有強生理 rationale 但**無完成的硬終點 RCT**（唯一直接試驗 RETAME-PA 仍 feasibility）。eGFR/生化結局證據來自觀察性 cohort（TAIPAI、PASO、PAMO、Hundemer），非介入性。NHI 監測抽血給付細節以 [Q11](/pa/q11-taiwan-nhi-coverage/) + 健保署最新支付標準為準。

---

## 1. 重點結論

- **監測不是一條 schedule，是兩條**：手術 arm 與 MRA arm 的監測目的、頻率、停藥邏輯都不同，混用會出錯。
- **手術 arm 三件事**：術後立即停 MRA/停 K⁺ 補充/liberal sodium 助對側甦醒；抓 persistent hyperkalemia（7.3%，多在 transient hypoaldosteronism 高危窗 ~術後 1-4 週）；PASO 3 月初評、6-12 月終評定生化/臨床治癒。
- **MRA arm 兩件事**：起始/加量後 2-4 週查 K⁺/eGFR（最關鍵）；滴定追求 renin 由 suppressed 轉 unsuppressed——2025 ES 的加量建議限「血壓仍未控制且 renin 仍 suppressed」者，PRA ≥1.0 為常用工作切點、非指引固定 target。
- **eGFR dip 是判讀題不是處置題**：約 5-15 mL/min 的早期 dip 多是 hyperfiltration 解除（常見 hemodynamic unmasking，非經驗證的固定門檻）；>30% 是與 MAKE 相關的 risk signal（需排查 AKI/volume/藥物），但無經驗證的固定處置百分比。
- **共照端可著力的部分**：長期 K⁺/eGFR/BP/renin 追蹤、MRA 滴定、eGFR dip 判讀、hyperK 處置與轉介時機判斷都在腎臟科端；AVS/adrenalectomy 轉介具經驗中心。

---

## 2. 為什麼治療後監測重要（兩陷阱 + renin 指標）

### 2.1 陷阱一：術後 persistent hyperkalemia 非罕見

- Park 2015（**PMID 25766046**, *Eur J Endocrinol*）：adrenalectomy 後 **transient hyperkalemia 3.2% / persistent 7.3%**（整體 ~10.5%）。
- 機轉：長期 aldosterone 過量 → 對側 zona glomerulosa **慢性抑制**，術後甦醒遲緩 → 相對 hypoaldosteronism。
- 生理時序（Mermejo 2022, **PMID 35413743**）：renin/DRC median 約 **15 天**（臨床落在約 2-4 週追蹤窗）先回，aldosterone median 約 **60 天**較慢 → 早期是相對 hypoaldosteronism **高危窗**。

### 2.2 陷阱二：把預期 hemodynamic eGFR dip 誤判為腎傷害

- 治療解除 aldosterone-driven hyperfiltration → eGFR「掉」是 **unmasking 真實腎功能**，不一定是腎傷害。
- 誤判後果：過早停 MRA、過度檢查、病人焦慮。詳見 §6。

### 2.3 為什麼「BP 正常 + K⁺ 正常」不等於治療到位

- 現代生化治癒指標 = **renin de-suppression**（PRA unsuppressed），詳見 §7。
- 在 observational cohort 中，renin 仍 suppressed 者即使 BP/K⁺ 看似正常，CV/死亡風險仍偏高、接近未治療 PA（Hundemer 2018；Katsuragawa 2025；結局證據為觀察性，非介入性）。

---

## 3. 監測排程 — 手術後 arm

*依據＝guideline/expert/PASO，非 RCT*

### 3.1 術後立即

- **停 MRA、停 K⁺ 補充、liberal sodium**（協助對側 zona glomerulosa 甦醒）。
- 術後早期（住院期間至 1 週）密切查 K⁺：高危窗。

### 3.2 排程節點

| 時點 | 查什麼 | 目的 | 依據層級 |
|---|---|---|---|
| 術後 1 週 | K⁺、Cr/eGFR、BP | 抓 early hyperkalemia + 基線 eGFR dip | expert/label |
| 2-4 週 | K⁺、eGFR、BP | persistent hyperK 高危窗 | expert |
| 3 個月 | K⁺、eGFR、BP、**PASO 初評**（renin/aldosterone/ARR） | 生化治癒初評 + 降壓藥調整 | PASO 28576687 |
| 6-12 個月 | 同上，**PASO 終評** | 確立 biochemical/clinical cure | PASO |
| 其後 q6 月 | K⁺、eGFR、BP | 長期 + 生化復發偵測 | expert |

- PASO 結局定義詳見 §7.1。
- **長期復發監測**：adrenalectomy 後仍可生化復發（單中心長期追蹤 23%，nonclassical histopathology 為高風險族群；見 [Q5](/pa/q05-surgery-vs-mra-treatment/) Tetti 2024, **PMID 38318706**）；長期 q6 月追蹤含監測 renin-independent aldosterone 是否再現，疑復發 → 重新評估（§8.2）。

### 3.3 手術後 arm 特別注意

- 術後 eGFR dip 解讀 → §6（不要看到掉就驚慌）。
- preop albuminuria（Yoon 2021, **PMID 34387032**, *Investig Clin Urol*）在無術前 CKD 的次族群中為術後 CKD progression **唯一**獨立預測因子（n=74，多變項 p=0.007；postop AKI 本身與 CKD progression 不直接相關）→ 追蹤放 **UACR**，不要只追 creatinine。

---

## 4. 監測排程 — MRA arm

*前段頻率＝仿單 label，後段＝guideline/expert*

### 4.1 排程節點

| 時點 | 查什麼 | 目的 | 依據層級 |
|---|---|---|---|
| 起始/每次加量後 **1 週**（spironolactone label）/ baseline·1週·1月（eplerenone label） | K⁺、Cr | label-mandated 安全監測 | 仿單 |
| 起始/加量後 **2-4 週** | K⁺、eGFR、BP | 最關鍵視窗（hyperK + eGFR dip） | label + expert |
| 3 個月 | K⁺、eGFR、BP、**renin** | 評估 renin de-suppression + 滴定 | guideline 40658480 |
| 6 個月 | 同上 | | guideline |
| 穩定後 q6-12 月 | K⁺、eGFR、BP、renin | 長期 | guideline/expert |

### 4.2 滴定目標：renin de-suppression（非只壓 BP/K⁺）

- 2025 ES guideline（**PMID 40658480**）原文：「*In individuals receiving MRA therapy, we suggest monitoring renin and, in those whose hypertension remains uncontrolled and renin is suppressed, titrating the MRA to increase renin*」（conditional suggestion）。
- 關鍵範圍：**此加量建議明確限「血壓仍未控制且 renin 仍 suppressed」者**；BP 已控制時是否單純為提高 renin 而再加量，指引未表態。**指引本身未給定 renin 數值目標**——PRA ≥1.0 ng/mL/h 是多數研究與臨床常用工作切點，非 ES 規定的固定 target（§7.3）。
- spironolactone 為首選 steroidal MRA；男性女乳症等耐受問題時換 eplerenone（效力較弱、需較高劑量）。

### 4.3 MRA arm 特別注意

- CKD 合併（連 [Q6](/pa/q06-ckd-pa-treatment/)）：起始減半、滴定放緩、閾值更保守、必要時 K-binder enable（AMBER patiromer-enabled，eGFR 25-45 紅線，不外推 <25/dialysis）。
- **MRA 框架勿與 finerenone 混用**（§8.3）。

---

## 5. 高血鉀處置

### 5.1 術後 persistent hyperkalemia（7.3%）三階梯

1. **排查可逆因子**：停升鉀藥（ACEi/ARB/NSAID/TMP-SMX/K⁺ 補充）、適度 liberal sodium、排除 volume depletion。
2. **fludrocortisone 起始橋接**：Tahir 2016（**PMID 27460219**, *BMC Endocr Disord*，術後 severe hyperkalemia case series）——可由 **0.05-0.1 mg/day 起始**，依 K⁺、BP、volume status 與腎功能個別滴定（部分個案需更高劑量）；**每 1-2 週監測**，過高會抑制對側甦醒、引發高血壓/水腫（0.05-0.1 mg/day 為起始劑量範圍，非固定劑量或劑量上限）。
3. **長期 hypoaldosteronism 評估**：少數需長期 mineralocorticoid 補充。

### 5.2 風險預測（術前 counsel 用）

- Park 2015 四項風險因子：**age ≥53、HTN ≥9.5 yr、tumor ≥1.95 cm、preop eGFR 低（<58.2）**。
- **CSI（contralateral suppression index）<0.47** 獨立預測術後 hyperK（Shariq 2018, **PMID 29129366**, *Surgery*；該 cohort 12/192=6.3%、中位 onset 13.5 天）。

### 5.3 MRA 期間 hyperkalemia

- reduce / hold / 排查可逆因子；K⁺ >5.5 暫停，降至 ≤5.0 穩定後低劑量重啟。
- CKD 合併者門檻更保守 + K-binder（連 [Q6](/pa/q06-ckd-pa-treatment/)）。

---

## 6. eGFR dip 判讀（本題核心鑑別）

### 6.1 框架：hemodynamic vs structural

- **hemodynamic（預期、常見）**：治療解除 aldosterone-driven hyperfiltration。Wu VC 2011（**PMID 21345337**, *Clin Chim Acta*）：PA hyperfiltration **14.5% vs EH 7.0%**（p=0.005）；unilateral adrenalectomy 或 spironolactone 治療後 eGFR 下降；preop 低血鉀 + 長 HTN latency 加重下降。（Wu 2011 支持 hyperfiltration unmasking 的**概念**，但未定義具體的 dip 數值門檻。）
- **structural（警訊）**：真實腎實質損傷 / AKI / volume depletion。

### 6.2 量化

| dip 幅度（1-3 月內） | 判讀 | 動作 |
|---|---|---|
| **約 5-15 mL/min** | 常見 hemodynamic unmasking（臨床 heuristic，非驗證門檻） | 觀察、不停藥 |
| **>30%** | 與 MAKE 相關的 risk signal（非已證實 structural injury） | 排查 AKI/volume/藥物/obstruction/既有 CKD progression + 密切追蹤 |

- Chen JY 2024（**PMID 38051943**, *JCEM*；multicenter prospective cohort）：adrenalectomy 後 6 月內 eGFR dip >30% 佔 **16.6%（n=74/445）**；dip >30% 組 **MAKE 風險上升（HR 2.18 [1.04-4.57]）**；mortality/CV composite 無顯著差異。屬觀察性關聯，非結構性腎傷害之診斷。

> **⚠️ 量化門檻無共識**
> **10% / 20% / 30% 作為 actionable 處置門檻並無共識**；−30% 是觀察性研究的 **MAKE 相關切點**，不是經驗證的「該停藥/該轉介」處置線，也不是 structural injury 診斷線。臨床判讀需結合 trajectory、UACR、可逆因子，不是單看一個百分比。

> **⚠️ Uncertainty — 長期軌跡是文獻 GAP**
> PA 專屬證據停在「**誰**會長期 eGFR 下降」（既有 meta-analysis：風險因子＝高齡/高 SBP/preop 低血鉀/低 eGFR）與「surgery < medical 的 CKD 事件」（既有 cohort），**未把腎功能建成 acute-dip-vs-chronic-slope 軌跡 phenotype**。「acute dip ≠ 長期傷腎」的方法學主要來自**非 PA**領域（IgAN、finerenone CKD）。→ PA 治療後長期腎軌跡分層在文獻是缺口。

---

## 7. 生化治癒與 renin de-suppression（連 [Q5](/pa/q05-surgery-vs-mra-treatment/)）

### 7.1 PASO / PAMO 結局定義

- **PASO 2017**（手術，**PMID 28576687**, Williams TA）：clinical **complete 37% / partial 47%**；biochemical **complete 94%**。
- **PAMO 2025**（MRA，**PMID 39824204**, Yang J, *Lancet Diab Endocrinol* 13(2):119-133）：N=1258，**complete biochemical 52.9%（559/1057 有數據者）/ complete clinical 18.3%（228/1248）**。
- → **生化治癒遠比臨床完全停藥常見**；MRA arm 達 complete clinical 不到 1/5，多數仍需持續用藥。

### 7.2 renin de-suppression 為現代治癒指標

- **Hundemer 2018**（**PMID 29129576**, *Lancet Diab Endocrinol*）：MRA 後 renin 仍 suppressed（PRA <1）者，在 observational cohort 中 CV/死亡風險接近未治療 PA；unsuppressed 者無超額風險。
- **Katsuragawa 2025 meta**（**PMID 41235994**, *Lancet Diab Endocrinol* 13(12):1041-1053；24 studies/6621 pt）：unsuppressed renin → CV events **HR 0.43**（0.23-0.80, low cert）；**≥5 yr HR 0.33**（0.19-0.57, mod cert）；**renal 無顯著 HR 0.95**（0.51-1.77, very low）；mortality HR 0.29（1 study, low）。多數研究 PRA cutoff **1.0**。作者結論明示：需前瞻研究才能確認「滴定至 renin 正常化可改善臨床結局」。

> **⚠️ hedge — PRA cutoff + 硬終點強度**
> ① **PRA cutoff 1 vs 2 無 RCT 直接比較**，PAMO 及多數研究用 1.0；PRA ≥1 宜視為常用工作目標、非鐵律，亦非指引固定 target。
>
> ② **renin-guided titration 無完成的硬終點 RCT** 證明優於 BP/K⁺ target：唯一直接試驗 **RETAME-PA**（Merabtine 2025, *BMJ Open*, **PMID 41419284**, NCT06108427）為 feasibility RCT（4 加拿大中心、58 人、open-label），**primary endpoint = 12 月達 unsuppressed renin（生化代理，非硬終點）**。機轉支持來自 **PATHWAY-2 mechanisms substudy**（Williams 2018, **PMID 29655877**：plasma renin/ARR 預測 spironolactone 降壓幅度）。Hundemer/Katsuragawa 為 **observational**；**SPAIN-ALDO（PMID 38225508）** suppressed vs unsuppressed renin 兩組 cardiometabolic 結局無差（HR 0.95 [0.52-1.73]），直接削弱「renin target = 改善硬結局」。→ 定性：**renin de-suppression 是現代最佳可用的治療到位 biomarker，但非 outcome-proven、非脫離臨床脈絡的單一硬指標**。

---

## 8. 共照腎臟科的角色 + MRA 框架辨別

### 8.1 腎臟科端做什麼

- 接手長期 **K⁺/eGFR/BP/renin** 監測、**MRA titration**、**eGFR dip 判讀**、**hyperK 處置**、轉介時機判斷。
- **不做** AVS/adrenalectomy（轉介具經驗中心）；本文範圍為共照端的監測與用藥，不涉分側檢查與手術之執行。

### 8.2 轉介訊號

- 無法解釋的進行性 eGFR 下降；頑固 hyperkalemia；生化復發（疑 recurrence）；需重新 AVS。
- 轉介鏈能否完成取決於整條照護鏈的銜接與可近性，不只醫療判斷。

### 8.3 MRA 框架不混用（連 Finerenone 專案）

> **📝 steroidal MRA（PA）vs nonsteroidal MRA（finerenone）**
> 都看 K⁺ + eGFR，但**目標不同，勿互套停藥邏輯**：
> - **PA steroidal MRA**（spironolactone/eplerenone）：target = renin/生化治癒。
> - **finerenone nsMRA**：target = albuminuria/心腎保護（KDIGO 框架，4 週查 K⁺/eGFR，其後 ~每 4 月）。連 [Finerenone Q07 — Steroidal vs Nonsteroidal](/finerenone/q07-steroidal-vs-nonsteroidal/) / [Finerenone Q08 — 監測頻率](/finerenone/q08-monitoring-frequency/)。

---

## 9. NHI 給付要點（細節回 [Q11](/pa/q11-taiwan-nhi-coverage/)）

- 治療後監測抽血（K⁺/eGFR/PRA/PAC）之給付要點：**截至本次查核可見**，常規生化（K⁺、Cr/eGFR）為一般給付；PRA/PAC 之健保碼與點數以 [Q11](/pa/q11-taiwan-nhi-coverage/) + 健保署最新支付標準為準。
- 時效語氣：申報前以最新版查詢系統為準；本文不列具體點數。

---

## 10. Uncertainty / 灰色地帶

| 主張 | 證據強度 | 缺口 |
|---|---|---|
| 兩臂監測排程節點 | 依據 expert/label，非 RCT | 無 RCT 比較不同 schedule |
| eGFR dip 約 5-15 hemodynamic / >30% MAKE-associated risk signal | 一手確認；量化門檻無共識 | 10/20/30% 處置門檻無共識；長期軌跡分層 PA 文獻 GAP |
| renin de-suppression 為治癒指標 | 機轉明確；結局證據 observational | 無硬終點 RCT（RETAME-PA feasibility）；PRA cutoff 1 vs 2 未定 |
| PASO 37/47/94、PAMO 52.9/18.3 | 一手確認 | — |
| finerenone 用於 PA | emerging，非標準 | 單臂 57 人 [Li P 2026, PMID 41568520] + pilot RCT，非標準、不入主推薦 |

> **📝 Emerging — finerenone in PA（勿過度延伸）**
> Li P 2026（*Hypertension* 2026;83(5):e26048, **PMID 41568520**；multicenter prospective single-arm exploratory，n=57）：finerenone 20-40 mg/day × 12 週於 PA 降 daytime SBP −6.69、K⁺ +0.39、PRA 上升、耐受良好，PAMO complete biochemical 29.1%/clinical 20.0%；另有 Circulation pilot RCT。作者明寫需 head-to-head RCT 才能取代 spironolactone。**PA 標準治療仍為 adrenalectomy 或 steroidal MRA；finerenone 屬 emerging，不入主推薦。**

---

## References

1. Park KS, et al. *Eur J Endocrinol* 2015;172(6):725-731. **PMID 25766046** — 術後 hyperkalemia transient 3.2%/persistent 7.3% + 4 risk factors。
2. Shariq OA, et al. Contralateral suppression index and post-adrenalectomy hyperkalemia. *Surgery* 2018;163(1):183-190. **PMID 29129366** — CSI <0.47 預測術後 hyperK（12/192=6.3%、中位 13.5 天）。
3. Tahir A, McLaughlin K, Kline G. Severe hyperkalemia following adrenalectomy for aldosteronoma — a case series. *BMC Endocr Disord* 2016;16:43. **PMID 27460219** — 術後 hyperK 處置（fludrocortisone、q1-2 週監測）。
4. Chen JY, et al. Association of dip in eGFR with clinical outcomes after adrenalectomy for unilateral PA. *J Clin Endocrinol Metab* 2024;109(3):e965-e974. **PMID 38051943** — 術後 eGFR dip >30% 16.6%、MAKE HR 2.18 [1.04-4.57]、mortality/CV NS。
5. Hundemer GL, et al. *Lancet Diabetes Endocrinol* 2018;6(1):51-59. **PMID 29129576** — MRA 後 renin 仍 suppressed 者 CV/死亡風險如未治療 PA（observational）。
6. Katsuragawa S, Le MV, Fuller PJ, Yang J. Post-treatment renin status and outcomes in medically treated PA: systematic review and meta-analysis. *Lancet Diabetes Endocrinol* 2025;13(12):1041-1053. **PMID 41235994** — 24 studies/6621；unsuppressed renin CV HR 0.43 [0.23-0.80]、≥5yr 0.33、renal 0.95 [0.51-1.77] ns、mortality 0.29；PRA cutoff 1.0；前瞻確認待做。
7. Williams TA, et al. PASO. *Lancet Diabetes Endocrinol* 2017;5(9):689-699. **PMID 28576687** — 手術結局 clinical complete 37%/biochemical complete 94%。
8. Yang J, et al. PAMO. *Lancet Diabetes Endocrinol* 2025;13(2):119-133. **PMID 39824204** — MRA 結局 complete biochemical 52.9%/clinical 18.3%（N=1258）。
9. Wu VC, et al. Kidney impairment in primary aldosteronism. *Clin Chim Acta* 2011;412(15-16):1319-1325. **PMID 21345337** — PA hyperfiltration 14.5% vs EH 7.0%；治療後 eGFR 下降。
10. Adler GK, et al. Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline. *J Clin Endocrinol Metab* 2025;110(9):2453-2495. **PMID 40658480** — renin-aware MRA titration（限 BP 未控 + renin suppressed）。
11. Yoon JH, et al. AKI after laparoscopic adrenalectomy & CKD progression in PA. *Investig Clin Urol* 2021;62(5):560-568. **PMID 34387032** — preop albuminuria 為 CKD progression 唯一獨立預測因子。
12. Mermejo LM, et al. Early renin recovery after adrenalectomy in APA. *Horm Metab Res* 2022;54(4):224-231. **PMID 35413743** — renin/DRC median 15 天回 / aldosterone median 60 天。
13. Williams B, et al. PATHWAY-2 mechanisms substudies. *Lancet Diabetes Endocrinol* 2018;6(6):464-475. **PMID 29655877** — plasma renin/ARR 預測 spironolactone 降壓幅度（renin-guided 機轉支持）。
14. Parra Ramírez P, et al. SPAIN-ALDO：renin as biomarker. *High Blood Press Cardiovasc Prev* 2024;31(1):43-53. **PMID 38225508** — suppressed vs unsuppressed renin 兩組結局無差 HR 0.95 [0.52-1.73]。
15. Merabtine A, et al. RETAME-PA feasibility RCT protocol. *BMJ Open* 2025;15(12):e111167. **PMID 41419284**（NCT06108427）— renin-guided MRA titration，primary endpoint = 12 月 unsuppressed renin（生化代理）。
16. Li P, et al. Efficacy and Safety of Finerenone in Patients With Primary Aldosteronism: A Multicenter Prospective Study. *Hypertension* 2026;83(5):e26048. **PMID 41568520** — single-arm exploratory, n=57；daytime SBP −6.69、K⁺ +0.39、PRA↑、PAMO 生化 29.1%/臨床 20.0%（emerging，非標準）。
17. Vaidya A, Kline GA, Mulatero P, et al. Primary aldosteronism. *Nat Rev Dis Primers* 2026;12(1):39. **PMID 42350437** — 2026 旗艦 Primer；內科治療目標含 renin 由 suppressed → non-suppressed 為治療到位 biomarker、需長期縱貫監測（最佳 renin target 與 U-shape 尚無高品質 RCT）。
18. Tetti M, Brüdgam D, Burrello J, et al. Unilateral Primary Aldosteronism: Long-Term Disease Recurrence After Adrenalectomy. *Hypertension* 2024;81(4):936-945. **PMID 38318706** — 術後長期生化復發 23%、nonclassical histopathology 為高風險族群。
