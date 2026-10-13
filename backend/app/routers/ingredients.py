from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, database

router = APIRouter(prefix="/api/ingredients", tags=["ingredients"])


@router.get("/", response_model=List[schemas.IngredientResponse])
def get_ingredients(
    step: Optional[int] = Query(None, description="Фильтр по шагу (1-5)"),
    db: Session = Depends(database.get_db)
):
    return crud.get_ingredients(db, step=step)


@router.post("/", response_model=schemas.IngredientResponse)
def create_ingredient(
    ingredient: schemas.IngredientCreate,
    db: Session = Depends(database.get_db)
):
    return crud.create_ingredient(db, ingredient)