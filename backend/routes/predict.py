# backend/routes/predict.py
from fastapi import APIRouter, HTTPException
import numpy as np
import pickle
import os
from database import db
from schemas.patient_schema import PatientData, PredictionResponse

router = APIRouter()

# Load ML model (me error handling)
MODEL_PATH = "models/ml_model.pkl"

def load_model():
    """Ngarko modelin e trajnuar"""
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Modeli nuk u gjet ne {MODEL_PATH}. Run train_model.py fillimisht!")
    
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

# Ngarko modelin kur starton serveri
try:
    model = load_model()
    print("✅ Modeli i ML u ngarkua me sukses")
except Exception as e:
    print(f"❌ Gabim gjate ngarkimit te modelit: {e}")
    model = None

@router.post("/predict", response_model=PredictionResponse)
def predict(patient_data: PatientData):
    """
    Parashikon riskun e semundjes se zemres
    """
    # Kontrollo nese modeli eshte i ngarkuar
    if model is None:
        raise HTTPException(status_code=500, detail="Modeli nuk eshte i ngarkuar")
    
    # 1️⃣ Pergatit feature-et per predikim
    features = np.array([[
        patient_data.age,
        patient_data.sex,
        patient_data.blood_pressure,
        patient_data.cholesterol,
        patient_data.heart_rate
    ]])
    
    # 2️⃣ Bej predikimin
    try:
        prediction = int(model.predict(features)[0])
        prediction_prob = float(model.predict_proba(features)[0][1])  # Probabiliteti per risk
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gabim gjate predikimit: {str(e)}")
    
    # 3️⃣ Ruaj ne database
    cursor = db.cursor()
    
    query = """
    INSERT INTO patients 
    (age, sex, blood_pressure, cholesterol, heart_rate, prediction, prediction_probability)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    values = (
        patient_data.age,
        patient_data.sex,
        patient_data.blood_pressure,
        patient_data.cholesterol,
        patient_data.heart_rate,
        prediction,
        prediction_prob
    )
    
    try:
        cursor.execute(query, values)
        db.commit()
        patient_id = cursor.lastrowid
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gabim ne database: {str(e)}")
    finally:
        cursor.close()
    
    # 4️⃣ Kthe pergjigjen
    return PredictionResponse(
        prediction=prediction,
        risk_level="High" if prediction == 1 else "Low",
        probability=prediction_prob,
        patient_id=patient_id,
        message="Patient saved successfully"
    )