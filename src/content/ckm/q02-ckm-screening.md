---
question_id: "Q02"
title: "CKM 篩檢與識別"
category: "定義與識別"
version: "v1.1"
status: "查核修訂版"
last_updated: 2026-04-22
next_review: 2027-04-22
tags:
  - CKM-syndrome
  - cardiorenal-metabolic
  - decision-note
  - screening
  - UACR
  - PREVENT
  - KFRE
  - minimum-dataset
description: "腎臟科門診如何系統性辨識 CKM syndrome 病人？涵蓋最低篩檢資料集（UACR、eGFR、BMI、BP）、風險分層流程與 shared care 啟動時機。"
quick_answer: ""
seo_title: "Q02 CKM 篩檢與識別 | CKM Syndrome 腎臟科臨床決策"
---

**臨床問題**

腎臟科門診應如何系統性辨識並分層 CKM syndrome 病人？最低資料集（minimum dataset）是什麼？何時啟動 shared care？
---

## 本次查核後的主要修正

1. **修正 CKM stage 的開場框架**：原文把「腎臟科門診病人幾乎定義上落在 CKM stage 2–4」寫得太絕對。較精準的說法是：
   - **AHA 2026** 明確指出 CKM staging framework 對「幾乎所有 CKD 病人」都相關；
   - 但 **stage 2 / 3 / 4 仍須依 CKD 風險層級、是否已有 subclinical/clinical CVD、以及 PREVENT 是否適用** 來區分，不能一概而論。

2. **移除「PREVENT ≥20% = 官方 CKM stage 3 cut-point」寫法**：
   - 官方 AHA CKM implementation guide 只寫到 **「high predicted 10-year CVD risk using PREVENT」可視為 stage 3 risk equivalent**；
   - 我本次查核到的官方材料**沒有提供一個通用、固定的百分比 cut-point** 可直接當作 CKM stage 3 的標準門檻。

3. **下修 NT-proBNP in CKD 的確定性**：
   - 原文把 CKD-adjusted NT-proBNP 百分比上調寫得偏像 universal rule；
   - 較精準的定位應是：**這是 HF/HFpEF algorithm 應用時可參考的 expert-consensus–derived adjustment**，不是所有腎臟科病人的 mandatory screening threshold。

4. **更新 AHA 2026 狀態**：
   - 原文寫「AHA 2026 預計發表首部整合性 CKM 臨床實作指引」；
   - 目前應改為：**AHA 2026 CKM Health Implementation Guide 已發布**。

5. **修正 PREVENT 外部效度敘述**：
   - 原文寫「台灣/東亞尚無已發表驗證論文」過度絕對；
   - 較安全寫法是：**台灣/東亞在地校正與實作研究仍有限，故 PREVENT 在本地主要作為輔助風險溝通工具，而非單獨決策器。**

---

## Why This Matters

- **AHA 2026 implementation guide** 已明示：CKM staging framework 對幾乎所有 CKD 病人都相關；而且在 CKM stage 2–4，**正確的 kidney function evaluation 是核心工作**。
- **albuminuria testing 仍被明顯低估**：在 insured US adults with CKD 的研究中，**59% 未接受 albuminuria testing**；在高血壓/糖尿病的大型 EHR 研究中，約 **two-thirds of albuminuria remained undetected because of lack of testing**。
- 台灣 515,602 人世代顯示 **71.5% 成人符合 CKM**；其中 CKM stage 2 佔 **46.3%**，且相較於無 CKM 成分者，**CVD mortality HR 2.81、incident ESKD HR 10.15**。
- 以 CKD-PC 24 cohorts、637,315 人的 meta-analysis 來看，**albuminuria 與 eGFR 應同時納入 CV 風險分類**；其中 ACR 對 **CV mortality 與 HF** 的 discrimination improvement 特別明顯。
- 一旦高風險者被辨識出來，並不是只「貼標籤」而已：目前已有可連結到 hard outcomes 的治療證據與 guideline-directed therapy，包括 **ACEi/ARB、SGLT2 inhibitor、finerenone、GLP-1RA/semaglutide（特定情境）**。

