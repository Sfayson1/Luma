"""Tests for the posts router."""


def _make_user(client, email, name="Test User", password="password123"):
    resp = client.post(
        "/api/auth/register",
        json={"name": name, "email": email, "password": password},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_posts_empty(client, auth_headers):
    r = client.get("/api/posts/", headers=auth_headers)
    assert r.status_code == 200
    assert r.json() == []


def test_create_post(client, auth_headers):
    r = client.post(
        "/api/posts/",
        json={"content": "My first entry", "mood": "good"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    data = r.json()
    assert data["content"] == "My first entry"
    assert data["mood"] == "good"
    assert "id" in data


def test_create_post_with_tags(client, auth_headers):
    r = client.post(
        "/api/posts/",
        json={"content": "Tagged entry", "mood": "great", "tags": "morning,gratitude"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    assert r.json()["tags"] == "morning,gratitude"


def test_create_post_minimal(client, auth_headers):
    """Content is the only required field."""
    r = client.post("/api/posts/", json={"content": "Bare minimum"}, headers=auth_headers)
    assert r.status_code == 200


def test_list_posts_after_create(client, auth_headers):
    client.post("/api/posts/", json={"content": "Entry 1", "mood": "okay"}, headers=auth_headers)
    client.post("/api/posts/", json={"content": "Entry 2", "mood": "great"}, headers=auth_headers)
    r = client.get("/api/posts/", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_get_post(client, auth_headers):
    created = client.post(
        "/api/posts/", json={"content": "Fetch me"}, headers=auth_headers
    ).json()
    r = client.get(f"/api/posts/{created['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["content"] == "Fetch me"


def test_get_post_not_found(client, auth_headers):
    r = client.get("/api/posts/9999", headers=auth_headers)
    assert r.status_code == 404


def test_update_post_content(client, auth_headers):
    created = client.post(
        "/api/posts/", json={"content": "Original"}, headers=auth_headers
    ).json()
    r = client.put(
        f"/api/posts/{created['id']}",
        json={"content": "Updated content"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    assert r.json()["content"] == "Updated content"


def test_update_post_mood(client, auth_headers):
    created = client.post(
        "/api/posts/", json={"content": "Mood change", "mood": "okay"}, headers=auth_headers
    ).json()
    r = client.put(
        f"/api/posts/{created['id']}",
        json={"mood": "great"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    assert r.json()["mood"] == "great"


def test_update_post_not_found(client, auth_headers):
    r = client.put("/api/posts/9999", json={"content": "Nope"}, headers=auth_headers)
    assert r.status_code == 404


def test_delete_post(client, auth_headers):
    created = client.post(
        "/api/posts/", json={"content": "Delete me"}, headers=auth_headers
    ).json()
    r = client.delete(f"/api/posts/{created['id']}", headers=auth_headers)
    assert r.status_code == 204


def test_delete_post_removed_from_list(client, auth_headers):
    created = client.post(
        "/api/posts/", json={"content": "Gone soon"}, headers=auth_headers
    ).json()
    client.delete(f"/api/posts/{created['id']}", headers=auth_headers)
    r = client.get("/api/posts/", headers=auth_headers)
    assert r.json() == []


def test_posts_require_auth(client):
    r = client.get("/api/posts/")
    assert r.status_code == 401


def test_create_post_requires_auth(client):
    r = client.post("/api/posts/", json={"content": "No auth"})
    assert r.status_code == 401


def test_posts_are_user_scoped(client):
    """User A's posts should not appear in User B's list."""
    headers_a = _make_user(client, "a@example.com", "User A")
    headers_b = _make_user(client, "b@example.com", "User B")

    client.post("/api/posts/", json={"content": "User A post"}, headers=headers_a)

    r = client.get("/api/posts/", headers=headers_b)
    assert r.json() == []


def test_cannot_delete_other_users_post(client):
    headers_a = _make_user(client, "a@example.com", "User A")
    headers_b = _make_user(client, "b@example.com", "User B")

    post = client.post(
        "/api/posts/", json={"content": "User A post"}, headers=headers_a
    ).json()

    r = client.delete(f"/api/posts/{post['id']}", headers=headers_b)
    assert r.status_code == 403


def test_cannot_update_other_users_post(client):
    headers_a = _make_user(client, "a@example.com", "User A")
    headers_b = _make_user(client, "b@example.com", "User B")

    post = client.post(
        "/api/posts/", json={"content": "User A post"}, headers=headers_a
    ).json()

    r = client.put(
        f"/api/posts/{post['id']}", json={"content": "Hijacked"}, headers=headers_b
    )
    assert r.status_code == 404
