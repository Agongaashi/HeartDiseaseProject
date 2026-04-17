# backend/schemas/patient_schema.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Për CRUD (ekzistues)
class Patient(BaseModel):
    age: int
    sex: int
    blood_pressure: int
    cholesterol: int
    heart_rate: int

# Për predikim (i duhet predict.py)
class PatientData(BaseModel):
    age: int
    sex: int
    blood_pressure: int
    cholesterol: int
    heart_rate: int

# Për përgjigjen e predikimit
class PredictionResponse(BaseModel):
    prediction: int
    risk_level: str
    probability: float
    patient_id: int
    message: str

# Për response me timestamp
class PatientResponse(Patient):
    id: int
    prediction: Optional[int] = None
    prediction_probability: Optional[float] = None
    created_at: Optional[datetime] = None