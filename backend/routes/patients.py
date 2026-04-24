from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from auth.dependencies import get_current_user

router = APIRouter()


# 🔥 GET ALL PATIENT USERS (DOCTOR ONLY)
@router.get("/patients-users")
def get_patient_users(user=Depends(get_current_user)):

    if user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Not allowed")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id, COALESCE(username, email) AS username, email
            FROM users
            WHERE role = 'patient'
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        db.close()


# 👨‍⚕️ DOCTOR - ALL PATIENT RECORDS
@router.get("/patients")
def get_patients(user=Depends(get_current_user)):

    if user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Not allowed")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT * FROM patients
            ORDER BY created_at DESC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        db.close()


# 🧑 PATIENT - OWN RESULTS
# DOCTOR - RECORDS FOR ONE PATIENT
@router.get("/patients/{patient_id}/history")
def get_patient_history(patient_id: int, user=Depends(get_current_user)):

    if user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Not allowed")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id
            FROM users
            WHERE id = %s AND role = 'patient'
        """, (patient_id,))

        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        cursor.execute("""
            SELECT patients.*, COALESCE(users.username, users.email) AS patient_name
            FROM patients
            LEFT JOIN users ON users.id = patients.user_id
            WHERE patients.user_id = %s
            ORDER BY patients.created_at DESC
        """, (patient_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        db.close()


# DOCTOR - DELETE ONE HISTORY RECORD
@router.delete("/patients/history/{record_id}")
def delete_patient_record(record_id: int, user=Depends(get_current_user)):

    if user["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Not allowed")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id
            FROM patients
            WHERE id = %s
        """, (record_id,))

        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Record not found")

        cursor.execute("""
            DELETE FROM patients
            WHERE id = %s
        """, (record_id,))

        db.commit()
        return {"message": "Record deleted successfully"}

    finally:
        cursor.close()
        db.close()


@router.get("/my-results")
def my_results(user=Depends(get_current_user)):

    if user["role"] != "patient":
        raise HTTPException(status_code=403, detail="Not allowed")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT patients.*, COALESCE(users.username, users.email) AS patient_name
            FROM patients
            LEFT JOIN users ON users.id = patients.user_id
            WHERE patients.user_id = %s
            ORDER BY patients.created_at DESC
        """, (user["id"],))

        return cursor.fetchall()

    finally:
        cursor.close()
        db.close()
