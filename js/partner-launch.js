(function () {
  const DATA = PARTNER_LAUNCH;
  const state = { profile: DATA.profiles[0].id };

  function renderStats() {
    document.getElementById("pt-stats").innerHTML = DATA.stats.map((s) => `
      <div class="stat-tile"><div class="value">${s.value}</div><div class="label">${s.label}</div></div>`).join("");
  }

  function renderProfileButtons() {
    document.getElementById("pt-profile-buttons").innerHTML = DATA.profiles.map((p) => `
      <button class="chip-toggle ${p.id === state.profile ? "active" : ""}" data-profile="${p.id}">${p.name}</button>`).join("");
    document.querySelectorAll("#pt-profile-buttons button").forEach((btn) => btn.addEventListener("click", () => {
      state.profile = btn.dataset.profile;
      renderProfileButtons();
      renderPlan();
    }));
  }

  function currentProfile() {
    return DATA.profiles.find((p) => p.id === state.profile);
  }

  function renderPlan() {
    const p = currentProfile();
    document.getElementById("pt-profile-subtitle").textContent = p.subtitle;

    const pillarOrder = [
      { key: "training", label: "Training" },
      { key: "support", label: "Support" },
      { key: "marketing", label: "Marketing Activation" },
      { key: "partnerMgmt", label: "Partner Management" },
    ];
    document.getElementById("pt-pillars").innerHTML = pillarOrder.map((po) => {
      const pillar = p.pillars[po.key];
      return `
        <div class="highlight-card">
          <div class="company-tag">${po.label}</div>
          <div class="h-title">${pillar.title}</div>
          <div class="detail">${pillar.detail}</div>
        </div>`;
    }).join("");

    const maxWeeks = Math.max(...DATA.profiles.map((pr) => pr.weeksToLaunch));
    const pct = Math.round((p.weeksToLaunch / maxWeeks) * 100);
    document.getElementById("pt-timeline-label").textContent = `${p.weeksToLaunch} weeks to launch`;
    document.getElementById("pt-timeline-track").innerHTML = `<div class="bar-fill" style="width:${pct}%; background: var(--secondary);"></div>`;
  }

  renderStats();
  renderProfileButtons();
  renderPlan();
})();
