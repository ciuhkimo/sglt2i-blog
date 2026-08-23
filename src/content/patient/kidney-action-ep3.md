---
title: "護腎行動 EP3｜三高與腎臟：把數字管好"
description: "護腎行動系列第 3 集：血壓、血糖、血脂都會傷腎；722 量血壓、糖化血色素看趨勢、數字變好別自行停藥。附三高護腎行動清單互動工具。"
seo_title: "三高與腎臟：把數字管好｜護腎行動 EP3"
last_updated: 2026-07-17
about_condition: "Chronic Kidney Disease"
disclaimer: "本頁提供慢性腎臟病的衛教影片與互動工具，內容供一般民眾衛教參考，不能取代醫師的個別診療。用藥與目標值請依您的醫療團隊建議，數字變好也不要自行停藥或改藥。"
tags: [護腎行動, 慢性腎臟病, CKD, 病人衛教, 衛教影片, 高血壓, 糖尿病, 血脂]
unlisted: true
video_src: "/videos/kidney-action/ep3.mp4"
video_poster: "/videos/kidney-action/ep3-poster.jpg"
video_duration: "PT75S"
---

[← 護腎行動系列總覽](/patient/kidney-action-series/)　·　第 3 集 / 共 5 集

<video controls preload="none" playsinline poster="/videos/kidney-action/ep3-poster.jpg" controlslist="nodownload noremoteplayback" disablepictureinpicture width="1920" height="1080" style="width:100%;height:auto;border-radius:8px;background:#000;display:block">
  <source src="/videos/kidney-action/ep3.mp4" type="video/mp4">
  您的瀏覽器不支援內嵌影片，請更新瀏覽器後再試。
</video>

**影片旁白文字（無聲動畫）**

三高不只傷心臟，也會傷腎臟；沒有不舒服，也要把數字管好。三高是血壓、血糖和血脂；體重與腰圍不是第三高，但會讓控制更困難。血壓要先量對：休息五分鐘，手臂與心臟同高。「七二二」是連續七天、早晚各一次、每次量兩遍。血糖不只看空腹，糖化血色素反映兩到三個月的趨勢；目標因人而異，低血糖要依個人計畫處理。血脂要確認自己的目標；體重和腰圍用固定方式，追蹤長期變化。數字變好，常代表治療正在發揮作用，不要自行停藥、加藥，或用雙倍劑量補吃。記住：量對、按時吃、持續驗、帶回診；除了三高，也要追蹤 eGFR 和 UACR 或尿蛋白。

**互動：三高護腎行動清單**

<iframe class="ka-widget" src="/interactive/kidney-action/ep3.html" title="三高護腎行動清單（互動工具）" loading="lazy" height="440" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;background:transparent;display:block"></iframe>

---

**繼續看**：[← EP2](/patient/kidney-action-ep2/)　｜　[EP4 · 護腎飲食：先少鹽、少加工 →](/patient/kidney-action-ep4/)

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
