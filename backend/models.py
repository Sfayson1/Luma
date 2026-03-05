from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    posts = relationship("Post", back_populates="owner")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    date_posted = Column(Date, default=date.today)
    mood = Column(String, nullable=True)
    privacy = Column(String, default="private")
    tags = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=True)

    owner = relationship("User", back_populates="posts")
    prompt = relationship("Prompt", back_populates="posts")


class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    date_created = Column(Date, default=date.today)

    posts = relationship("Post", back_populates="prompt")
