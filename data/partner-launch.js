const PARTNER_LAUNCH = {
  stats: [
    { value: "40+", label: "Distribution partners launched, up from 2" },
    { value: "72%", label: "Growth in new partners year over year" },
    { value: "95%", label: "Increase in subscriptions across the partner base" },
  ],
  profiles: [
    {
      id: "carrier",
      name: "Global Carrier",
      subtitle: "Established markets, deep device integration",
      weeksToLaunch: 10,
      pillars: {
        training: { title: "Full field enablement", detail: "In-person training across retail and call center staff, delivered in the partner's core languages, with a certification quiz before go-live." },
        support: { title: "Dedicated escalation path", detail: "Co-branded support with a named handoff process between partner care and our expert team, plus weekly issue review." },
        marketing: { title: "Full-funnel campaign", detail: "National broadcast and out-of-home for awareness, paired with in-store placements and direct-to-consumer offers for conversion." },
        partnerMgmt: { title: "Weekly executive sync", detail: "Joint steering committee through launch, then a monthly cadence once the partnership stabilizes." },
      },
    },
    {
      id: "oem",
      name: "Regional OEM",
      subtitle: "Emerging market, moderate integration complexity",
      weeksToLaunch: 7,
      pillars: {
        training: { title: "Train-the-trainer model", detail: "A core team trained directly, who then cascade training to frontline staff using localized turnkey materials." },
        support: { title: "Standard support integration", detail: "FAQ and self-service flows for common issues, with a lightweight escalation form for anything unresolved." },
        marketing: { title: "Digital-first activation", detail: "Paid social and search to build awareness quickly, plus a localized landing page as the primary conversion point." },
        partnerMgmt: { title: "Bi-weekly check-ins", detail: "Structured check-ins through the first two months, tapering to monthly once metrics stabilize." },
      },
    },
    {
      id: "retail",
      name: "Retail Chain",
      subtitle: "High foot traffic, voucher-based activation",
      weeksToLaunch: 5,
      pillars: {
        training: { title: "Self-serve online module", detail: "A short online course for sales associates, with an in-store quick-reference card as a leave-behind." },
        support: { title: "Voucher-first support", detail: "Support scoped narrowly to activation and redemption issues, since most usage questions route to standard product support." },
        marketing: { title: "In-store and D2C push", detail: "Point-of-sale displays and register handouts, backed by an email and SMS campaign to the partner's existing customer list." },
        partnerMgmt: { title: "Launch-week war room", detail: "Daily syncs for the first week to catch activation issues fast, then monthly thereafter." },
      },
    },
  ],
};
