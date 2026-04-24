from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import patients, predict, auth, refresh

app = FastAPI()

# 🔥 CORS (FINAL FIX)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(refresh.router, tags=["Auth"])
app.include_router(patients.router, tags=["Patients"])
app.include_router(predict.router, tags=["Predict"])


@app.get("/")
def home():
    return {"message": "API running"}
