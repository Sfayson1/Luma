from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import users, posts, auth, prompts

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://lumajournal.com",
    "https://www.lumajournal.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])
app.include_router(posts.router, prefix="/api/posts", tags=["Posts"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/test-token")
def test_token():
    return {"message": "CORS is working"}

@app.get("/")
def health():
    return {"status": "ok"}
