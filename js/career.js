(function () {
  const DATA = CAREER;
  function renderNarrative() { document.getElementById("career-narrative").innerHTML = DATA.narrative.map((p) => `<p>${p}</p>`).join(""); }
  function roleCard(r) { const quoteHtml=r.quote?`<div class="role-quote">"${r.quote}"</div>`:""; const noteHtml=r.note?`<div class="role-note">${r.note}</div>`:""; return `<div class="career-role-card"><div class="role-company">${r.company}</div><div class="role-title">${r.title}</div><div class="role-dates">${r.dates}</div><div class="role-scope">${r.scope}</div>${quoteHtml}${noteHtml}</div>`; }
  function renderChapters() { document.getElementById("career-chapters").innerHTML = DATA.chapters.map((c,i)=>`<div class="career-chapter"><div class="career-chapter-header ${c.color}"><span class="career-chapter-num">Chapter ${i+1} · ${c.years}</span><h3>${c.title}</h3><p class="career-theme">${c.theme}</p></div><div class="career-role-grid" style="grid-template-columns:repeat(${c.roles.length},1fr);">${c.roles.map(roleCard).join("")}</div></div>`).join(""); }
  renderNarrative(); renderChapters();
})();