---

## Key Evidence

### Minimum Dataset（腎臟科門診 baseline）

| 維度 | 必做項目 | Selective / preferred add-on | 實務備註 |
|------|---------|------------------------------|----------|
| 體態 | **BMI + 腰圍（WC）** | Waist-to-height ratio | AHA adulthood screening 建議每年量測 BMI 與 WC。亞洲參考 cutoffs 可用 BMI ≥23、WC 男 ≥90 / 女 ≥80 cm，但分期仍需整體判讀。 |
| 血壓 | **standardized office BP** | home BP / ambulatory BP | KDIGO 2021：成人 high BP + CKD 可考慮以 **SBP <120 mmHg** 為治療目標，但前提是 **standardized office BP** 且可耐受；AHA CKM algorithm 與 ADA diabetes care 常用 **<130/80 mmHg** 作為實務目標。 |
| 血糖 | **HbA1c（有糖尿病者）或 FPG** | OGTT / CGM（特定情境） | KDIGO 2022：HbA1c 在 advanced CKD G4–G5、特別是 dialysis 時可靠性下降，但仍是主要 glycemic biomarker。 |
| 血脂 | **完整 lipid profile** | ApoB / Lp(a)（選擇性） | CKM stage 2 adulthood screening 應系統性評估 metabolic syndrome components。 |
| 腎臟 | **serum creatinine/eGFR + spot UACR** | **cystatin C（eGFRcr-cys）** | KDIGO 2024：at-risk / CKD 病人應同時做 **GFR + urine albumin measurement**；異常 UACR 或 eGFR 要重複確認；**首晨尿優先**，無法時 random spot 可接受；確認 chronicity 需 **≥3 個月**。 |
| 心臟 | 非必做 | **NT-proBNP ± echocardiography** | AHA 2026：subclinical HF screening with echo and/or cardiac biomarkers **likely** 可考慮，但 **not yet defined**；故不列為所有腎臟科病人的 mandatory panel。 |

### 三工具分工

| 工具 | 適用對象 | 用途 | 關鍵門檻 / 正確定位 |
|------|---------|------|---------------------|
| **KDIGO heat map** | 所有 **confirmed CKD** | 腎風險骨架；也是 CKM stage mapping 的核心 | AHA 2026：**moderate-to-high risk KDIGO categories** 對應 CKM stage 2 的核心腎臟表型；**G4/G5 或 very high-risk KDIGO** 可成為 CKM stage 3 的 risk equivalent。 |
| **KFRE** | CKD **G3–G5** | 預測 kidney failure trajectory；決定 referral / MDT / KRT planning | KDIGO 2024：**5-year risk 3%–5%** 可作為 referral 參考；**2-year risk >10%** 可作為 multidisciplinary care 時機；**2-year risk >40%** 可作為 KRT education、vascular access / transplant planning 時機。 |
| **PREVENT** | **30–79 歲、無 known CVD** | total CVD / HF 的 primary prevention risk estimate | AHA 官方寫法是 **high predicted 10-year CVD risk** 可視為 CKM stage 3 risk equivalent；**不要把單一固定百分比直接寫成官方 CKM stage cut-point**。 |

**三工具不可混用**

- **KDIGO heat map**：定義 CKD 風險結構。
- **KFRE**：預測腎衰竭時間軌跡。
- **PREVENT**：估 primary prevention 的 total CVD / HF risk。
PREVENT 不適用於已知 CVD 的 secondary prevention；KFRE 也不應外推到 CKD G1–G2 當主要工具。
### HFpEF / subclinical HF：只在「有問題時」做 selective work-up

| 工具 | 實務用法 | 重點 |
|------|---------|------|
| **H2FPEF score** | unexplained dyspnea / edema / exercise intolerance、懷疑 HFpEF 時使用 | 原始研究中 **score ≥6** 對 HFpEF 有高機率（~90%）；不是 universal CKM screening tool。 |
| **HFA-PEFF** | 當有 echo 與 natriuretic peptide 資料、需要較結構化診斷時使用 | **≥5** 支持 HFpEF；**2–4** 需功能性測試；**≤1** 使 HFpEF 較不可能。 |

