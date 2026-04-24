from pydantic import BaseModel


class Patient(BaseModel):
    age: int
    sex: int
    blood_pressure: float
    cholesterol: float
    heart_rate: float


# 🔥 KJO ËSHTË E RËNDËSISHME PËR /predict
class PatientData(BaseModel):
    user_id: int   # 👈 FIX KRYESOR
    age: int
    sex: int
    blood_pressure: float
    cholesterol: float
    heart_rate: float


class PredictionResponse(BaseModel):
    prediction: int
    risk_level: str
    probability: float
    message: str