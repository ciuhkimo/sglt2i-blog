---
title: "護腎行動 EP2｜肌酸酐正常就沒事嗎？看懂 eGFR 與 UACR"
description: "護腎行動系列第 2 集：肌酸酐在範圍內不代表腎臟沒事，eGFR 搭配 UACR 才看得完整。附腎臟檢驗報告判讀小幫手互動工具。"
seo_title: "肌酸酐正常就沒事嗎？看懂 eGFR 與 UACR｜護腎行動 EP2"
last_updated: 2026-07-17
about_condition: "Chronic Kidney Disease"
disclaimer: "本頁提供慢性腎臟病的衛教影片與互動工具，內容供一般民眾衛教參考，不能取代醫師的個別診療。影片中的自我檢查不是診斷，也不會計算疾病風險分數；檢驗結果請由您的醫療團隊判讀。"
tags: [護腎行動, 慢性腎臟病, CKD, 病人衛教, 衛教影片, eGFR, UACR, 尿蛋白]
unlisted: true
video_src: "/videos/kidney-action/ep2.mp4"
video_poster: "/videos/kidney-action/ep2-poster.jpg"
video_duration: "PT75S"
---

[← 護腎行動系列總覽](/patient/kidney-action-series/)　·　第 2 集 / 共 5 集

<video controls preload="none" playsinline poster="/videos/kidney-action/ep2-poster.jpg" controlslist="nodownload noremoteplayback" disablepictureinpicture width="1920" height="1080" style="width:100%;height:auto;border-radius:8px;background:#000;display:block">
  <source src="/videos/kidney-action/ep2.mp4" type="video/mp4">
  您的瀏覽器不支援內嵌影片，請更新瀏覽器後再試。
</video>

**影片旁白文字（無聲動畫）**

健檢看到肌酸酐在範圍內，就能放心嗎？不一定，看腎臟不能只看一個數字。肌酸酐會受到年齡、性別與肌肉量影響，先看 eGFR，再搭配 UACR，才看得完整。eGFR 是腎臟過濾能力的估算值，不是「剩下幾成腎功能」。UACR 看的是尿中是否漏出白蛋白；一般尿蛋白試紙陰性，也可能漏掉早期白蛋白尿。eGFR 看似較高，也可能已有 UACR 升高，兩個指標要放在一起看。一次異常不是慢性腎臟病的診斷，要看歷次結果，並由醫師依病況安排複檢。拿出報告：找出 eGFR 和 UACR 或尿蛋白、記下日期；看到異常，就問清楚何時複檢。

**互動：檢驗報告判讀小幫手**

<iframe class="ka-widget" src="/interactive/kidney-action/ep2.html" title="腎臟檢驗報告判讀小幫手（互動工具）" loading="lazy" height="440" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;background:transparent;display:block"></iframe>

---

**繼續看**：[← EP1](/patient/kidney-action-ep1/)　｜　[EP3 · 三高與腎臟：把數字管好 →](/patient/kidney-action-ep3/)

<script>
(function () {
  function fit(f) {
    try {
      var d = f.contentDocument || (f.contentWindow && f.contentWindow.document);
      if (!d || !d.body) return;
      var h = d.body.scrollHeight;
      if (h > 0) f.style.height = (h + 8) + 'px';
    } catch (e) {}
  }
  function wire(f) {
    var run = function () { fit(f); setTimeout(function () { fit(f); }, 250); };
    f.addEventListener('load', run);
    try { if (f.contentDocument && f.contentDocument.readyState === 'complete') run(); } catch (e) {}
    try {
      var d = f.contentDocument;
      if (d && d.body && 'ResizeObserver' in window) {
        new ResizeObserver(function () { fit(f); }).observe(d.body);
      }
    } catch (e) {}
  }
  function initAll() {
    var list = document.querySelectorAll('iframe.ka-widget');
    for (var i = 0; i < list.length; i++) wire(list[i]);
  }
  window.addEventListener('resize', function () {
    var list = document.querySelectorAll('iframe.ka-widget');
    for (var i = 0; i < list.length; i++) fit(list[i]);
  });
  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();
</script>
