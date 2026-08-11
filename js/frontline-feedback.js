(function () {
  const DATA = FRONTLINE_FEEDBACK;
  const themes = DATA.themes;

  function delta(t) { return +(t.wave2Score - t.wave1Score).toFixed(1); }
  function fmtScore(v) { return v.toFixed(1) + "/5"; }
  function fmtDelta(d) { return (d >= 0 ? "+" : "") + d.toFixed(1); }

  function renderStats() {
    const avgW1 = themes.reduce((s, t) => s + t.wave1Score, 0) / themes.length;
    const avgW2 = themes.reduce((s, t) => s + t.wave2Score, 0) / themes.length;
    const sorted = [...themes].sort((a, b) => delta(b) - delta(a));
    const mostImproved = sorted[0];
    const mostDeclined = sorted[sorted.length - 1];
    const stats = [
      { value: DATA.meta.wave1N, label: DATA.meta.wave1Label + " check-in" },
      { value: DATA.meta.wave2N, label: DATA.meta.wave2Label },
      { value: fmtScore(avgW1) + " → " + fmtScore(avgW2), label: "Overall mood, then and now" },
      { value: mostImproved.label, label: "Got better most (" + fmtDelta(delta(mostImproved)) + ")" },
      { value: mostDeclined.label, label: "Got worse most (" + fmtDelta(delta(mostDeclined)) + ")" },
    ];
    document.getElementById("ff-stats").innerHTML = stats
      .map((s) => `<div class="stat-tile"><div class="value" style="font-size:18px;">${s.value}</div><div class="label">${s.label}</div></div>`)
      .join("");
  }

  function addMessage(sender, html, cls) {
    const win = document.getElementById("ff-chat-window");
    const div = document.createElement("div");
    div.className = "msg " + cls;
    div.innerHTML = `<div class="msg-sender">${sender}</div><div class="msg-bubble">${html}</div>`;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
  }

  function themeByKeyword(q) {
    if (/tool|system/.test(q)) return themes.find((t) => t.key === "tooling");
    if (/workload|pace|burnout|volume/.test(q)) return themes.find((t) => t.key === "workload");
    if (/train|onboard/.test(q)) return themes.find((t) => t.key === "training");
    if (/heard|feedback|listen|trust|loop/.test(q)) return themes.find((t) => t.key === "heard");
    if (/recogni/.test(q)) return themes.find((t) => t.key === "recognition");
    if (/career|growth|promotion/.test(q)) return themes.find((t) => t.key === "growth");
    return null;
  }

  function describeTheme(t, focusWave) {
    const quote = focusWave === 1 ? t.wave1Quotes[0] : t.wave2Quotes[0];
    return `<strong>${t.label}</strong>: ${fmtScore(t.wave1Score)} → ${fmtScore(t.wave2Score)} (${fmtDelta(delta(t))}).<br>"${quote}"`;
  }

  function answerQuestion(raw) {
    const q = raw.toLowerCase();

    if (/frustrat|most|biggest (problem|complaint|issue)|worst/.test(q)) {
      const lowest = [...themes].sort((a, b) => a.wave2Score - b.wave2Score)[0];
      return `Right now, <strong>${lowest.label}</strong> scores the lowest, at ${fmtScore(lowest.wave2Score)}.<br>"${lowest.wave2Quotes[0]}"`;
    }
    if (/surpris|swing|unexpected|biggest change/.test(q)) {
      const biggestSwing = [...themes].sort((a, b) => Math.abs(delta(b)) - Math.abs(delta(a)))[0];
      return `The biggest swing between check-ins is <strong>${biggestSwing.label}</strong>, moving ${fmtDelta(delta(biggestSwing))} points (${fmtScore(biggestSwing.wave1Score)} → ${fmtScore(biggestSwing.wave2Score)}).<br>First check-in: "${biggestSwing.wave1Quotes[0]}"<br>Second check-in: "${biggestSwing.wave2Quotes[0]}"`;
    }
    if (/change|improve|trend|delta|since|compare/.test(q)) {
      const sorted = [...themes].sort((a, b) => delta(b) - delta(a));
      return `Here's how every theme moved between the two check-ins:<ul>${sorted
        .map((t) => `<li>${t.label}: ${fmtScore(t.wave1Score)} → ${fmtScore(t.wave2Score)} (${fmtDelta(delta(t))})</li>`)
        .join("")}</ul>`;
    }

    const themeMatch = themeByKeyword(q);
    if (themeMatch) {
      return `${describeTheme(themeMatch, 2)}<br><span style="color:var(--text-muted);font-size:12px;">First check-in: "${themeMatch.wave1Quotes[0]}"</span>`;
    }

    const avgW1 = themes.reduce((s, t) => s + t.wave1Score, 0) / themes.length;
    const avgW2 = themes.reduce((s, t) => s + t.wave2Score, 0) / themes.length;
    return `Across ${DATA.meta.wave2N} people in the follow-up, the overall mood moved from ${fmtScore(avgW1)} to ${fmtScore(avgW2)}.
      Try asking what's frustrating people most, how things have changed, or about a specific theme like tools, workload, training, recognition, or career growth.`;
  }

  function handleSend(text) {
    if (!text.trim()) return;
    addMessage("You", text, "user");
    const answer = answerQuestion(text);
    setTimeout(() => addMessage("Frontline Voices", answer, "bot"), 150);
    document.getElementById("ff-input").value = "";
  }

  function wireChat() {
    const suggestions = [
      "What's frustrating the team most right now?",
      "How has this changed since the last check-in?",
      "Do people feel like their feedback is actually heard?",
      "What's the most surprising shift in the data?",
    ];
    document.getElementById("ff-suggestions").innerHTML = suggestions.map((s) => `<button data-q="${s}">${s}</button>`).join("");
    document.querySelectorAll("#ff-suggestions button").forEach((btn) => {
      btn.addEventListener("click", () => handleSend(btn.dataset.q));
    });
    document.getElementById("ff-send").addEventListener("click", () => handleSend(document.getElementById("ff-input").value));
    document.getElementById("ff-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend(e.target.value);
    });

    addMessage(
      "Frontline Voices",
      `Hi! I'm a simple tool built on ${DATA.meta.wave1N + DATA.meta.wave2N} made-up survey responses from two check-ins. Ask me what's working, what's not, or what's changed.`,
      "bot"
    );
  }

  renderStats();
  wireChat();
})();