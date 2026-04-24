from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from auth.dependencies import get_current_user

import numpy as np
import pickle
import os

from schemas.patient_schema import PatientData, PredictionResponse

router = APIRouter()

MODEL_PATH = "models/ml_model.pkl"


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError("Modeli nuk u gjet!")

    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


model = load_model()


@router.post("/predict", response_model=PredictionResponse)
def predict(patient_data: PatientData, user=Depends(get_current_user)):

    if user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Only doctor can predict")

    if patient_data.user_id is None:
        raise HTTPException(status_code=400, detail="Patient not selected")

    # 🔥 SAFE CONVERSION (IMPORTANT FIX)
    try:
        age = float(patient_data.age)
        sex = int(patient_data.sex)
        bp = float(patient_data.blood_pressure)
        cholesterol = float(patient_data.cholesterol)
        heart_rate = float(patient_data.heart_rate)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid input values")

    features = np.array([[age, sex, bp, cholesterol, heart_rate]])

    try:
        prediction = int(model.predict(features)[0])
        prediction_prob = float(model.predict_proba(features)[0][1])
    except Exception as e:
        print("MODEL ERROR:", e)
        raise HTTPException(status_code=500, detail="Model prediction failed")

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO patients 
            (age, sex, blood_pressure, cholesterol, heart_rate,
             prediction, prediction_probability, doctor_id, user_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            age,
            sex,
            bp,
            cholesterol,
            heart_rate,
            prediction,
            prediction_prob,
            user["id"],
            patient_data.user_id
        ))

        db.commit()

        return {
            "prediction": prediction,
            "risk_level": "High" if prediction == 1 else "Low",
            "probability": prediction_prob,
            "message": "Prediction saved successfully"
        }

    except Exception as e:
        print("DB ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()