### NT-proBNP in CKD：可作為解讀輔助，但不要過度制度化

#### 實務定位
- AHA 2026 並**沒有**要求把 natriuretic peptide 納入所有腎臟科病人的 CKM mandatory screen。
- 若你是在 **HF/HFpEF ambulatory algorithm** 中解讀 NT-proBNP，近年 HFA/ESC consensus 與 cardiorenal review 提出：
  - eGFR **45–60**：可考慮 **+15%**
  - eGFR **30–45**：可考慮 **+25%**
  - eGFR **<30**：可考慮 **+35%**
- 這種做法的定位應是：**expert-consensus–derived interpretation aid**，不是 KDIGO/AHA 的 universal CKD threshold。

#### 什麼情況更要保守解讀
- atrial fibrillation
- dialysis / advanced CKD
- acute volume overload
- acute coronary syndrome / sepsis / inpatient illness
- 單次抽血與臨床狀態不一致時

**不要把急診或急性 HF 的單一絕對 NT-proBNP cutoff 直接平移到穩定 CKD 門診。**
### Cystatin C discordance：高價值加驗情境

- 若 **eGFRcys 顯著低於 eGFRcr**（例如差距 ≥15 mL/min/1.73m²，或 eGFRcys/eGFRcr <0.60），與較高死亡風險相關。
- 2025 UK Biobank 分析顯示：
  - discordant lower absolute eGFRcys：**HR 1.53**
  - lower relative eGFRcys（<60%）：**HR 2.25**
- 因此，下列情境可主動加驗 cystatin C：
  - 高齡 / frailty / sarcopenia
  - 重度肥胖
  - creatinine 可信度可疑
  - 需要較準確風險分層或藥物劑量判斷

---

## Clinical Decision

### 建議做法

1. **Screen all → confirm chronicity → stage correctly → intensify by risk**
   - **Layer 1：所有腎臟科門診病人** → minimum dataset 補齊。
   - **Layer 2：疑似 CKD / CKM** → abnormal eGFR 或 UACR 先重複確認，不要單次就 finalize。
   - **Layer 3：confirmed CKD** → 以 KDIGO heat map 為骨架，再結合 DM、obesity/metabolic factors、subclinical/clinical CVD、以及 PREVENT 是否適用，決定 CKM stage 與 care intensity。

2. **住院 → 門診轉銜**
   - 住院首次發現異常 creatinine / eGFR / UACR，先標為 **CKM-suspect / CKD-suspect**。
   - 出院後建立 closed-loop task：**repeat creatinine + UACR**，確認 chronicity 後再正式標註。

3. **Minimum dataset 的刷新頻率**
   - BMI / WC、BP、metabolic syndrome components：至少每年一次。
   - UACR + creatinine/cystatin C：
     - CKM stage 2 或以上：至少每年一次；
     - KDIGO risk 愈高，頻率應更密。

4. **EHR / workflow 自動化（非常值得做）**
   - 過去 12 個月無 UACR → 自動提醒 / standing order。
   - 無腰圍紀錄 → nursing intake 提示。
   - 單次異常 eGFR/UACR → repeat-to-confirm task。
   - CKD G3–G5 → 自動計算 KFRE。
   - 30–79 歲 + 無已知 CVD + 資料完整 → 可自動跑 PREVENT。
   - **任何兩項**：CKD、diabetes、subclinical/clinical CVD 並存 → 啟動 **CKM coordinator / interdisciplinary care trigger**。

5. **病歷文件化**
   - 建議不要只寫 `CKM Stage X`。
   - 最好寫成：
     `CKM Stage X (basis: KDIGO G/A risk + DM/metabolic factors + subclinical/clinical CVD + PREVENT applicable/not applicable)`

### Shared care / co-management 觸發點（修訂版）

