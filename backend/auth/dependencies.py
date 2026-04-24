from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from auth.jwt_handler import decode_token

security = HTTPBearer()


def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "id": payload["user_id"],
        "email": payload["email"],
        "role": payload["role"]
    }