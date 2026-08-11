(function () {
  const DATA = QUEUE_HEALTH;
  const weeks = DATA.weeks;

  const METRICS = [
    { key: "slaPct", label: "On-Time Rate", fmt: (v) => v.toFixed(1) + "%", target: DATA.slaTarget, goalNote: "Goal: on-time rate of " + DATA.slaTarget + "% or higher" },
    { key: "volume", label: "Volume", fmt: (v) => Math.round(v).toLocaleString("en-US"), target: null, goalNote: "How many cases came in that week" },
    { key: "ahtMin", label: "Time to Resolve", fmt: (v) => v.toFixed(1) + " min", target: null, goalNote: "Average minutes to resolve one case" },
    { key: "qualityPct", label: "Quality", fmt: (v) => v.toFixed(1) + "%", target: null, goalNote: "Share of cases that passed a quality review" },
    { key: "backlogMult", label: "Backlog Pressure", fmt: (v) => v.toFixed(2) + "x", target: 1.2, goalNote: "1.0x means the team is keeping up. Above 1.2x means work is piling up faster than it's getting done." },
  ];

  const state = { queueIdx: 0, metricKey: "slaPct" };

  function current(q) { return q.series[q.series.length - 1]; }
  function previous(q) { return q.series[q.series.length - 2]; }

  function slaStatus(sla) {
    if (sla >= DATA.slaTarget) return { cls: "good", label: "On track" };
    if (sla >= DATA.slaTarget - 10) return { cls: "warning", label: "Slipping" };
    return { cls: "critical", label: "Behind" };
  }

  function renderStats() {
    const currents = DATA.queues.map((q) => current(q));
    const belowTarget = currents.filter((c) => c.slaPct < DATA.slaTarget).length;
    const avgSla = currents.reduce((s, c) => s + c.slaPct, 0) / currents.length;
    const totalVolume = currents.reduce((s, c) => s + c.volume, 0);
    const risingBacklog = DATA.queues.filter((q) => {
      const first = q.series[0].backlogMult;
      const last = current(q).backlogMult;
      return last - first > 0.1;
    }).length;

    const stats = [
      { value: DATA.queues.length, label: "Teams in one view" },
      { value: avgSla.toFixed(1) + "%", label: "Average on-time rate this week (goal: " + DATA.slaTarget + "%)" },
      { value: belowTarget, label: "Teams missing their on-time goal" },
      { value: totalVolume.toLocaleString("en-US"), label: "Total cases handled this week" },
      { value: risingBacklog, label: "Teams with a growing backlog" },
    ];
    document.getElementById("qh-stats").innerHTML = stats
      .map((s) => `<div class="stat-tile"><div class="value">${s.value}</div><div class="label">${s.label}</div></div>`)
      .join("");
  }

  function renderCards() {
    document.getElementById("qh-cards").innerHTML = DATA.queues
      .map((q, i) => {
        const cur = current(q);
        const prev = previous(q);
        const delta = cur.slaPct - prev.slaPct;
        const trendCls = delta >= 0 ? "up" : "down";
        const trendArrow = delta >= 0 ? "▲" : "▼";
        const status = slaStatus(cur.slaPct);
        return `
        <div class="qh-card ${i === state.queueIdx ? "selected" : ""}" data-idx="${i}">
          <div class="qh-name">${q.name}</div>
          <div class="qh-sla-row">
            <span class="qh-sla-value">${cur.slaPct.toFixed(1)}%</span>
            <span class="qh-trend ${trendCls}">${trendArrow} ${Math.abs(delta).toFixed(1)}pt</span>
          </div>
          <span class="qh-status-pill ${status.cls}"><span class="dot"></span>${status.label}</span>
          <div class="qh-sub-metrics">
            ${cur.volume.toLocaleString("en-US")} cases · ${cur.ahtMin.toFixed(1)} min to resolve · ${cur.backlogMult.toFixed(2)}x backlog
          </div>
        </div>`;
      })
      .join("");

    document.querySelectorAll(".qh-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.queueIdx = parseInt(card.dataset.idx, 10);
        renderCards();
        renderDetail();
      });
    });
  }

  function renderMetricTabs() {
    document.getElementById("qh-metric-tabs").innerHTML = METRICS.map(
      (m) => `<button data-key="${m.key}" class="${m.key === state.metricKey ? "active" : ""}">${m.label}</button>`
    ).join("");
    document.querySelectorAll("#qh-metric-tabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.metricKey = btn.dataset.key;
        renderMetricTabs();
        renderDetail();
      });
    });
  }

  function buildChartSvg(series, metric) {
    const W = 640, H = 240;
    const padL = 46, padR = 20, padT = 20, padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const values = series.map((s) => s[metric.key]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (metric.target != null) { min = Math.min(min, metric.target); max = Math.max(max, metric.target); }
    const pad = (max - min) * 0.2 || 1;
    min -= pad; max += pad;

    const xAt = (i) => padL + (i / (series.length - 1)) * plotW;
    const yAt = (v) => padT + (1 - (v - min) / (max - min)) * plotH;

    const points = series.map((s, i) => ({ x: xAt(i), y: yAt(s[metric.key]), v: s[metric.key], week: s.week }));
    const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");

    let targetLine = "";
    if (metric.target != null) {
      const ty = yAt(metric.target);
      targetLine = `<line x1="${padL}" y1="${ty.toFixed(1)}" x2="${padL + plotW}" y2="${ty.toFixed(1)}" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="5 5" />`;
    }

    const gridlines = [0, 0.5, 1]
      .map((f) => {
        const y = padT + f * plotH;
        return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${padL + plotW}" y2="${y.toFixed(1)}" stroke="var(--gridline)" stroke-width="1" />`;
      })
      .join("");

    const yLabels = `
      <text x="${padL - 8}" y="${(padT + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--text-muted)">${metric.fmt(max - pad)}</text>
      <text x="${padL - 8}" y="${(padT + plotH + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--text-muted)">${metric.fmt(min + pad)}</text>`;

    const xLabels = points
      .map((p) => `<text x="${p.x.toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-muted)">${p.week}</text>`)
      .join("");

    const dots = points
      .map((p, i) => {
        const isLast = i === points.length - 1;
        const r = isLast ? 5.5 : 4;
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" fill="var(--primary)" stroke="var(--surface)" stroke-width="${isLast ? 2 : 1.5}" />`;
      })
      .join("");

    const svg = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;" id="qh-svg">
        ${gridlines}
        ${targetLine}
        <path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" />
        ${dots}
        ${yLabels}
        ${xLabels}
      </svg>`;

    return { svg, points };
  }

  function relatedProblems(queueName) {
    return PROBLEM_LIBRARY.clusters.filter((c) => c.domains.includes(queueName));
  }

  function renderSignals(q) {
    const related = relatedProblems(q.name);
    const knownIssue = related
      .filter((c) => !c.shipped)
      .sort((a, b) => (a.severity === b.severity ? b.count - a.count : a.severity < b.severity ? -1 : 1))[0];
    const opportunity = related.filter((c) => c.quickWin && c.shipped).sort((a, b) => b.count - a.count)[0];

    const rows = [];
    if (q.launch) {
      rows.push({ type: "launch", icon: "🚀", title: q.launch.title, meta: "Launched " + q.launch.week });
    }
    if (q.incident) {
      rows.push({ type: "incident", icon: "⚠️", title: q.incident.title, meta: "Happened " + q.incident.week });
    }
    if (knownIssue) {
      rows.push({
        type: "issue",
        icon: "🔎",
        title: knownIssue.title,
        meta: `Reported ${knownIssue.count} times, still open, see it in the Problem Library`,
      });
    }
    if (opportunity) {
      rows.push({
        type: "opportunity",
        icon: "✅",
        title: opportunity.title,
        meta: opportunity.impact ? "Already fixed: " + opportunity.impact : "Already fixed",
      });
    }

    document.getElementById("qh-signals-list").innerHTML = rows
      .map(
        (r) => `
      <div class="qh-signal-row">
        <div class="qh-signal-icon ${r.type}">${r.icon}</div>
        <div>
          <div class="qh-signal-type">${r.type === "issue" ? "Known issue" : r.type === "opportunity" ? "Opportunity, from the feedback loop" : r.type}</div>
          <div class="qh-signal-title">${r.title}</div>
          <div class="qh-signal-meta">${r.meta}</div>
        </div>
      </div>`
      )
      .join("");
  }

  function renderDetail() {
    const q = DATA.queues[state.queueIdx];
    const metric = METRICS.find((m) => m.key === state.metricKey);
    document.getElementById("qh-detail-title").textContent = `${q.name}: 8-week trend`;
    document.getElementById("qh-goal-note").textContent = metric.goalNote;

    const { svg, points } = buildChartSvg(q.series, metric);
    const wrap = document.getElementById("qh-chart-wrap");
    wrap.innerHTML = svg + `<div class="qh-tooltip" id="qh-tooltip"></div>`;

    const svgEl = document.getElementById("qh-svg");
    const tooltip = document.getElementById("qh-tooltip");

    svgEl.addEventListener("mousemove", (e) => {
      const rect = svgEl.getBoundingClientRect();
      const scaleX = 640 / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      let nearest = 0;
      let best = Infinity;
      points.forEach((p, i) => {
        const d = Math.abs(p.x - mouseX);
        if (d < best) { best = d; nearest = i; }
      });
      const p = points[nearest];
      const px = (p.x / 640) * rect.width;
      const py = (p.y / 240) * rect.height;
      tooltip.style.left = px + "px";
      tooltip.style.top = py + "px";
      tooltip.style.opacity = "1";
      tooltip.textContent = `${p.week}: ${metric.fmt(p.v)}`;
    });
    svgEl.addEventListener("mouseleave", () => { tooltip.style.opacity = "0"; });

    document.getElementById("qh-legend-note").textContent = "Hover the chart to see the exact number for any week.";

    renderSignals(q);
  }

  renderStats();
  renderCards();
  renderMetricTabs();
  renderDetail();
})();