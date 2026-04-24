from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth.jwt_handler import decode_token, create_access_token
from auth.session_store import get_session_by_jti

router = APIRouter()


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/auth/refresh")
def refresh_token(data: RefreshRequest):

    payload = decode_token(data.refresh_token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid type")

    session = get_session_by_jti(payload.get("jti"))

    if not session:
        raise HTTPException(status_code=401, detail="Session expired")

    new_access = create_access_token({
        "user_id": session["user_id"],
        "email": session["email"],
        "role": session["role"]
    })

    return {"access_token": new_access}
