"""
Tests for the prompts router.
All tests run without a database — the prompt-of-the-day endpoint
uses a static in-memory list, making it fast and dependency-free.
"""

from datetime import date
from fastapi.testclient import TestClient

# Import the router directly and build a minimal app so we don't need
# a running database or real environment variables.
from fastapi import FastAPI
from routers.prompts import router, PROMPTS

app = FastAPI()
app.include_router(router, prefix="/api/prompts")

client = TestClient(app)


def test_prompt_of_the_day_returns_200():
    response = client.get("/api/prompts/prompt-of-the-day")
    assert response.status_code == 200


def test_prompt_of_the_day_has_required_fields():
    response = client.get("/api/prompts/prompt-of-the-day")
    data = response.json()
    assert "id" in data
    assert "content" in data
    assert "date_created" in data


def test_prompt_content_is_non_empty_string():
    response = client.get("/api/prompts/prompt-of-the-day")
    content = response.json()["content"]
    assert isinstance(content, str)
    assert len(content) > 0


def test_prompt_date_is_today():
    response = client.get("/api/prompts/prompt-of-the-day")
    data = response.json()
    assert data["date_created"] == date.today().isoformat()


def test_prompt_is_deterministic_same_day():
    """Same prompt should be returned on every call within the same day."""
    r1 = client.get("/api/prompts/prompt-of-the-day")
    r2 = client.get("/api/prompts/prompt-of-the-day")
    assert r1.json()["content"] == r2.json()["content"]


def test_prompt_id_within_valid_range():
    response = client.get("/api/prompts/prompt-of-the-day")
    prompt_id = response.json()["id"]
    assert 1 <= prompt_id <= len(PROMPTS)


def test_prompts_list_has_sufficient_variety():
    """Sanity check — enough prompts to go weeks without repeating."""
    assert len(PROMPTS) >= 30