**下表是 **operational triggers**，不是所有院所都必須一模一樣；可依資源調整。**
| 路徑 | 建議 trigger |
|------|--------------|
| **心臟科 co-management** | 不明原因 dyspnea / edema / exercise intolerance；echo 異常（如 LVEF <50%、E/e′ 明顯升高、PASP >35）；懷疑 subclinical HF / HFpEF；resistant HTN；或 primary prevention 風險很高但脂質/降壓/體重策略需要整合討論。 |
| **內分泌 / obesity medicine** | HbA1c 仍未達標且已進行 cardiorenal-protective therapy 最佳化；T1DM / brittle DM；BMI ≥35 且合併相關共病，需討論 GLP-1RA / metabolic surgery / 體重管理。 |
| **腎臟 MDT / advanced CKD pathway** | **CKD G4–G5 或 eGFR <30 持續**；**2-year KFRE >10%**；**2-year KFRE >40%** 時啟動 KRT education / access / transplant planning；persistent UACR >300 可提前列為 intensification 名單。 |
| **CKM coordinator / interdisciplinary clinic** | **任何兩項**：CKD、diabetes、subclinical/clinical CVD 併存。這是 AHA 2026 implementation guide 直接支持的 team-based trigger。 |

### 不建議做法

1. **不要只看 creatinine/eGFR 而漏掉 UACR。**
2. **不要把 NT-proBNP / hs-cTn 列成所有腎臟科病人的 mandatory CKM panel。**
3. **不要把急診或急性 HF 的 NP cutoff 直接外推到 CKD 門診。**
4. **不要在 AKI 或單次住院異常時直接 finalize confirmed CKM / confirmed CKD。**
5. **不要單獨依 PREVENT 啟動或停止治療。**
6. **不要把固定百分比（例如 20%）寫成「官方 CKM stage 3 cut-point」。**
7. **不要把 KFRE 外推到 CKD G1–G2 當主要決策器。**

---

## Uncertainty

### 高度不確定

- **CKM label 本身是否能獨立改善 hard outcomes**：目前沒有直接 RCT；真正有結局證據的是其下游風險辨識與 targeted therapy。
- **CKD-specific natriuretic peptide / hs-cTn 統一閾值**：目前仍未標準化，尤其在 stable nephrology clinic、advanced CKD、dialysis。
- **PREVENT 在 CKM stage 3 的數字 cut-point**：官方 AHA implementation guide 有「high predicted risk」概念，但本次查核到的官方材料**未提供通用固定百分比**。

### 中度不確定

- **PREVENT 在台灣/東亞的在地校正與 workflow performance**：目前仍有限，因此在本地更適合作為輔助風險溝通，而非單獨決策器。
- **nonalbuminuric CKD / nonalbuminuric DKD 的風險軌跡**：仍不應因 UACR 正常就低估風險。
- **腎臟科門診 routine asymptomatic HFpEF screening 的 yield**：AHA 2026 也只寫到「likely based on age/comorbidities/risk score but not yet defined」。

### 待追蹤

- **RENAL LIFECYCLE Trial**（dapagliflozin in severe CKD / dialysis / transplant spectrum；ClinicalTrials.gov **NCT05374291**）
- 台灣 / 東亞 PREVENT 在地校正研究
- CKD outpatient setting 下，更可操作的 natriuretic peptide / biomarker algorithms

---

## 經查核後可直接採用的一分鐘框架

1. **先補齊 minimum dataset**：BMI、腰圍、標準化 BP、血糖、血脂、creatinine/eGFR、UACR；必要時加 cystatin C。
2. **先確認 chronicity，再正式分期**：單次異常 ≠ confirmed CKD / CKM。
3. **KDIGO heat map 是骨架，KFRE 管腎衰軌跡，PREVENT 管 primary-prevention CVD risk。**
4. **不要把 PREVENT 固定百分比寫成官方 CKM stage 門檻。**
5. **NT-proBNP 是 selective add-on，不是 universal CKM panel。**
6. **任何兩項 CKD、DM、subclinical/clinical CVD 併存，就該考慮 CKM coordinator / interdisciplinary care。**

---

## Verified References

