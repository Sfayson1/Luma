from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr


# ========== Auth ==========
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

# Simplified registration schema matching the frontend signup form
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)

# ========== Prompts ==========
class PromptOut(BaseModel):
    id: int
    content: str
    date_created: date

    model_config = ConfigDict(from_attributes=True)

# ========== Posts ==========
class PostIn(BaseModel):
    content: str
    mood: str | None = None
    privacy: str | None = "private"
    tags: str | None = None
    prompt_id: int | None = None

class PostCreate(PostIn):
    pass

class PostOut(BaseModel):
    id: int
    content: str
    date_posted: date
    mood: str | None = None
    privacy: str
    tags: str | None = None
    owner_id: int
    prompt_id: int | None = None

    model_config = ConfigDict(from_attributes=True)

class PostOutWithUser(BaseModel):
    id: int
    content: str
    date_posted: date
    mood: str | None = None
    privacy: str
    tags: str | None = None
    owner_id: int
    prompt_id: int | None = None
    owner: UserOut
    prompt: PromptOut | None = None

    model_config = ConfigDict(from_attributes=True)

class PostUpdate(BaseModel):
    content: str | None = None
    mood: str | None = None
    privacy: str | None = None
    tags: str | None = None
