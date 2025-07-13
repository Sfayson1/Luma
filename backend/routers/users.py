from fastapi import APIRouter, Depends
from models import UserOut, UserIn
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

@router.get("/", response_model=list[UserOut])
def read_users(db: Session = Depends(get_db)):

    return []
