from fastapi import FastAPI
from database import db

from fastapi.middleware.cors import CORSMiddleware
from routes import patients
from routes import predict

app = FastAPI()

app.include_router(patients.router)
app.include_router(predict.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API po punon!"}

@app.get("/test-db")
def test_db():
    if db.is_connected():
        return {"message": "Database connected!"}
    return {"message": "Database not connected"}