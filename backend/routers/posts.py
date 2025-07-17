from fastapi import APIRouter, Depends, HTTPException, status
from models import PostOutWithUser, PostIn, User, Post, PostCreate, PostOut
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from database import get_db
from routers.auth import get_current_user
from schemas import PostUpdate, PostOutWithUser

router = APIRouter()

@router.get("/", response_model=list[PostOutWithUser])
def read_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("Token verified! Current user:", current_user.username)

    return db.query(Post).filter((Post.privacy != "private") | (Post.owner_id == current_user.id)).all()

@router.post("/posts", response_model=PostOut)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_post = Post(
        content=post.content,
        mood=post.mood,
        privacy=post.privacy,
        tags=post.tags,
        prompt_id=post.prompt_id,
        owner_id=current_user.id
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        post = db.query(Post).filter(Post.id == post_id, Post.owner_id == current_user.id).one()
        db.delete(post)
        db.commit()
        return
    except NoResultFound:
        raise HTTPException(status_code=403, detail="Post not found or you do not have permission to delete it")

@router.get("/{post_id}", response_model=PostIn)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post_id == Post_id, Post.owner_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.privacy == "private" and post.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to view this post")

    return post

@router.put("/{post_id}", response_model=PostOutWithUser)
def update_post(
    post_id: int,
    updated_post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id, Post.owner_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    for field, value in updated_post.dict(exclude_unset=True).items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post

@router.get("/{post_id}", response_model=PostIn)
def get_post_for_update(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id, Post.owner_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.privacy == "private" and post.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to view this post")

    return post
