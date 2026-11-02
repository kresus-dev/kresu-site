// Theme (suit le telephone, bouton pour changer) + filtres de la FAQ
(function () {
  var root = document.documentElement, KEY = "kresu-theme";
  try { var t = localStorage.getItem(KEY); if (t) root.setAttribute("data-theme", t); } catch (e) {}
  function dark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function label(b) { b.textContent = dark() ? "☀️" : "🌙"; b.setAttribute("aria-label", dark() ? "Passer en thème clair" : "Passer en thème sombre"); }
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("theme");
    if (b) { label(b); b.addEventListener("click", function () {
      var n = dark() ? "light" : "dark"; root.setAttribute("data-theme", n);
      try { localStorage.setItem(KEY, n); } catch (e) {}
      label(b);
    }); }
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        var cat = c.getAttribute("data-cat");
        document.querySelectorAll("#faq details").forEach(function (d) {
          d.hidden = !(cat === "tout" || d.getAttribute("data-cat") === cat);
        });
      });
    });
  });
})();

// Numero WhatsApp : lu dans les reglages de l'appli (admin), sinon on garde celui ecrit dans la page
(function () {
  var URL = "https://ypryzrxfhsmkwduxqdih.supabase.co";
  function apply(raw) {
    var d = String(raw || "").replace(/\D/g, "");
    if (d.length < 8) return;
    var intl = d.indexOf("225") === 0 ? d : "225" + d;
    var local = intl.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ");
    document.querySelectorAll("a[href^='https://wa.me/']").forEach(function (a) { a.href = "https://wa.me/" + intl; });
    document.querySelectorAll("[data-wa]").forEach(function (e) { e.textContent = local; });
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.KRESU_ANON || !window.fetch) return;
    fetch(URL + "/rest/v1/rpc/public_contact", {
      method: "POST", headers: { apikey: window.KRESU_ANON, "Content-Type": "application/json" }, body: "{}"
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) apply(j.whatsapp); }).catch(function () {});
  });
})();