### 權威網站 / 指引
1. American Heart Association. **Cardiovascular-Kidney-Metabolic Health Initiative: Implementation Guide**. 2026.
2. American Heart Association. **PREVENT™ equations / online calculator professional pages**.
3. KDIGO. **2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease**.
4. KDIGO. **2024 CKD Guideline Executive Summary**.
5. KDIGO. **2021 Clinical Practice Guideline for the Management of Blood Pressure in CKD**.
6. KDIGO. **2022 Clinical Practice Guideline for Diabetes Management in CKD**.
7. American Diabetes Association. **Standards of Care in Diabetes 2026**.

### PubMed / 重要研究
1. Chu CD, et al. **Albuminuria testing and nephrology care among insured US adults with chronic kidney disease**. 2022. **PMID: 36434513**.
2. Chu CD, et al. **Estimated Prevalence and Testing for Albuminuria in US Adults at Risk for Chronic Kidney Disease**. *JAMA Netw Open*. 2023;6(7):e2326230. **DOI: 10.1001/jamanetworkopen.2023.26230**. **PMID: 37498594**.
3. Matsushita K, et al. **Estimated glomerular filtration rate and albuminuria for prediction of cardiovascular outcomes: a collaborative meta-analysis of individual participant data**. *Lancet Diabetes Endocrinol*. 2015. **DOI: 10.1016/S2213-8587(15)00040-6**.
4. Tsai MK, et al. **Cardiovascular-kidney-metabolic syndrome and all-cause and cardiovascular mortality: A retrospective cohort study**. *PLoS Med*. 2025. **DOI: 10.1371/journal.pmed.1004629**. **PMID: 40570007**.
5. Heerspink HJL, et al. **Dapagliflozin in Patients with Chronic Kidney Disease**. *N Engl J Med*. 2020. **PMID: 32970396**.
6. Herrington WG, et al. **Empagliflozin in Patients with Chronic Kidney Disease**. *N Engl J Med*. 2023. **PMID: 36331190**.
7. Agarwal R, et al. **Cardiovascular and kidney outcomes with finerenone in patients with type 2 diabetes and chronic kidney disease: the FIDELITY pooled analysis**. *Eur Heart J*. 2022. **PMID: 35023547**.
8. Mann JFE, et al. **Effects of Semaglutide on Chronic Kidney Disease in Patients with Type 2 Diabetes**. *N Engl J Med*. 2024. **PMID: 38785209**.
9. Reddy YNV, et al. **A Simple, Evidence-Based Approach to Help Guide Diagnosis of Heart Failure With Preserved Ejection Fraction**. *Circulation*. 2018;138(9):861-870. **DOI: 10.1161/CIRCULATIONAHA.118.034646**. **PMID: 29792299**.
10. Pieske B, et al. **How to diagnose heart failure with preserved ejection fraction: the HFA-PEFF diagnostic algorithm**. *Eur J Heart Fail*. 2020;22(3):391-412. **DOI: 10.1002/ejhf.1741**. **PMID: 32133741**.
11. Bayés-Genís A, et al. **Practical algorithms for early diagnosis of heart failure and heart stress using NT-proBNP: A clinical consensus statement from the Heart Failure Association of the ESC**. 2023. **DOI: 10.1002/ejhf.3036**. **PMID: 37712339**.
12. **Discordance between Cystatin C-Based and Creatinine-Based Estimated Glomerular Filtration Rate and Mortality in the General Population**. *Clin Chem*. 2025. **DOI: 10.1093/clinchem/hvaf063**. **PMID: 40464748**.

### ClinicalTrials.gov
1. **RENAL LIFECYCLE Trial**. ClinicalTrials.gov identifier: **NCT05374291**.

---

## 延伸閱讀

### CKM 專案
- [CKM 定義與分期](/ckm/q01-ckm-definition-staging/)
- [CV 風險分層](/ckm/q14-cv-risk-stratification/)
- [CKM Biomarkers 解讀](/ckm/q15-ckm-biomarkers/)

### 跨專案
- [SGLT2i Q01 — CKD 啟用時機](/sglt2i/q01-ckd-start-timing/)
- [Finerenone Q01 — DKD 啟動時機](/finerenone/q01-dkd-when-to-start/)
