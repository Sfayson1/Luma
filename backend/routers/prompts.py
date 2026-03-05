from datetime import date
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

PROMPTS = [
    "What brought you joy today, even in a small way?",
    "How are you really feeling right now, beneath the surface?",
    "What's one thing you're proud of yourself for this week?",
    "Describe a moment today when you felt most like yourself.",
    "What would you tell your past self from one year ago?",
    "What challenged you today and what did it teach you?",
    "What's something you've been avoiding thinking about?",
    "What does your body need right now — rest, movement, nourishment?",
    "Write about a person who made a positive impact on your life.",
    "What are three things you're grateful for in this moment?",
    "What emotion has been showing up most for you lately?",
    "If today had a color, what would it be and why?",
    "What's a belief you hold that you've never questioned?",
    "When did you last feel truly at peace? What were you doing?",
    "What's one small act of kindness you could do for yourself today?",
    "What does 'home' feel like to you right now?",
    "What fear has been quietly holding you back?",
    "Describe your ideal day from start to finish.",
    "What boundaries do you need to set or reinforce in your life?",
    "What are you currently learning — about the world or about yourself?",
    "Write a letter of forgiveness — to yourself or someone else.",
    "What does success look like to you today (not someday, today)?",
    "What habit or pattern are you ready to leave behind?",
    "When did you last laugh until it hurt? What happened?",
    "What's something that feels heavy right now? Name it.",
    "What would you do if you knew you couldn't fail?",
    "How have you grown in the past six months?",
    "What's a dream you've quietly given up on — and is it really gone?",
    "What does your inner critic say most often? Is it true?",
    "Who in your life feels safe to be fully yourself around?",
    "What's one thing you wish others understood about you?",
    "What song captures how you feel today?",
    "Write about a time you showed real courage.",
    "What are you pretending not to notice in your life?",
    "What does your future self wish you were doing right now?",
    "What's a memory you return to when you need comfort?",
    "What would a perfect morning look like for you?",
    "What's something you keep saying 'someday' about?",
    "How do you handle difficult emotions — and is it working?",
    "What does your creativity look like right now?",
    "What relationship in your life needs more attention?",
    "Write about something that recently surprised you.",
    "What values are most important to you and are you living by them?",
    "What's one thing you've accomplished that you don't celebrate enough?",
    "What does your gut tell you about something you've been unsure of?",
    "What would you do with an entire free day for just yourself?",
    "How do you want to feel by the end of this month?",
    "What's something you're still healing from?",
    "Write about a time someone showed up for you when you needed it.",
    "What does rest truly feel like for you — not sleep, but real rest?",
    "What's one conversation you've been putting off?",
    "What are you most curious about right now?",
    "Describe your relationship with change.",
    "What does loneliness feel like to you, and when does it visit?",
    "What's something you've recently changed your mind about?",
    "What is your body telling you that your mind keeps ignoring?",
    "Write about a version of yourself you've outgrown.",
    "What does love look like in your day-to-day life?",
    "What's the kindest thing anyone has said to you recently?",
    "What story are you telling yourself that may not be true?",
    "Where do you find meaning on ordinary days?",
]


class PromptResponse(BaseModel):
    id: int
    content: str
    date_created: date


@router.get("/prompt-of-the-day", response_model=PromptResponse)
def get_prompt_of_the_day():
    today = date.today()
    index = today.toordinal() % len(PROMPTS)
    return PromptResponse(
        id=index + 1,
        content=PROMPTS[index],
        date_created=today,
    )
