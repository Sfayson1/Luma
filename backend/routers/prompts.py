import random
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

    # Return cached prompt if it's for today
    if prompt_of_the_day["date"] == today and prompt_of_the_day["prompt"]:
        return prompt_of_the_day["prompt"]

    # Otherwise fetch a new random prompt from the DB
    prompts = db.query(Prompt).all()
    if not prompts:
        raise HTTPException(status_code=404, detail="No prompts available")

    new_prompt = random.choice(prompts)
    prompt_of_the_day["date"] = today
    prompt_of_the_day["prompt"] = new_prompt

    return new_prompt
