(function () {
  const DATA = CAPACITY_MODEL;
  const state = {
    headcount: DATA.defaults.headcount,
    hoursPerWeek: DATA.defaults.hoursPerWeek,
    demandGrowthPct: DATA.defaults.demandGrowthPct,
    allocations: {},
  };
  DATA.categories.forEach((c) => { state.allocations[c.key] = c.defaultAllocationPct; });

  const EXAMPLE_TASKS = [
    { name: "Log this week's metrics for leadership review", key: "cadence", hours: 2 },
    { name: "Prep the weekly performance recap deck", key: "cadence", hours: 4 },
    { name: "Clear the backlog of pending account reviews", key: "bau", hours: 6 },
    { name: "Update the case-review checklist for a new policy", key: "bau", hours: 3 },
    { name: "Draft the roadmap for a new fraud-detection pilot", key: "strategic", hours: 8 },
    { name: "Triage escalated account-lock complaints", key: "escalations", hours: 5 },
  ];

  function setupRangeInput(id, key, valId, fmt) {
    const range = DATA.ranges[key];
    const el = document.getElementById(id);
    el.min = range.min; el.max = range.max; el.step = range.step;
    el.value = state[key];
    document.getElementById(valId).textContent = fmt(state[key]);
    el.addEventListener("input", () => {
      state[key] = Number(el.value);
      document.getElementById(valId).textContent = fmt(state[key]);
      render();
    });
  }

  function renderAllocationSliders() {
    const container = document.getElementById("cm-allocation-sliders");
    container.innerHTML = DATA.categories
      .map(
        (c) => `
      <div class="cm-alloc-row">
        <label>${c.label} <span class="slider-val" id="cm-alloc-val-${c.key}">${state.allocations[c.key]}%</span></label>
        <input type="range" min="0" max="100" step="1" value="${state.allocations[c.key]}" id="cm-alloc-${c.key}" />
        <div class="cm-alloc-note">${c.note}</div>
      </div>`
      )
      .join("");

    DATA.categories.forEach((c) => {
      document.getElementById(`cm-alloc-${c.key}`).addEventListener("input", (e) => {
        state.allocations[c.key] = Number(e.target.value);
        document.getElementById(`cm-alloc-val-${c.key}`).textContent = state.allocations[c.key] + "%";
        render();
      });
    });
  }

  function compute() {
    const totalCapacityHrs = state.headcount * state.hoursPerWeek;
    const rows = DATA.categories.map((c) => {
      const requiredHrs = c.baseRequiredHrs * (1 + c.scalesWithDemand * (state.demandGrowthPct / 100));
      const allocPct = state.allocations[c.key];
      const allocatedHrs = totalCapacityHrs * (allocPct / 100);
      const gapHrs = allocatedHrs - requiredHrs;
      return { ...c, requiredHrs, allocPct, allocatedHrs, gapHrs };
    });
    const sumPct = DATA.categories.reduce((s, c) => s + state.allocations[c.key], 0);
    const totalRequiredHrs = rows.reduce((s, r) => s + r.requiredHrs, 0);
    return { totalCapacityHrs, rows, sumPct, totalRequiredHrs };
  }

  function renderStats(model) {
    const overallGap = (model.totalCapacityHrs * model.sumPct) / 100 - model.totalRequiredHrs;
    const stats = [
      { value: Math.round(model.totalCapacityHrs) + " hrs/wk", label: "Total hours the team has available" },
      { value: Math.round(model.totalRequiredHrs) + " hrs/wk", label: "Total hours actually needed" },
      { value: model.sumPct + "%", label: "Percent of time assigned" },
      {
        value: (overallGap >= 0 ? "+" : "") + Math.round(overallGap) + " hrs/wk",
        label: overallGap >= 0 ? "Extra time available right now" : "How far short the team is right now",
      },
    ];
    document.getElementById("cm-stats").innerHTML = stats
      .map((s) => `<div class="stat-tile"><div class="value">${s.value}</div><div class="label">${s.label}</div></div>`)
      .join("");
  }

  function renderAllocSum(model) {
    const el = document.getElementById("cm-alloc-sum");
    el.className = "cm-alloc-sum " + (model.sumPct > 100 ? "over" : "ok");
    if (model.sumPct > 100) {
      el.textContent = `You've assigned ${model.sumPct}% of the team's time. That's ${model.sumPct - 100} points more than the team actually has. Something will have to give.`;
    } else {
      el.textContent = `You've assigned ${model.sumPct}% of the team's time. That leaves ${100 - model.sumPct}% open.`;
    }
  }

  function renderCategoryList(model) {
    document.getElementById("cm-category-list").innerHTML = model.rows
      .map((r) => {
        const fillPct = Math.min(100, (r.allocatedHrs / model.totalCapacityHrs) * 100);
        const markerPct = Math.min(100, (r.requiredHrs / model.totalCapacityHrs) * 100);
        const isSurplus = r.gapHrs >= 0;
        const gapLabel = isSurplus
          ? `<span class="gap-label surplus">${r.gapHrs.toFixed(1)}h to spare</span>`
          : `<span class="gap-label shortfall">${Math.abs(r.gapHrs).toFixed(1)}h short</span>`;
        return `
        <div class="cm-cat-row">
          <div class="row-top">
            <div class="title">${r.label}</div>
            ${gapLabel}
          </div>
          <div class="cm-bar-legend">Assigned ${r.allocatedHrs.toFixed(1)} hrs/wk &nbsp;·&nbsp; Actually needs ${r.requiredHrs.toFixed(1)} hrs/wk</div>
          <div class="cm-bar-track">
            <div class="cm-bar-fill" style="width:${fillPct}%; background:${isSurplus ? "var(--status-good)" : "var(--status-critical)"};"></div>
            <div class="cm-bar-marker" style="left:${markerPct}%;" title="What's actually needed"></div>
          </div>
          <div class="cm-note">${r.note}</div>
        </div>`;
      })
      .join("");
  }

  function renderAsanaFeed() {
    const catByKey = {};
    DATA.categories.forEach((c) => { catByKey[c.key] = c; });
    document.getElementById("cm-asana-list").innerHTML = EXAMPLE_TASKS
      .map((t) => {
        const cat = catByKey[t.key];
        return `
        <div class="cm-task-row">
          <div class="cm-task-check"></div>
          <div class="cm-task-name">${t.name}</div>
          <span class="cm-task-tag ${cat.color}">${cat.label}</span>
          <span class="cm-task-hours">${t.hours} hrs</span>
        </div>`;
      })
      .join("");
  }

  function render() {
    const model = compute();
    renderStats(model);
    renderAllocSum(model);
    renderCategoryList(model);
  }

  setupRangeInput("cm-headcount", "headcount", "cm-headcount-val", (v) => v + " people");
  setupRangeInput("cm-hours", "hoursPerWeek", "cm-hours-val", (v) => v + " hrs");
  setupRangeInput("cm-demand", "demandGrowthPct", "cm-demand-val", (v) => (v >= 0 ? "+" : "") + v + "%");
  renderAllocationSliders();
  renderAsanaFeed();
  render();
})();