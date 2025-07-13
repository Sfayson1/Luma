from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel, Field
from datetime import date

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
        orm_mode = True

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    date_posted = Column(Date, default=date.today)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="posts")

class PostIn(BaseModel):
    content: str
    date_posted: date = Field(default_factory=date.today)

class PostOutWithUser(BaseModel):
    id: int
    content: str
    owner_id: int
    owner: UserOut
    date_posted: date

    class Config:
        orm_mode = True
