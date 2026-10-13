from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---------- User Schemas ----------

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ---------- Product Schemas ----------

class ProductBase(BaseModel):
    name: str
    emoji: Optional[str] = None
    price: float
    calories: Optional[int] = None
    protein: Optional[float] = None
    fats: Optional[float] = None
    carbs: Optional[float] = None
    category: Optional[str] = None
    in_stock: bool = True
    ingredients: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Ingredient Schemas ----------

class IngredientBase(BaseModel):
    name: str
    step: int
    emoji: Optional[str] = None
    weight: Optional[str] = None
    calories: Optional[int] = None
    protein: Optional[float] = None
    fats: Optional[float] = None
    carbs: Optional[float] = None
    price: Optional[float] = None
    description: Optional[str] = None


class IngredientCreate(IngredientBase):
    pass


class IngredientResponse(IngredientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True