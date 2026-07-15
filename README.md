# 🌾 KrishiCash — AI-Powered Cash Flow Prediction & Risk Assessment

> **NABARD Hackathon @ GFF 2026** | Theme: AI for Rural Finance | Problem Statement: AI-Driven Cash Flow Prediction & Risk Management

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🚨 The Real Problem

Over **87 million** rural households in India lack access to formal credit. Traditional credit scoring fails them because:

- ❌ No formal credit history (no CIBIL score)
- ❌ Income is seasonal, informal, and largely undocumented
- ❌ Lenders cannot assess hyper-local risks like drought, pest attacks, or price crashes
- ❌ Loan officers rely on gut-feel, leading to both **over-rejection of good borrowers** and **under-detection of bad ones**

The result: **₹1.2 lakh crore** in rural NPAs annually, and millions of farmers left without capital when they need it most.

---

## 💡 Our Solution: KrishiCash

KrishiCash is a **B2B AI platform** for Microfinance Institutions (MFIs), Regional Rural Banks, and NBFCs that replaces guesswork with data.

We bypass the need for formal financial records by synthesising **alternative, hyper-local data signals**:

| Data Signal | Source | What it tells us |
|---|---|---|
| 🛰️ **NDVI (Satellite Imagery)** | Sentinel-2 / Google Earth Engine | Crop health and yield potential |
| 🌧️ **Rainfall Forecast** | IMD / OpenWeather API | Climate risk for the next 3 months |
| 📊 **Mandi Commodity Prices** | eNAM / Agmarknet API | Market risk and price volatility |
| 💧 **Soil Moisture Index** | ISRO / Bhuvan | Ground-level agricultural stress |
| 📱 **Repayment History** | MFI internal data | Behavioural risk |

These signals feed our **AI risk engine**, which outputs:
1. **A risk score (0–100)** with full explainability
2. **A 6-month cash flow forecast** with confidence bounds
3. **Human-readable alerts** for loan officers

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Dashboard                     │
│  (Loan Officer UI — Recharts, Tailwind CSS, Vite)   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST API)
┌──────────────────────▼──────────────────────────────┐
│              KrishiCash FastAPI Backend              │
│  /api/v1/predict  →  Risk Score + Cash Flow Model   │
│  /api/v1/signals  →  NDVI, Mandi Price (live feeds) │
└─────┬───────────────────────────────────┬───────────┘
      │                                   │
┌─────▼──────────┐             ┌──────────▼──────────┐
│ Satellite Data  │             │  Market & Climate   │
│ (NDVI via      │             │  Data (IMD, eNAM,   │
│  Earth Engine)  │             │  OpenWeather)       │
└────────────────┘             └─────────────────────┘
```

---

## 🖥️ Features

- 📊 **Live Risk Dashboard** — select any borrower and instantly see their AI risk score, cash flow forecast, and environmental signals
- 🛰️ **Satellite-Powered Insights** — NDVI crop health scores integrated directly into risk calculations
- 📈 **6-Month Cash Flow Forecast** — time-series prediction with upper/lower confidence bounds
- 🚨 **Intelligent Alerts** — auto-flagged risk warnings (e.g., drought forecast, price crash)
- 🔍 **Explainable AI** — every score comes with a breakdown of contributing factors
- 🔌 **REST API** — MFIs can integrate `/api/v1/predict` directly into their existing loan management systems

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+

### 1. Clone the Repository
```bash
git clone https://github.com/swatiicfai/KrishiCash.git
cd KrishiCash
```

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run the Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API docs available at `http://localhost:8000/docs`

---

## 📡 API Usage Example

```bash
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "borrower_id": "KRC-2026-001",
    "name": "Ramesh Kumar",
    "location": "Wardha, Maharashtra",
    "crop": "Cotton",
    "land_area_acres": 4.2,
    "loan_amount": 150000,
    "ndvi_score": 0.72,
    "rainfall_anomaly": 0.1,
    "mandi_price_change_pct": 8.0,
    "repayment_score": 82,
    "soil_moisture_index": 0.65
  }'
```

**Sample Response:**
```json
{
  "borrower_id": "KRC-2026-001",
  "risk_score": 78,
  "risk_level": "Low",
  "recommendation": "✅ Recommend for approval. Strong environmental and financial indicators.",
  "key_risk_factors": ["✅ All environmental and financial indicators are within normal range."],
  "cashflow_forecast": [
    { "month": "Feb '26", "predicted_cashflow": 16500, "lower_bound": 13200, "upper_bound": 19800 }
  ],
  "explanation": "The AI model assessed Ramesh Kumar's risk profile using satellite NDVI data..."
}
```

---

## 💼 Business Model

| Customer | Value Delivered | Pricing |
|---|---|---|
| MFIs & Rural Banks | Reduce NPAs, expand credit access | ₹15–50 per risk assessment (API call) |
| NABARD / Govt. | Transparent, data-driven rural lending | Enterprise license |
| Fintech Platforms | Plug-and-play credit intelligence | SaaS subscription |

**Projected Impact:**
- Reduce rural NPAs by **15–20%**
- Expand credit access to **5M+ new borrowers** in 3 years
- Save lenders an estimated **₹500 Cr** in bad debt annually

---

## 🗺️ Roadmap

| Phase | Timeline | Milestone |
|---|---|---|
| ✅ Prototype | GFF 2026 | AI dashboard + scoring model on mock data |
| 🔄 Pilot | Q4 2026 | Live integration with 1 regional MFI (50 borrowers) |
| 🚀 Scale | 2027 | Multi-state rollout, live satellite feeds, mobile app for field officers |
| 🌏 Expand | 2028 | ASEAN & African rural finance markets |

---

## 👥 Team

Built with ❤️ for **NABARD Hackathon @ GFF 2026** — India's biggest fintech innovation stage.

---

## 📄 License
MIT
