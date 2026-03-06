"""
End-to-end test: full user journey across auth and posts routers.
Simulates the flow a real user takes from sign-up to journaling.
"""


def test_full_user_journey(client):
    # 1. Register a new user
    resp = client.post(
        "/api/auth/register",
        json={
            "name": "Journey User",
            "email": "journey@example.com",
            "password": "securepass123",
        },
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a journal entry
    create_resp = client.post(
        "/api/posts/",
        json={
            "content": "Today I reflected on what matters most.",
            "mood": "great",
            "tags": "reflection,gratitude",
        },
        headers=headers,
    )
    assert create_resp.status_code == 200
    post = create_resp.json()
    assert post["content"] == "Today I reflected on what matters most."
    assert post["mood"] == "great"
    post_id = post["id"]

    # 3. Confirm the entry appears in the user's list
    list_resp = client.get("/api/posts/", headers=headers)
    assert list_resp.status_code == 200
    assert any(p["id"] == post_id for p in list_resp.json())

    # 4. Update the entry
    update_resp = client.put(
        f"/api/posts/{post_id}",
        json={"content": "Updated reflection.", "mood": "good"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["content"] == "Updated reflection."
    assert update_resp.json()["mood"] == "good"

    # 5. Delete the entry
    delete_resp = client.delete(f"/api/posts/{post_id}", headers=headers)
    assert delete_resp.status_code == 204

    # 6. Confirm it's gone
    final_list = client.get("/api/posts/", headers=headers)
    assert all(p["id"] != post_id for p in final_list.json())
