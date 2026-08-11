(function () {
  const DATA = RECOGNITION;
  const state = { company: "all" };
  function renderSuperpowers() {
    document.getElementById("recognition-superpowers").innerHTML = DATA.superpowers.map((sp) => `
      <div class="superpower-card">
        <div class="sp-title">${sp.title}</div><div class="sp-desc">${sp.description}</div>
        <div class="sp-evidence">${sp.evidence.map((e) => `<span class="sp-tag">${e}</span>`).join("")}</div>
        <div class="sp-quote">"${sp.quote}"</div><div class="sp-quote-meta">${sp.quoteMeta}</div>
      </div>`).join("");
  }
  function matchesFilter(q) {
    if (state.company === "all") return q.featured === true;
    if (state.company === "other") return q.company !== "Google" && q.company !== "Airbnb";
    return q.company === state.company;
  }
  function renderQuotes() {
    document.getElementById("recognition-quotes").innerHTML = DATA.quotes.filter(matchesFilter).map((q) => `
      <div class="quote-card"><div class="quote-text">${q.text}</div><div class="quote-meta">
        <span class="quote-role-badge ${q.role}">${q.roleLabel}</span><span class="quote-year-badge">${q.company}${q.year ? " · " + q.year : ""}</span>
      </div></div>`).join("");
  }
  function renderHighlights() {
    document.getElementById("recognition-highlights").innerHTML = DATA.highlights.map((h) => `
      <div class="highlight-card"><div class="company-tag">${h.company}</div><div class="metric">${h.metric}</div>
      <div class="h-title">${h.title}</div><div class="detail">${h.detail}</div></div>`).join("");
  }
  function wireFilters() {
    document.querySelectorAll("#recognition-company-filter button").forEach((btn) => btn.addEventListener("click", () => {
      state.company = btn.dataset.company;
      document.querySelectorAll("#recognition-company-filter button").forEach((b) => b.classList.toggle("active", b === btn));
      renderQuotes();
    }));
  }
  renderSuperpowers(); renderQuotes(); renderHighlights(); wireFilters();
})();
