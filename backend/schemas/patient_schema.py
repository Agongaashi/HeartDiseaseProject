# backend/schemas/patient_schema.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Patient(BaseModel):
    """Schema per te dhenat e pacientit (pa predikim)"""
    age: int = Field(..., ge=0, le=120, description="Mosha ne vite")
    sex: int = Field(..., ge=0, le=1, description="Gjinia: 0=Female, 1=Male")
    blood_pressure: int = Field(..., ge=50, le=250, description="Presioni i gjakut")
    cholesterol: int = Field(..., ge=100, le=400, description="Kolesterol total")
    heart_rate: int = Field(..., ge=40, le=200, description="Rrahjet e zemres")
    
    class Config:
        json_schema_extra = {
            "example": {
                "age": 55,
                "sex": 1,
                "blood_pressure": 140,
                "cholesterol": 240,
                "heart_rate": 85
            }
        }

class PatientResponse(Patient):
    """Schema per te marre te dhenat e pacientit nga database"""
    id: int
    prediction: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True