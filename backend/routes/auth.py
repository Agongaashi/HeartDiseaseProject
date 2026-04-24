from fastapi import APIRouter, HTTPException
from database import get_db

from auth.password_utils import hash_password, verify_password
from auth.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_token
)

from auth.session_store import save_session
from schemas.user_schema import UserRegister, UserLogin

router = APIRouter()


# ---------------- REGISTER ----------------
@router.post("/register")
def register(user: UserRegister):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (user.email,)
        )
        existing = cursor.fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_pw = hash_password(user.password)

        cursor.execute(
            """
            INSERT INTO users (username, email, password, role)
            VALUES (%s, %s, %s, %s)
            """,
            (user.username, user.email, hashed_pw, user.role)
        )

        db.commit()

        return {"message": "User created successfully"}

    finally:
        cursor.close()
        db.close()


# ---------------- LOGIN ----------------
@router.post("/login")
def login(user: UserLogin):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (user.email,)
        )
        db_user = cursor.fetchone()

        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        # 🔥 CREATE TOKENS
        access_token = create_access_token({
            "user_id": db_user["id"],
            "email": db_user["email"],
            "role": db_user["role"]
        })

        refresh_token = create_refresh_token({
            "user_id": db_user["id"]
        })

        # 🔥 decode refresh to get jti
        payload = decode_token(refresh_token)

        if not payload:
            raise HTTPException(status_code=500, detail="Token generation failed")

        # 🔥 SAVE SESSION (multi-device support)
        save_session(
            user_id=db_user["id"],
            refresh_token=refresh_token,
            jti=payload["jti"],
            email=db_user["email"],
            role=db_user["role"]
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "role": db_user["role"],
            "email": db_user["email"]
        }

    finally:
        cursor.close()
        db.close()