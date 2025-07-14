from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

# ========== Auth ==========
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    grad_class: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# ========== Prompts ==========
class PromptOut(BaseModel):
    id: int
    content: str
    date_created: date

    class Config:
        from_attributes = True


# ========== Posts ==========
class PostIn(BaseModel):
    content: str
    mood: Optional[str] = None
    privacy: Optional[str] = "private"
    tags: Optional[str] = None
    date_posted: Optional[date] = None
    prompt_id: Optional[int] = None

class PostOutWithUser(PostIn):
    id: int
    owner: UserOut
    prompt: Optional[PromptOut]

    class Config:
        from_attributes = True

class PostUpdate(BaseModel):
    content: Optional[str] = None
    mood: Optional[str] = None
    privacy: Optional[str] = None
    tags: Optional[str] = None
    date_posted: Optional[date] = None
