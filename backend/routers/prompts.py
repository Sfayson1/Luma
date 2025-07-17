import random
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import PromptOut
from database import get_db
from models import Prompt

router = APIRouter()

@router.get("/prompt", response_model=PromptOut)
def get_random_prompt(db: Session = Depends(get_db)):
    prompts = db.query(Prompt).all()
    if not prompts:
        raise HTTPException(status_code=404, detail="No prompts available")
    return random.choice(prompts)

prompt_of_the_day = {
    "date": None,
    "prompt": None
}

@router.get("/prompt-of-the-day", response_model=PromptOut)
def get_prompt_of_the_day(db: Session = Depends(get_db)):
    today = date.today()

    prompts = db.query(Prompt).all()
    if not prompts:
        raise HTTPException(status_code=404, detail="No prompts available")

    seed = today.toordinal() + len(prompts)
    random.seed(seed)
    return random.choice(prompts)
