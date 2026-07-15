"""
KrishiCash Backend API
======================
FastAPI-based prediction service for rural borrower cash flow
forecasting and AI risk scoring.

Real-world data signals integrated:
  - NDVI (crop health via satellite)
  - IMD rainfall forecast
  - Mandi commodity pricing
  - Historical repayment behaviour

Author: Team KrishiCash
Hackathon: NABARD Hackathon @ GFF 2026
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import numpy as np
import math

app = FastAPI(
    title="KrishiCash API",
    description="AI-powered cash flow prediction and risk scoring for rural micro-enterprises.",
    version="1.0.0",
)

# Allow the React frontend to call this API during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------

class PredictionRequest(BaseModel):
    borrower_id: str = Field(..., example="KRC-2026-001")
    name: str = Field(..., example="Ramesh Kumar")
    location: str = Field(..., example="Wardha, Maharashtra")
    crop: str = Field(..., example="Cotton")
    land_area_acres: float = Field(..., gt=0, example=4.2)
    loan_amount: float = Field(..., gt=0, example=150000)

    # Alternative data signals (0–1 or categorical)
    ndvi_score: float = Field(..., ge=0, le=1, description="NDVI crop health index (0=bare soil, 1=dense healthy vegetation)", example=0.72)
    rainfall_anomaly: float = Field(..., ge=-1, le=1, description="Rainfall deviation from normal (-1=severe deficit, +1=excess)", example=0.1)
    mandi_price_change_pct: float = Field(..., description="% change in local commodity price (MoM)", example=8.0)
    repayment_score: int = Field(..., ge=0, le=100, description="Historical repayment score (0=no history, 100=perfect)", example=82)
    soil_moisture_index: float = Field(..., ge=0, le=1, description="Current soil moisture (0=critically dry, 1=saturated)", example=0.65)


class MonthlyForecast(BaseModel):
    month: str
    predicted_cashflow: float
    lower_bound: float
    upper_bound: float


class PredictionResponse(BaseModel):
    borrower_id: str
    risk_score: int = Field(..., ge=0, le=100, description="Composite AI risk score (0=very high risk, 100=very low risk)")
    risk_level: str
    recommendation: str
    key_risk_factors: list[str]
    cashflow_forecast: list[MonthlyForecast]
    explanation: str


# ---------------------------------------------------------------------------
# AI Model (rule-based scoring + statistical forecasting for prototype)
# In production, this would be a trained XGBoost + PyTorch time-series model.
# ---------------------------------------------------------------------------

MONTHS_AHEAD = ["Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26"]

# Rough seasonal multipliers for crop cash flow (index 0 = Feb)
SEASONAL_MULTIPLIERS = {
    "Cotton":     [0.20, 0.25, 0.30, 0.95, 1.00, 0.25],
    "Paddy":      [0.15, 0.40, 0.45, 0.20, 0.15, 0.15],
    "Litchi":     [0.20, 0.30, 1.00, 0.90, 0.25, 0.20],
    "Wheat":      [0.20, 0.85, 0.90, 0.15, 0.15, 0.15],
    "Sugarcane":  [0.40, 0.50, 0.55, 0.45, 0.40, 0.40],
    "Default":    [0.30, 0.40, 0.50, 0.60, 0.55, 0.35],
}


def compute_risk_score(req: PredictionRequest) -> tuple[int, list[str]]:
    """
    Composite risk scoring using weighted alternative data signals.
    Returns (score 0-100, list of key risk factor descriptions).
    """
    factors = []
    score = 0.0

    # 1. NDVI (crop health) — weight 30%
    ndvi_score = req.ndvi_score * 30
    score += ndvi_score
    if req.ndvi_score < 0.45:
        factors.append(f"🛰️ Severe crop stress detected via satellite (NDVI={req.ndvi_score:.2f})")
    elif req.ndvi_score < 0.65:
        factors.append(f"⚠️ Moderate crop stress in satellite imagery (NDVI={req.ndvi_score:.2f})")

    # 2. Rainfall anomaly — weight 20%
    rainfall_contribution = (req.rainfall_anomaly + 1) / 2 * 20
    score += rainfall_contribution
    if req.rainfall_anomaly < -0.3:
        factors.append(f"🌧️ Significant rainfall deficit (anomaly={req.rainfall_anomaly:+.0%})")
    elif req.rainfall_anomaly < 0:
        factors.append(f"☁️ Below-normal rainfall forecast ({req.rainfall_anomaly:+.0%})")

    # 3. Mandi price trend — weight 15%
    mandi_norm = min(max((req.mandi_price_change_pct + 20) / 40, 0), 1)
    score += mandi_norm * 15
    if req.mandi_price_change_pct < -10:
        factors.append(f"📉 Significant commodity price drop ({req.mandi_price_change_pct:+.1f}% MoM)")
    elif req.mandi_price_change_pct < 0:
        factors.append(f"📉 Mandi prices trending down ({req.mandi_price_change_pct:+.1f}% MoM)")

    # 4. Repayment history — weight 25%
    score += req.repayment_score / 100 * 25
    if req.repayment_score < 40:
        factors.append(f"⚠️ Poor repayment history (score={req.repayment_score}/100)")
    elif req.repayment_score < 65:
        factors.append(f"ℹ️ Moderate repayment history (score={req.repayment_score}/100)")

    # 5. Soil moisture — weight 10%
    score += req.soil_moisture_index * 10
    if req.soil_moisture_index < 0.3:
        factors.append(f"🌡️ Critically low soil moisture ({req.soil_moisture_index:.2f})")
    elif req.soil_moisture_index < 0.5:
        factors.append(f"⚠️ Below-average soil moisture ({req.soil_moisture_index:.2f})")

    if not factors:
        factors.append("✅ All environmental and financial indicators are within normal range.")

    return int(round(score)), factors


def forecast_cashflow(req: PredictionRequest, risk_score: int) -> list[MonthlyForecast]:
    """
    Statistical cash flow projection for the next 6 months.
    Uses crop seasonality, loan amount as a proxy for enterprise scale,
    and applies a risk-adjusted discount factor.
    """
    multipliers = SEASONAL_MULTIPLIERS.get(req.crop, SEASONAL_MULTIPLIERS["Default"])
    base_monthly = req.loan_amount * 0.55  # Assume enterprise turns over ~55% of loan value / peak month

    # Risk-adjusted scale: high risk → lower projected receipts
    risk_factor = 0.5 + (risk_score / 100) * 0.7

    forecasts = []
    for i, month in enumerate(MONTHS_AHEAD):
        seasonal = multipliers[i]
        predicted = base_monthly * seasonal * risk_factor

        # Uncertainty band widens over time and with lower risk scores
        uncertainty_pct = 0.15 + (i * 0.04) + ((100 - risk_score) / 100 * 0.20)
        lower = max(0, predicted * (1 - uncertainty_pct))
        upper = predicted * (1 + uncertainty_pct)

        forecasts.append(MonthlyForecast(
            month=month,
            predicted_cashflow=round(predicted, 0),
            lower_bound=round(lower, 0),
            upper_bound=round(upper, 0),
        ))

    return forecasts


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "KrishiCash API v1.0", "hackathon": "NABARD @ GFF 2026"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


@app.post("/api/v1/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(req: PredictionRequest):
    """
    **Core Endpoint**: Takes a borrower profile + alternative data signals and returns:
    - AI Risk Score (0–100)
    - Risk Level (Low / Medium / High)
    - 6-month cash flow forecast with confidence bounds
    - Key risk factors with human-readable explanations
    - Loan recommendation
    """
    risk_score, risk_factors = compute_risk_score(req)
    cashflow = forecast_cashflow(req, risk_score)

    if risk_score >= 70:
        risk_level = "Low"
        recommendation = "✅ Recommend for approval. Strong environmental and financial indicators."
    elif risk_score >= 45:
        risk_level = "Medium"
        recommendation = "⚠️ Conditional approval. Recommend a site visit and smaller initial disbursement."
    else:
        risk_level = "High"
        recommendation = "🚨 High risk. Additional collateral or co-borrower required before approval."

    explanation = (
        f"The AI model assessed {req.name}'s risk profile using satellite NDVI data (crop health), "
        f"IMD rainfall forecasts, local mandi price trends, soil moisture index, and historical "
        f"repayment behaviour. The composite risk score of {risk_score}/100 indicates a {risk_level.lower()} "
        f"risk profile for the ₹{req.loan_amount:,.0f} loan."
    )

    return PredictionResponse(
        borrower_id=req.borrower_id,
        risk_score=risk_score,
        risk_level=risk_level,
        recommendation=recommendation,
        key_risk_factors=risk_factors,
        cashflow_forecast=cashflow,
        explanation=explanation,
    )


@app.get("/api/v1/signals/ndvi/{district}", tags=["Data Signals"])
def get_ndvi(district: str):
    """
    Mock endpoint simulating a call to a satellite data provider (e.g., Google Earth Engine).
    In production, this would query a geospatial API.
    """
    mock_ndvi = {
        "wardha": 0.72,
        "muzaffarpur": 0.54,
        "thanjavur": 0.31,
    }
    score = mock_ndvi.get(district.lower(), 0.55)
    return {
        "district": district,
        "ndvi_score": score,
        "data_source": "Sentinel-2 (Mock)",
        "as_of": "2026-07-10",
        "interpretation": "Good" if score >= 0.65 else "Moderate" if score >= 0.45 else "Poor",
    }


@app.get("/api/v1/signals/mandi/{commodity}", tags=["Data Signals"])
def get_mandi_price(commodity: str):
    """
    Mock endpoint simulating data.gov.in Agmarknet / eNAM mandi price API.
    In production, this would query the live government mandi price feed.
    """
    mock_prices = {
        "cotton": {"price": 6200, "change_pct": 8.0, "unit": "quintal"},
        "paddy":  {"price": 1950, "change_pct": 0.5, "unit": "quintal"},
        "litchi": {"price": 1800, "change_pct": -5.0, "unit": "quintal"},
    }
    data = mock_prices.get(commodity.lower(), {"price": 2000, "change_pct": 0.0, "unit": "quintal"})
    return {
        "commodity": commodity,
        "data_source": "eNAM / Agmarknet (Mock)",
        "as_of": "2026-07-14",
        **data,
    }
