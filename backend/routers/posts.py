from fastapi import APIRouter, Depends
from models import PostOutWithUser, PostIn, User, Post
from sqlalchemy.orm import Session
from database import get_db
from routers.auth_routes import get_current_user

router = APIRouter()

@router.get("/", response_model=list[PostOutWithUser])
def read_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("Token verified! Current user:", current_user.username)

    return db.query(Post).all()

@router.post("/", response_model=PostOutWithUser)
def create_post(
    post: PostIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_post = Post(**post.dict(), owner_id=current_user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
