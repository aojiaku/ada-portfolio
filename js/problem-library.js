(function () {
  const DATA = PROBLEM_LIBRARY;
  const clusters = DATA.clusters;
  const maxCount = Math.max(...clusters.map((c) => c.count));

  const SEVERITY_LABEL = { P0: "Urgent", P1: "Important", P2: "Minor" };

  function fmt(n) { return n.toLocaleString("en-US"); }

  function severityBadge(sev) {
    const cls = sev === "P0" ? "badge-p0" : sev === "P1" ? "badge-p1" : "badge-p2";
    return `<span class="badge ${cls}">${SEVERITY_LABEL[sev]}</span>`;
  }

  function domainTags(domains) {
    return domains.map((d) => `<span class="domain-tag">${d}</span>`).join("");
  }

  function crossBadge(c) {
    return c.crossQueue ? `<span class="badge badge-cross">spans multiple teams</span>` : "";
  }

  function quickWinBadge(c) {
    return c.quickWin && c.shipped ? `<span class="badge badge-quickwin">already fixed</span>` : "";
  }

  function domainTotals() {
    const totals = {};
    DATA.domains.forEach((d) => (totals[d] = 0));
    clusters.forEach((c) => c.domains.forEach((d) => (totals[d] += c.count)));
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }

  function renderStats() {
    const m = DATA.meta;
    const avgReportsPerCluster = Math.round(m.totalSubmissions / m.totalClusters);
    const p0Share = Math.round((m.p0Count / m.totalClusters) * 100);
    const stats = [
      { value: fmt(m.totalSubmissions) + "+", label: `Reports reviewed, distilled into ${m.totalClusters} patterns` },
      { value: m.totalClusters, label: `Recurring problems, about ${avgReportsPerCluster} reports each on average` },
      { value: m.p0Count, label: `Most urgent problems, roughly ${p0Share}% of everything found` },
      { value: m.quickWinsShipped + " / " + m.quickWinsIdentified, label: "Fixes shipped, out of the ones we found" },
      { value: fmt(m.monthlyReworkHours) + "+ hrs/mo", label: "Time wasted on repeat work, every month" },
      { value: m.fraudExposureMonthly, label: "Money at risk each month if left unfixed" },
    ];
    document.getElementById("pl-stats").innerHTML = stats
      .map((s) => `<div class="stat-tile"><div class="value">${s.value}</div><div class="label">${s.label}</div></div>`)
      .join("");
  }

  function populateDomainFilter() {
    const sel = document.getElementById("pl-filter-domain");
    DATA.domains.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      sel.appendChild(opt);
    });
  }

  const state = { severity: "", domain: "", crossOnly: false, quickWinOnly: false };

  function applyFilters() {
    return clusters.filter((c) => {
      if (state.severity && c.severity !== state.severity) return false;
      if (state.domain && !c.domains.includes(state.domain)) return false;
      if (state.crossOnly && !c.crossQueue) return false;
      if (state.quickWinOnly && !(c.quickWin && c.shipped)) return false;
      return true;
    });
  }

  function renderClusterList() {
    const filtered = applyFilters().sort((a, b) => b.count - a.count);
    document.getElementById("pl-count-note").textContent = `Showing ${filtered.length} of ${clusters.length}`;
    document.getElementById("pl-cluster-list").innerHTML = filtered
      .map((c) => {
        const pct = Math.round((c.count / maxCount) * 100);
        const quoteHtml = c.quotes && c.quotes.length ? `<div class="quote">"${c.quotes[0]}"</div>` : "";
        const impactHtml = c.impact ? `<div class="impact-line">→ ${c.impact}</div>` : "";
        return `
        <div class="cluster-row" data-id="${c.id}">
          <div class="row-top">
            <div class="title">${c.title}</div>
            <div class="count">${c.count} reports</div>
          </div>
          <div class="row-meta">
            ${severityBadge(c.severity)}
            ${domainTags(c.domains)}
            ${crossBadge(c)}
            ${quickWinBadge(c)}
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:var(--primary);"></div></div>
          ${impactHtml}
          ${quoteHtml}
        </div>`;
      })
      .join("");

    document.querySelectorAll(".cluster-row").forEach((row) => {
      row.addEventListener("click", () => row.classList.toggle("expanded"));
    });
  }

  function wireFilters() {
    document.getElementById("pl-filter-severity").addEventListener("change", (e) => {
      state.severity = e.target.value;
      renderClusterList();
    });
    document.getElementById("pl-filter-domain").addEventListener("change", (e) => {
      state.domain = e.target.value;
      renderClusterList();
    });
    const crossBtn = document.getElementById("pl-filter-cross");
    crossBtn.addEventListener("click", () => {
      state.crossOnly = !state.crossOnly;
      crossBtn.classList.toggle("active", state.crossOnly);
      renderClusterList();
    });
    const qwBtn = document.getElementById("pl-filter-quickwin");
    qwBtn.addEventListener("click", () => {
      state.quickWinOnly = !state.quickWinOnly;
      qwBtn.classList.toggle("active", state.quickWinOnly);
      renderClusterList();
    });
  }

  function listItem(c, showImpact) {
    const impact = showImpact && c.impact ? `. <span style="color:var(--status-good);font-weight:600;">${c.impact}</span>` : "";
    return `<li><strong>${c.title}</strong> (${c.count} reports, ${SEVERITY_LABEL[c.severity]}, ${c.domains.join(" + ")})${impact}</li>`;
  }

  function answerMostReported() {
    const top = [...clusters].sort((a, b) => b.count - a.count).slice(0, 5);
    return `<p>Ranked by how often it came up, here's what people are flagging most:</p><ol>${top
      .map((c) => listItem(c, false))
      .join("")}</ol><p>Together these 5 problems account for ${fmt(top.reduce((s, c) => s + c.count, 0))} of the ${fmt(
      DATA.meta.totalSubmissions
    )}+ reports in the library.</p>`;
  }

  function answerCrossQueue() {
    const cross = clusters.filter((c) => c.crossQueue).sort((a, b) => b.count - a.count);
    return `<p>${cross.length} of the ${DATA.meta.totalClusters} problems show up on more than one team. That usually means no single team owns the fix, which is often why they've gone unaddressed:</p><ul>${cross
      .map((c) => listItem(c, false))
      .join("")}</ul>`;
  }

  function answerTopImpact() {
    const p0 = clusters.filter((c) => c.severity === "P0").sort((a, b) => b.count - a.count);
    return `<p>These ${p0.length} problems matter most right now. They're ranked on a mix of how often they're reported, how many teams they touch, and the cost of leaving them unfixed (wasted time or money at risk):</p><ol>${p0
      .map((c) => listItem(c, true))
      .join("")}</ol>`;
  }

  function answerQuickWins() {
    const shipped = clusters.filter((c) => c.quickWin && c.shipped).sort((a, b) => b.count - a.count);
    return `<p>${DATA.meta.quickWinsShipped} of ${DATA.meta.quickWinsIdentified} things we found have already been fixed:</p><ul>${shipped
      .map((c) => listItem(c, true))
      .join("")}</ul>`;
  }

  function answerFraud() {
    const fraud = clusters.filter((c) => c.impact && c.impact.includes("$"));
    if (!fraud.length) return `<p>Nothing in the library right now has a direct dollar risk attached to it.</p>`;
    return `<p>Here's the clearest financial risk in the library right now:</p><ul>${fraud.map((c) => listItem(c, true)).join("")}</ul>`;
  }

  function answerByDomain() {
    const totals = domainTotals();
    return `<p>Here's how many reports came from each team (a problem that spans teams counts toward each one):</p><ol>${totals
      .map(([d, n]) => `<li><strong>${d}</strong>: ${fmt(n)} reports</li>`)
      .join("")}</ol>`;
  }

  function answerSummary() {
    const m = DATA.meta;
    return `<p>The library holds ${fmt(m.totalSubmissions)}+ reports, organized into ${m.totalClusters} recurring
      problems. ${m.p0Count} of those are urgent. ${m.quickWinsShipped} fixes have already shipped out of
      ${m.quickWinsIdentified} we found, and altogether this surfaced ${fmt(m.monthlyReworkHours)}+ hours a month of
      wasted work, plus ${m.fraudExposureMonthly} in money at risk. Try one of the questions above, or ask about a
      specific team, problems that span teams, or fixes we've already shipped.</p>`;
  }

  function answerQuestion(raw) {
    const q = raw.toLowerCase();
    if (/quick.?win|shipped|launched|already fixed|fixed/.test(q)) return answerQuickWins();
    if (/cross|multiple team|across team|span|more than one/.test(q)) return answerCrossQueue();
    if (/fraud|exposure|money|risk/.test(q)) return answerFraud();
    if (/highest.?impact|top.?opportunit|priorit|matter most|urgent/.test(q)) return answerTopImpact();
    if (/team|which (queue|team)|by team/.test(q)) return answerByDomain();
    if (/most (frequent|report|common)|top.*(problem|submission)|volume|reporting/.test(q)) return answerMostReported();
    return answerSummary();
  }

  function runQuery(text) {
    const box = document.getElementById("pl-qa-answer");
    box.style.display = "block";
    box.innerHTML = `<div class="qa-question-echo">You asked: "${text}"</div>${answerQuestion(text)}`;
  }

  function wireQA() {
    const suggestions = [
      "What problems come up most often?",
      "Which problems show up on more than one team?",
      "Which problems matter most right now?",
      "What have we already fixed?",
    ];
    document.getElementById("pl-qa-suggestions").innerHTML = suggestions
      .map((s) => `<button data-q="${s}">${s}</button>`)
      .join("");
    document.querySelectorAll("#pl-qa-suggestions button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("pl-qa-input").value = btn.dataset.q;
        runQuery(btn.dataset.q);
      });
    });
    document.getElementById("pl-qa-submit").addEventListener("click", () => {
      const val = document.getElementById("pl-qa-input").value.trim();
      if (val) runQuery(val);
    });
    document.getElementById("pl-qa-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = e.target.value.trim();
        if (val) runQuery(val);
      }
    });
  }

  renderStats();
  populateDomainFilter();
  wireFilters();
  renderClusterList();
  wireQA();
})();
