/* Balansera – kemiska reaktioner i balans. Statisk app, inga beroenden. */
(function () {
  "use strict";

  /* ---------------- Data: riktiga reaktioner med kontrollerade koefficienter ----------------
     Varje ämne: f = formel, c = rätt koefficient. Verifierat med atomer() i verify.js:
     antalet atomer av varje grundämne är lika stort på båda sidor om pilen. */
  var REAKTIONER = [
    { niva: 1, svar: "H2 + O2 -> H2O",
      l: [{ f: "H2", c: 2 }, { f: "O2", c: 1 }], r: [{ f: "H2O", c: 2 }] },
    { niva: 1, svar: "N2 + H2 -> NH3",
      l: [{ f: "N2", c: 1 }, { f: "H2", c: 3 }], r: [{ f: "NH3", c: 2 }] },
    { niva: 1, svar: "Na + Cl2 -> NaCl",
      l: [{ f: "Na", c: 2 }, { f: "Cl2", c: 1 }], r: [{ f: "NaCl", c: 2 }] },
    { niva: 1, svar: "Mg + O2 -> MgO",
      l: [{ f: "Mg", c: 2 }, { f: "O2", c: 1 }], r: [{ f: "MgO", c: 2 }] },
    { niva: 1, svar: "H2 + Cl2 -> HCl",
      l: [{ f: "H2", c: 1 }, { f: "Cl2", c: 1 }], r: [{ f: "HCl", c: 2 }] },
    { niva: 1, svar: "H2O2 -> H2O + O2",
      l: [{ f: "H2O2", c: 2 }], r: [{ f: "H2O", c: 2 }, { f: "O2", c: 1 }] },
    { niva: 1, svar: "Cu + O2 -> CuO",
      l: [{ f: "Cu", c: 2 }, { f: "O2", c: 1 }], r: [{ f: "CuO", c: 2 }] },
    { niva: 1, svar: "NO + O2 -> NO2",
      l: [{ f: "NO", c: 2 }, { f: "O2", c: 1 }], r: [{ f: "NO2", c: 2 }] },
    { niva: 2, svar: "CH4 + O2 -> CO2 + H2O",
      l: [{ f: "CH4", c: 1 }, { f: "O2", c: 2 }], r: [{ f: "CO2", c: 1 }, { f: "H2O", c: 2 }] },
    { niva: 2, svar: "Fe + O2 -> Fe2O3",
      l: [{ f: "Fe", c: 4 }, { f: "O2", c: 3 }], r: [{ f: "Fe2O3", c: 2 }] },
    { niva: 2, svar: "KClO3 -> KCl + O2",
      l: [{ f: "KClO3", c: 2 }], r: [{ f: "KCl", c: 2 }, { f: "O2", c: 3 }] },
    { niva: 2, svar: "Al + HCl -> AlCl3 + H2",
      l: [{ f: "Al", c: 2 }, { f: "HCl", c: 6 }], r: [{ f: "AlCl3", c: 2 }, { f: "H2", c: 3 }] },
    { niva: 2, svar: "NaOH + H2SO4 -> Na2SO4 + H2O",
      l: [{ f: "NaOH", c: 2 }, { f: "H2SO4", c: 1 }], r: [{ f: "Na2SO4", c: 1 }, { f: "H2O", c: 2 }] },
    { niva: 2, svar: "P4 + O2 -> P4O10",
      l: [{ f: "P4", c: 1 }, { f: "O2", c: 5 }], r: [{ f: "P4O10", c: 1 }] },
    { niva: 2, svar: "Fe2O3 + CO -> Fe + CO2",
      l: [{ f: "Fe2O3", c: 1 }, { f: "CO", c: 3 }], r: [{ f: "Fe", c: 2 }, { f: "CO2", c: 3 }] },
    { niva: 2, svar: "C2H6 + O2 -> CO2 + H2O",
      l: [{ f: "C2H6", c: 2 }, { f: "O2", c: 7 }], r: [{ f: "CO2", c: 4 }, { f: "H2O", c: 6 }] }
  ];

  /* ---------------- Atomräkning ---------------- */
  function atomer(f) {
    var i = 0;
    function tal() { var m = /^[0-9]+/.exec(f.slice(i)); if (m) { i += m[0].length; return Number(m[0]); } return 1; }
    function add(a, b, n) { for (var k in b) a[k] = (a[k] || 0) + b[k] * n; }
    function grupp() {
      var res = {};
      while (i < f.length) {
        var c = f[i];
        if (c === "(") {
          i++; var inner = grupp();
          add(res, inner, tal());
        } else if (c === ")") { i++; return res; }
        else if (/[A-Z]/.test(c)) {
          var el = c; i++;
          if (f[i] && /[a-z]/.test(f[i])) { el += f[i]; i++; }
          res[el] = (res[el] || 0) + tal();
        } else { i++; }
      }
      return res;
    }
    return grupp();
  }

  function sida(amnen, val) {
    var sum = {};
    amnen.forEach(function (a, idx) {
      var n = val[idx];
      var at = atomer(a.f);
      for (var k in at) sum[k] = (sum[k] || 0) + at[k] * n;
    });
    return sum;
  }
  function bokstavsordning(o) { return Object.keys(o).sort(); }
  function gcdAll(v) { return v.reduce(function (a, b) { return b ? gcdAll([b, a % b]) : a; }); }

  /* ---------------- Kotten (SVG, egen figur) ---------------- */
  var KOTTEN_FARG = "#b07d4b", KOTTEN_MORK = "#8a5f36", KOTTEN_OGON = "#2b2118";
  function kottenSvg(uttryck, klass) {
    // uttryck: "glad" | "tanker" | "hejar" | "firar" | "funderar"
    var mun, ogen = "", extra = "";
    if (uttryck === "hejar") { mun = '<path d="M22 36 q8 8 16 0" fill="none" stroke="' + KOTTEN_OGON + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else if (uttryck === "firar") { mun = '<path d="M21 34 q9 12 18 0" fill="#fff"/><path d="M21 34 q9 12 18 0" fill="none" stroke="' + KOTTEN_OGON + '" stroke-width="2.4" stroke-linecap="round"/>'; extra = '<path d="M10 12 l3 6M50 12 l-3 6M30 6 v5" stroke="#e8a33d" stroke-width="2.2" stroke-linecap="round" fill="none"/>'; }
    else if (uttryck === "tanker") { mun = '<path d="M24 37 h11" stroke="' + KOTTEN_OGON + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>'; ogen = '<circle cx="46" cy="24" r="4" fill="none" stroke="' + KOTTEN_MORK + '" stroke-width="1.6" opacity=".5"/>'; }
    else if (uttryck === "funderar") { mun = '<path d="M22 38 q8 -6 16 0" fill="none" stroke="' + KOTTEN_OGON + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else { mun = '<path d="M22 34 q8 8 16 0" fill="none" stroke="' + KOTTEN_OGON + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    var oga = '<circle cx="23" cy="24" r="5.2" fill="#fff"/><circle cx="37" cy="24" r="5.2" fill="#fff"/>' +
      '<circle cx="24" cy="24.6" r="2.5" fill="' + KOTTEN_OGON + '"/><circle cx="36" cy="24.6" r="2.5" fill="' + KOTTEN_OGON + '"/>';
    return '<svg class="' + (klass || "kotten-svg") + '" viewBox="0 0 60 60" aria-hidden="true">' +
      extra +
      '<path d="M30 6 q9 4 12 12 q9 12 4 24 q-4 12 -16 14 q-12 -2 -16 -14 q-5 -12 4 -24 q3 -8 12 -12z" fill="' + KOTTEN_FARG + '"/>' +
      '<path d="M19 20 q11 -5 22 0M16 30 q14 -5 28 0M16 40 q14 -4 28 0" stroke="' + KOTTEN_MORK + '" stroke-width="1.7" fill="none" opacity=".85" stroke-linecap="round"/>' +
      oga + ogen + mun + '</svg>';
  }
  function kottenIkonFyll(container, uttryck, klass) {
    if (container) container.outerHTML = kottenSvg(uttryck, klass);
  }

  /* ---------------- Ljud (WebAudio, skapas vid första gesten) ---------------- */
  var ac = null, ljudPa = true;
  function ljud(frekvens, längd, typ) {
    if (!ljudPa) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || "sine"; o.frequency.value = frekvens;
      g.gain.value = 0.001;
      o.connect(g); g.connect(ac.destination);
      var t = ac.currentTime;
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + längd);
      o.start(t); o.stop(t + längd + 0.02);
    } catch (e) { /* ljud är ett plus, aldrig ett krav */ }
  }
  function säg(text) {
    if (!ljudPa) return;
          try { if (window.__rost && window.__rost(text, true)) return; } catch (e) { }
        console.warn('saknar mp3:', text);
  }
  function spår(namn, värde) { try { if (window.skolappar && window.skolappar.event) window.skolappar.event(namn, värde); } catch (e) { } }

  /* ---------------- Tillstånd ---------------- */
  var RUNDA = 5;
  var S = {
    skärm: "start", runda: 1, stjärnor: 0, antalKlar: 0, svarRätt: 0,
    uppg: [], idx: 0, val: { l: [], r: [] }, kontroller: 0, tips: 0
  };

  function väljUppgifter(runda) {
    var pool = REAKTIONER.filter(function (e) { return e.niva === (runda <= 2 ? 1 : 2); });
    if (runda === 3) pool = REAKTIONER.filter(function (e) { return e.niva <= 2; });
    pool = pool.slice();
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    return pool.slice(0, RUNDA);
  }

  function nollställ(u) {
    S.val = {
      l: u.l.map(function () { return 1; }),
      r: u.r.map(function () { return 1; })
    };
    S.kontroller = 0; S.tips = 0;
  }

  function aktuell() { return S.uppg[S.idx]; }

  /* ---------------- Rendering ---------------- */
  var elReaktion = document.getElementById("reaktion");
  var elRäkning = document.getElementById("rakning");
  var elFraga = document.getElementById("fraga");
  var elKottenText = document.getElementById("kottentext");

  function formelHtml(f) {
    return f.replace(/([A-Z][a-z]?|[()])(\d*)/g, function (m, a, d) {
      return a + (d ? "<sub>" + d + "</sub>" : "");
    });
  }
  function amneHtml(a, i, sida) {
    var val = S.val[sida][i];
    return '<div class="amne ny" data-sida="' + sida + '" data-i="' + i + '">' +
      '<div class="steg">' +
      '<button data-riktning="-1" aria-label="Minska talet framför ' + a.f + '">−</button>' +
      '<span class="varde' + (val === 1 ? " ett" : "") + '">' + val + '</span>' +
      '<button data-riktning="1" aria-label="Öka talet framför ' + a.f + '">+</button>' +
      '</div>' +
      '<div class="formel">' + formelHtml(a.f) + '</div>' +
      '</div>';
  }

  function rita() {
    var u = aktuell();
    if (!u) return;
    var html = "";
    u.l.forEach(function (a, i) { html += amneHtml(a, i, "l"); if (i < u.l.length - 1) html += '<span class="plus" aria-hidden="true">+</span>'; });
    html += '<span class="pil" aria-hidden="true">→</span>';
    u.r.forEach(function (a, i) { html += amneHtml(a, i, "r"); if (i < u.r.length - 1) html += '<span class="plus" aria-hidden="true">+</span>'; });
    elReaktion.innerHTML = html;

    var vl = sida(u.l, S.val.l), vr = sida(u.r, S.val.r);
    var nycklar = bokstavsordning(Object.assign({}, vl, vr));
    var allaLika = nycklar.every(function (k) { return (vl[k] || 0) === (vr[k] || 0); });
    elRäkning.innerHTML = nycklar.map(function (k) {
      var v = vl[k] || 0, h = vr[k] || 0, lika = v === h;
      return '<div class="rakning-rad"><span class="el">' + k + '</span>' +
        '<span class="tal ' + (lika ? "ok" : "nej") + '">' + v + '</span>' +
        '<span class="tal ' + (lika ? "ok" : "nej") + '">' + h + (lika ? '<span class="bock" aria-label="lika">✓</span>' : '') + '</span></div>';
    }).join("");

    document.querySelectorAll(".amne").forEach(function (n) { n.classList.remove("ny"); });

    // Kotten pekar på nästa steg: en våg som inte stämmer får en mjuk puls.
    var förstFel = nycklar.filter(function (k) { return (vl[k] || 0) !== (vr[k] || 0); })[0];
    if (!allaLika && förstFel) {
      elRäkning.querySelectorAll(".rakning-rad").forEach(function (r) {
        if (r.querySelector(".el").textContent === förstFel) {
          r.querySelectorAll(".tal.nej").forEach(function (t) { t.classList.add("pulsera"); });
        }
      });
    }
    return allaLika;
  }

  function ärBalanserad() {
    var u = aktuell();
    var vl = sida(u.l, S.val.l), vr = sida(u.r, S.val.r);
    var nycklar = bokstavsordning(Object.assign({}, vl, vr));
    return nycklar.every(function (k) { return (vl[k] || 0) === (vr[k] || 0); });
  }

  /* ---------------- Spelflöde ---------------- */
  function ändra(sida, i, d) {
    var v = S.val[sida][i] + d;
    if (v > 9) v = 1; if (v < 1) v = 9;
    S.val[sida][i] = v;
    ljud(d > 0 ? 520 : 420, 0.08, "triangle");
    var bal = rita();
    if (bal) klaraUppgiften();
  }

  function klaraUppgiften() {
    var u = aktuell();
    var alla = S.val.l.concat(S.val.r);
    var g = gcdAll(alla);
    var enklast = g > 1;
    S.antalKlar++; S.svarRätt++; S.stjärnor += 1;
    ritaStjärnor(); ljud(660, 0.12, "sine");
    setTimeout(function () { ljud(880, 0.18, "sine"); }, 130);
    säg(enklast ? "Balanserat! Kan du göra den ännu enklare?" : "Balanserat! Snyggt.");
    spår("round_done", Math.round(100 * S.antalKlar / RUNDA));
    var text = enklast
      ? "Massan stämmer! Men alla tal kan delas med " + g + " – den enklaste formen är ännu snyggare."
      : "Massan stämmer: lika många atomer av varje slag på båda sidor.";
    visaOverlay("firar", "Balanserat!", text + " " + balanseradText(), S.idx < S.uppg.length - 1 ? "Nästa reaktion →" : "Se resultatet →", function () {
      if (S.idx < S.uppg.length - 1) { S.idx++; nollställ(aktuell()); rita(); nästaLedtråd(); }
      else rundaKlar();
    });
  }

  function balanseradText() {
    var u = aktuell();
    function s(amnen, val) {
      return amnen.map(function (a, i) { return (val[i] > 1 ? val[i] : "") + formelText(a.f); }).join(" + ");
    }
    return s(u.l, S.val.l) + " → " + s(u.r, S.val.r);
  }
  function formelText(f) { return f.replace(/([0-9]+)/g, function (d) { return "₀₁₂₃₄₅₆₇₈₉"[Number(d)] || d; }); }

  function nästaLedtråd() {
    var u = aktuell();
    elFraga.className = "fraga";
    elFraga.textContent = "Räkna atomerna på båda sidor om pilen.";
    if (S.tips === 0) {
      elKottenText.textContent = "Börja med att sätta ettan framför alla ämnen och räkna.";
    }
  }

  function kontrollera() {
    if (S.skärm !== "spel") return;
    S.kontroller++;
    if (ärBalanserad()) { klaraUppgiften(); return; }
    var u = aktuell();
    var vl = sida(u.l, S.val.l), vr = sida(u.r, S.val.r);
    var nycklar = bokstavsordning(Object.assign({}, vl, vr));
    var sämst = null, störst = 0;
    nycklar.forEach(function (k) {
      var d = Math.abs((vl[k] || 0) - (vr[k] || 0));
      if (d > störst) { störst = d; sämst = k; }
    });
    elFraga.className = "fraga nej";
    elFraga.textContent = "Inte riktigt än.";
    elKottenText.textContent = "Titta på " + sämst + ": " + (vl[sämst] || 0) + " till vänster och " +
      (vr[sämst] || 0) + " till höger. Ändra ett tal och räkna igen.";
    ljud(220, 0.16, "triangle");
    spår("hint");
    kottenByt("funderar");
  }

  function rundaKlar() {
    S.skärm = "överlägg";
    var procent = Math.round(100 * S.antalKlar / (RUNDA * S.runda));
    spår("round_done", procent);
    säg("Rundan är klar. " + S.antalKlar + " av " + RUNDA + " balanserade.");
    visaOverlay(S.antalKlar >= RUNDA ? "firar" : "hejar",
      "Rundan är klar!",
      S.antalKlar + " av " + RUNDA + " reaktioner balanserade. " + S.stjärnor + " stjärnor totalt.",
      "En runda till →", function () { S.runda++; startaRunda(S.runda); }, true);
  }

  function visaOverlay(uttryck, titel, text, knapptext, vidare, medTyst) {
    var ov = document.getElementById("overlay");
    document.getElementById("ov-bild").innerHTML = kottenSvg(uttryck, "ov-kotten");
    document.getElementById("ov-titel").textContent = titel;
    document.getElementById("ov-text").textContent = text;
    var b = document.getElementById("ov-nasta");
    b.textContent = knapptext;
    b.onclick = function () { ov.hidden = true; vidare(); };
    ov.hidden = false;
    document.querySelectorAll(".ov-knappar .knapp.tyst").forEach(function (n) { n.remove(); });
    if (medTyst) {
      var t = document.createElement("button");
      t.className = "knapp tyst"; t.textContent = "Byt nivå";
      t.onclick = function () { ov.hidden = true; S.runda = S.runda <= 2 ? 3 : 1; startaRunda(S.runda); };
      document.querySelector(".ov-knappar").appendChild(t);
    }
  }

  function ritaStjärnor() {
    document.getElementById("stjarnor").textContent = "★".repeat(Math.min(S.stjärnor, 12)) + (S.stjärnor > 12 ? " +" : "");
  }

  function startaRunda(runda) {
    S.runda = runda; S.skärm = "spel"; S.antalKlar = 0; S.idx = 0;
    S.uppg = väljUppgifter(runda);
    nollställ(aktuell());
    document.getElementById("startskarm").hidden = true;
    document.getElementById("spel").hidden = false;
    document.getElementById("overlay").hidden = true;
    document.getElementById("rundtext").textContent = "Runda " + runda + " av 5";
    ritaStjärnor(); rita(); nästaLedtråd();
    kottenByt("glad");
    spår("round_start");
    spår("level", runda <= 2 ? 1 : 2);
    säg(runda <= 2 ? "Sätt tal framför ämnena så att atomerna stämmer." : "Nu blir det svårare. Räkna noga.");
  }

  function kottenByt(uttryck) {
    var gammal = document.getElementById("kotten");
    if (!gammal) return;
    var ny = document.createElement("span");
    ny.innerHTML = kottenSvg(uttryck);
    var svg = ny.firstChild;
    gammal.replaceWith(svg);
  }

  /* ---------------- Händelser ---------------- */
  function bind() {
    elReaktion.addEventListener("click", function (e) {
      var knapp = e.target.closest("button");
      if (!knapp) return;
      var amne = knapp.closest(".amne");
      if (!amne) return;
      ändra(amne.dataset.sida, Number(amne.dataset.i), Number(knapp.dataset.riktning));
    });
    document.getElementById("kolla").addEventListener("click", kontrollera);
    document.getElementById("spela").addEventListener("click", function () { ljud(600, 0.1); startaRunda(1); });
    document.getElementById("hjalp").addEventListener("click", function () {
      if (S.skärm !== "spel") return;
      S.tips++;
      var u = aktuell();
      var vl = sida(u.l, S.val.l), vr = sida(u.r, S.val.r);
      var nycklar = bokstavsordning(Object.assign({}, vl, vr));
      var rader = nycklar.map(function (k) { return k + ": " + (vl[k] || 0) + " mot " + (vr[k] || 0); }).join(", ");
      elKottenText.textContent = "Räkna så här: " + rader + ". Alla tal ska vara lika på båda sidor.";
      spår("hint"); kottenByt("tanker");
    });
    document.getElementById("ljud").addEventListener("click", function () {
      ljudPa = !ljudPa;
      if (!ljudPa && window.__rostStopp) window.__rostStopp();
      ritaLjudIkon();
      spår("sound_off");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var d = e.key === "ArrowRight" ? 1 : -1;
        ändra(d > 0 ? "r" : "l", 0, d);
      }
    });
  }

  function ritaLjudIkon() {
    document.getElementById("ljudikon").innerHTML = ljudPa
      ? '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 8a5 5 0 0 1 0 8"/>'
      : '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 9l5 6M20 9l-5 6"/>';
  }

  /* ---------------- Start ---------------- */
  function init() {
    bind(); ritaLjudIkon(); ritaStjärnor();
    kottenIkonFyll(document.querySelector(".kotten-hud"), "glad", "kotten-hud");
    kottenIkonFyll(document.getElementById("kotten"), "glad", "kotten-svg");
    window.__game = {
      S: S, REAKTIONER: REAKTIONER, atomer: atomer,
      startaRunda: startaRunda, ändra: ändra, kontrollera: kontrollera,
      ärBalanserad: ärBalanserad, sida: sida, rita: rita
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
