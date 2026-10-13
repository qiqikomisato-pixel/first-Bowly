from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import products, ingredients, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bowly API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(ingredients.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Bowly API 🥗"}

@app.get("/health")
def health():
    return {"status": "ok"}