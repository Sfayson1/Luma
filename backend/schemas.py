from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

# ========== Auth ==========
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    grad_class: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    first_name: str
    last_name: str

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
    prompt_id: Optional[int] = None

class PostOut(BaseModel):
    id: int
    content: str
    date_posted: date
    mood: Optional[str] = None
    privacy: str
    tags: Optional[str] = None
    owner_id: str
    prompt_id: Optional[int] = None

    class Config:
        from_attributes = True

class PostOutWithUser(BaseModel):
    id: int
    content: str
    date_posted: date
    mood: Optional[str] = None
    privacy: str
    tags: Optional[str] = None
    owner_id: str
    prompt_id: Optional[int] = None
    owner: UserOut
    prompt: Optional[PromptOut] = None

    class Config:
        from_attributes = True

class PostUpdate(BaseModel):
    content: Optional[str] = None
    mood: Optional[str] = None
    privacy: Optional[str] = None
    tags: Optional[str] = None
