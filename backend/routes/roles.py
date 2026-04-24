from fastapi import APIRouter, Depends
from auth.dependencies import require_role

router = APIRouter()

@router.get("/doctor-data")
def doctor_only(user=Depends(require_role("doctor"))):
    return {"message": "Only doctor can see this"}

@router.get("/patient-data")
def patient_only(user=Depends(require_role("patient"))):
    return {"message": "Only patient can see this"}