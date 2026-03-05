"""Tests for the auth router."""


def test_register_success(client):
    r = client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "secret123"},
    )
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_register_duplicate_email(client, registered_user):
    r = client.post(
        "/api/auth/register",
        json={"name": "Dupe", "email": "test@example.com", "password": "password123"},
    )
    assert r.status_code == 400
    assert "already registered" in r.json()["detail"].lower()


def test_register_username_derived_from_email(client):
    r = client.post(
        "/api/auth/register",
        json={"name": "Alice Smith", "email": "alice@example.com", "password": "pass1234"},
    )
    assert r.status_code == 200


def test_login_success(client, registered_user):
    r = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "password123"},
    )
    assert r.status_code == 200
    assert "access_token" in r.json()


def test_login_wrong_password(client, registered_user):
    r = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "wrongpass"},
    )
    assert r.status_code == 401


def test_login_unknown_email(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "password123"},
    )
    assert r.status_code == 401


def test_get_me(client, auth_headers):
    r = client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "test@example.com"
    assert data["first_name"] == "Test"
    assert data["last_name"] == "User"


def test_get_me_no_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_get_me_invalid_token(client):
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401


def test_update_me_first_name(client, auth_headers):
    r = client.patch("/api/auth/me", json={"first_name": "Updated"}, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["first_name"] == "Updated"


def test_update_me_email(client, auth_headers):
    r = client.patch("/api/auth/me", json={"email": "new@example.com"}, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "new@example.com"


def test_change_password_success(client, auth_headers):
    r = client.post(
        "/api/auth/change-password",
        json={"current_password": "password123", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    assert r.json()["message"] == "Password updated successfully"


def test_change_password_wrong_current(client, auth_headers):
    r = client.post(
        "/api/auth/change-password",
        json={"current_password": "wrongpass", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert r.status_code == 400


def test_change_password_too_short(client, auth_headers):
    r = client.post(
        "/api/auth/change-password",
        json={"current_password": "password123", "new_password": "abc"},
        headers=auth_headers,
    )
    assert r.status_code == 400


def test_logout(client):
    r = client.post("/api/auth/logout")
    assert r.status_code == 200
