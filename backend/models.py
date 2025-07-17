from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel, Field
from datetime import date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import Optional


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    grad_class = Column(String)
    hashed_password = Column(String)
    posts = relationship("Post", back_populates="owner")

class UserIn(BaseModel):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    grad_class: str

class UserOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    grad_class: str

    class Config:
        from_attributes = True

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    date_posted = Column(Date, default=date.today)
    mood = Column(String, nullable=True)
    privacy = Column(String, default="private")
    tags = Column(String, nullable=True)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=True)

    prompt = relationship("Prompt", back_populates="posts")

class PostIn(BaseModel):
    content: str
    mood: Optional[str] = None
    privacy: Optional[str] = "private"
    tags: Optional[str] = None
    prompt_id: Optional[int] = None

class PostCreate(BaseModel):
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

class PostUpdate(BaseModel):
    content: Optional[str] = None
    mood: Optional[str] = None
    privacy: Optional[str] = None
    tags: Optional[str] = None

class PostOutWithUser(BaseModel):
    id: int
    content: str
    owner_id: str
    owner: UserOut
    date_posted: date
    mood: Optional[str] = None
    privacy: str
    tags: Optional[str] = None
    prompt_id: Optional[int] = None

    class Config:
        from_attributes = True

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    date_created = Column(Date, default=date.today)

    posts = relationship("Post", back_populates="prompt")
