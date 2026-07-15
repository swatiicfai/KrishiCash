---
marp: true
theme: default
class: invert
style: |
  section {
    background-color: #0a0f1e;
    color: #e5e7eb;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    padding: 40px 60px;
  }
  h1, h2, h3 {
    color: #22c55e;
  }
  h1 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 6px;
  }
  h2 {
    font-size: 1.3rem;
    font-weight: 700;
    border-bottom: 2px solid #16a34a;
    padding-bottom: 6px;
    margin-bottom: 14px;
  }
  h3 {
    font-size: 0.95rem;
    color: #9ca3af;
    font-weight: 400;
    margin-top: 4px;
  }
  p {
    font-size: 0.85rem;
    line-height: 1.55;
    margin: 6px 0;
  }
  strong {
    color: #4ade80;
  }
  ul {
    font-size: 0.82rem;
    line-height: 1.55;
    margin: 0;
    padding-left: 1.4em;
  }
  li {
    margin-bottom: 6px;
  }
  .highlight {
    background-color: #111827;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #1f2937;
    font-size: 0.82rem;
    line-height: 1.55;
    margin-bottom: 14px;
    color: #d1fae5;
  }
---

<!-- _class: lead -->

# KrishiCash
### AI-Powered Cash Flow & Risk Oracle for Rural Micro-enterprises

**Team:** Team KrishiCash
**NABARD Hackathon @ GFF 2026**

---

## 🚨 The Core Problem

- **The Credit Gap:** 87M+ rural households lack access to formal credit.
- **Data Blindspots:** Traditional financial institutions cannot assess risk without CIBIL scores or formal financial histories.
- **The Result:** 
  - High rejection rates for capable, honest borrowers.
  - Unexpected loan defaults (NPAs) due to unforeseen hyper-local risks like droughts or commodity price crashes.

---

## 💡 Our Solution: KrishiCash

A **B2B predictive risk assessment platform** designed for MFIs, Regional Rural Banks, and NBFCs.

<div class="highlight">
By synthesizing alternative, hyper-local data with basic transaction records, KrishiCash accurately forecasts future cash flows and generates dynamic risk scores.
</div>

- **Fast:** Real-time API-driven decisions.
- **Inclusive:** Requires zero traditional credit history.
- **Explainable:** Transparent AI that tells loan officers exactly *why* a risk is flagged.

---

## ⚙️ Technology & Architecture

KrishiCash leverages modern AI and open data layers:

- **Alternative Data Feeds:** 
  - 🛰️ Satellite NDVI (Google Earth Engine) for crop health.
  - 🌧️ OpenWeather/IMD for localized climate risk.
  - 📊 eNAM/Agmarknet for live commodity pricing.
- **AI Inference Layer:** XGBoost & PyTorch time-series models for cash flow forecasting.
- **Application Layer:** FastAPI backend serving a React.js dashboard for loan officers.

---

## 💼 Business Model & Impact

- **Target Customers:** Microfinance Institutions (MFIs), Regional Rural Banks.
- **Revenue Model:** B2B SaaS / Pay-per-API-call (₹15–₹50 per assessment).
- **Value Proposition:** 
  - Reduces NPAs by an estimated **15-20%**.
  - Safely expands the eligible borrower base by utilizing alternative data.
- **Social Impact:** Democratizes access to capital, empowering rural entrepreneurs and stabilizing agricultural supply chains.

---

## 🗺️ Future Roadmap

- **Phase 1 (Now - GFF 2026):** Prototype cash flow prediction model on historical open data with live dashboard.
- **Phase 2 (6 Months):** Live pilot integration with a regional MFI for real-world validation on 1,000+ borrowers.
- **Phase 3 (Year 1+):** Multi-state rollout and expansion into automated crop insurance payouts based on the same satellite intelligence.

---

<!-- _class: lead -->

# Thank You

**Ready to revolutionize rural finance.**
*Code available on GitHub.*
