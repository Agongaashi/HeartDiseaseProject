from fastapi import APIRouter
from schemas.patient_schema import Patient
from database import cursor, db

router = APIRouter()

@router.post("/patients")
def add_patient(patient: Patient):

    query = """
    INSERT INTO patients (age, sex, blood_pressure, cholesterol, heart_rate)
    VALUES (%s,%s,%s,%s,%s)
    """

    values = (
        patient.age,
        patient.sex,
        patient.blood_pressure,
        patient.cholesterol,
        patient.heart_rate
    )

    cursor.execute(query, values)
    db.commit()

    return {"message": "Patient added successfully"}


@router.get("/patients")
def get_patients():
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM patients ORDER BY created_at DESC"
    cursor.execute(query)

    patients = cursor.fetchall()

    return patients