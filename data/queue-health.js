const QUEUE_HEALTH = {
  weeks: ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7", "Wk8"],
  slaTarget: 80,
  queues: [
  {
    "name": "Identity Verification",
    "launch": { "title": "New verification flow launched", "week": "Wk3" },
    "incident": { "title": "Brief outage in document upload", "week": "Wk6" },
    "series": [
      { "week": "Wk1", "volume": 417, "slaPct": 79.4, "ahtMin": 11.5, "qualityPct": 92.3, "backlogMult": 1 },
      { "week": "Wk2", "volume": 413, "slaPct": 80.1, "ahtMin": 11.2, "qualityPct": 92.7, "backlogMult": 1.1 },
      { "week": "Wk3", "volume": 448, "slaPct": 80, "ahtMin": 11.4, "qualityPct": 91.6, "backlogMult": 1 },
      { "week": "Wk4", "volume": 442, "slaPct": 82, "ahtMin": 11.2, "qualityPct": 91, "backlogMult": 1.1 },
      { "week": "Wk5", "volume": 413, "slaPct": 84.3, "ahtMin": 11.1, "qualityPct": 91.1, "backlogMult": 1 },
      { "week": "Wk6", "volume": 424, "slaPct": 82.2, "ahtMin": 11.4, "qualityPct": 92.1, "backlogMult": 1 },
      { "week": "Wk7", "volume": 464, "slaPct": 83.7, "ahtMin": 11, "qualityPct": 92.6, "backlogMult": 1 },
      { "week": "Wk8", "volume": 424, "slaPct": 85.8, "ahtMin": 10.3, "qualityPct": 92.1, "backlogMult": 1.1 }
    ]
  },
  {
    "name": "Listing Compliance",
    "launch": { "title": "Auto-flagging for duplicate listings turned on", "week": "Wk4" },
    "incident": { "title": "Photo review queue lagged for two days", "week": "Wk7" },
    "series": [
      { "week": "Wk1", "volume": 265, "slaPct": 78.7, "ahtMin": 13.6, "qualityPct": 88.6, "backlogMult": 1.4 },
      { "week": "Wk2", "volume": 263, "slaPct": 81.5, "ahtMin": 13.7, "qualityPct": 88.6, "backlogMult": 1.2 },
      { "week": "Wk3", "volume": 270, "slaPct": 77.3, "ahtMin": 14.6, "qualityPct": 89.4, "backlogMult": 1.4 },
      { "week": "Wk4", "volume": 282, "slaPct": 77, "ahtMin": 14.3, "qualityPct": 89.9, "backlogMult": 1.2 },
      { "week": "Wk5", "volume": 255, "slaPct": 76.9, "ahtMin": 14.4, "qualityPct": 89, "backlogMult": 1.3 },
      { "week": "Wk6", "volume": 259, "slaPct": 80.5, "ahtMin": 15.1, "qualityPct": 89.9, "backlogMult": 1.2 },
      { "week": "Wk7", "volume": 265, "slaPct": 79.2, "ahtMin": 14.9, "qualityPct": 89.6, "backlogMult": 1.2 },
      { "week": "Wk8", "volume": 280, "slaPct": 80.4, "ahtMin": 15.7, "qualityPct": 88.9, "backlogMult": 1.3 }
    ]
  },
  {
    "name": "Payments & Risk",
    "launch": { "title": "New refund rules rolled out", "week": "Wk2" },
    "incident": { "title": "Currency conversion bug caused a spike in manual reviews", "week": "Wk5" },
    "series": [
      { "week": "Wk1", "volume": 192, "slaPct": 81.3, "ahtMin": 17.7, "qualityPct": 90.5, "backlogMult": 1.1 },
      { "week": "Wk2", "volume": 200, "slaPct": 80.1, "ahtMin": 18.4, "qualityPct": 91, "backlogMult": 1.4 },
      { "week": "Wk3", "volume": 195, "slaPct": 78.3, "ahtMin": 18, "qualityPct": 89.2, "backlogMult": 1.4 },
      { "week": "Wk4", "volume": 202, "slaPct": 76.2, "ahtMin": 19.1, "qualityPct": 89.2, "backlogMult": 1.3 },
      { "week": "Wk5", "volume": 189, "slaPct": 76.5, "ahtMin": 19.3, "qualityPct": 89.4, "backlogMult": 1.5 },
      { "week": "Wk6", "volume": 193, "slaPct": 74.3, "ahtMin": 18.6, "qualityPct": 89.3, "backlogMult": 1.5 },
      { "week": "Wk7", "volume": 194, "slaPct": 71.1, "ahtMin": 19.1, "qualityPct": 90.8, "backlogMult": 1.4 },
      { "week": "Wk8", "volume": 201, "slaPct": 71.3, "ahtMin": 18.5, "qualityPct": 90.7, "backlogMult": 1.5 }
    ]
  },
  {
    "name": "Account Security",
    "launch": { "title": "Two-factor prompt redesign shipped", "week": "Wk1" },
    "incident": { "title": "Short delay in account-lock alerts", "week": "Wk4" },
    "series": [
      { "week": "Wk1", "volume": 237, "slaPct": 84.5, "ahtMin": 9.2, "qualityPct": 94.8, "backlogMult": 1.1 },
      { "week": "Wk2", "volume": 235, "slaPct": 85.4, "ahtMin": 9, "qualityPct": 93.4, "backlogMult": 0.9 },
      { "week": "Wk3", "volume": 240, "slaPct": 87.2, "ahtMin": 8.7, "qualityPct": 93.6, "backlogMult": 1 },
      { "week": "Wk4", "volume": 229, "slaPct": 85.5, "ahtMin": 9.7, "qualityPct": 94.1, "backlogMult": 1.1 },
      { "week": "Wk5", "volume": 230, "slaPct": 86.2, "ahtMin": 9.1, "qualityPct": 93.6, "backlogMult": 1 },
      { "week": "Wk6", "volume": 239, "slaPct": 87.3, "ahtMin": 9.3, "qualityPct": 93.8, "backlogMult": 1 },
      { "week": "Wk7", "volume": 239, "slaPct": 89, "ahtMin": 9, "qualityPct": 94.2, "backlogMult": 1 },
      { "week": "Wk8", "volume": 238, "slaPct": 88.4, "ahtMin": 8.7, "qualityPct": 93.6, "backlogMult": 0.9 }
    ]
  },
  {
    "name": "Dispute Resolution",
    "launch": { "title": "New evidence upload tool launched", "week": "Wk5" },
    "incident": { "title": "Chat-to-case handoff broke for a few hours", "week": "Wk6" },
    "series": [
      { "week": "Wk1", "volume": 290, "slaPct": 81.7, "ahtMin": 15.5, "qualityPct": 88.4, "backlogMult": 1.3 },
      { "week": "Wk2", "volume": 296, "slaPct": 79.3, "ahtMin": 15.5, "qualityPct": 88.2, "backlogMult": 1.3 },
      { "week": "Wk3", "volume": 302, "slaPct": 80.5, "ahtMin": 16.6, "qualityPct": 88.8, "backlogMult": 1.5 },
      { "week": "Wk4", "volume": 296, "slaPct": 80.2, "ahtMin": 17, "qualityPct": 88.1, "backlogMult": 1.5 },
      { "week": "Wk5", "volume": 310, "slaPct": 81.8, "ahtMin": 16.1, "qualityPct": 88.2, "backlogMult": 1.5 },
      { "week": "Wk6", "volume": 311, "slaPct": 78.8, "ahtMin": 16.8, "qualityPct": 89, "backlogMult": 1.4 },
      { "week": "Wk7", "volume": 331, "slaPct": 81.2, "ahtMin": 17.3, "qualityPct": 87.1, "backlogMult": 1.3 },
      { "week": "Wk8", "volume": 321, "slaPct": 78.3, "ahtMin": 17.3, "qualityPct": 88.5, "backlogMult": 1.5 }
    ]
  },
  {
    "name": "Policy & Enforcement",
    "launch": { "title": "Graduated penalty options added", "week": "Wk2" },
    "incident": { "title": "Appeals form briefly stopped accepting submissions", "week": "Wk7" },
    "series": [
      { "week": "Wk1", "volume": 142, "slaPct": 85.2, "ahtMin": 13.5, "qualityPct": 91.7, "backlogMult": 1.2 },
      { "week": "Wk2", "volume": 140, "slaPct": 82.1, "ahtMin": 13.6, "qualityPct": 91.4, "backlogMult": 1.1 },
      { "week": "Wk3", "volume": 145, "slaPct": 86.3, "ahtMin": 12.7, "qualityPct": 91.7, "backlogMult": 1 },
      { "week": "Wk4", "volume": 136, "slaPct": 82.4, "ahtMin": 12.4, "qualityPct": 91.3, "backlogMult": 1.2 },
      { "week": "Wk5", "volume": 152, "slaPct": 86.6, "ahtMin": 12.9, "qualityPct": 91.4, "backlogMult": 1 },
      { "week": "Wk6", "volume": 141, "slaPct": 81.9, "ahtMin": 12.3, "qualityPct": 90.6, "backlogMult": 1.1 },
      { "week": "Wk7", "volume": 152, "slaPct": 84.1, "ahtMin": 13.4, "qualityPct": 91.6, "backlogMult": 1.1 },
      { "week": "Wk8", "volume": 150, "slaPct": 84.9, "ahtMin": 12.9, "qualityPct": 90.9, "backlogMult": 1.1 }
    ]
  }
]
};