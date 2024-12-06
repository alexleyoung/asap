import pytest
from fastapi.testclient import TestClient
import uuid
from ..main import app
from ..database.db import get_db
from ..database import models, schemas

# Test client setup
client = TestClient(app)

def get_unique_email():
    """Generate a unique email for each test"""
    return f"test_{uuid.uuid4().hex[:8]}@example.com"

@pytest.fixture(scope="function")
def test_db():
    """Get database session using existing setup"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def test_user(test_db):
    """Create a test user"""
    user_data = {
        "email": get_unique_email(),
        "password": "testpassword",
        "firstname": "Test",
        "lastname": "User"
    }
    response = client.post("/users/", json=user_data)
    user = response.json()
    yield user
    # Cleanup
    test_db.query(models.User).filter(models.User.id == user["id"]).delete()
    test_db.commit()

class TestUserEndpoints:
    def test_create_user_success(self):
        user_data = {
            "email": get_unique_email(),
            "password": "testpassword",
            "firstname": "Test",
            "lastname": "User"
        }
        
        response = client.post("/users/", json=user_data)
        assert response.status_code == 200
        assert response.json()["email"] == user_data["email"]
        assert response.json()["firstname"] == user_data["firstname"]
        assert response.json()["lastname"] == user_data["lastname"]
        assert "id" in response.json()
        assert "hashed_password" not in response.json()


    def test_get_users_success(self, test_user):
        response = client.get("/users/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) > 0
        assert any(user["id"] == test_user["id"] for user in response.json())

    def test_get_users_with_pagination(self, test_db):
        # Create multiple users
        users = []
        for i in range(3):
            user_data = {
                "email": get_unique_email(),
                "password": "testpassword",
                "firstname": f"Test{i}",
                "lastname": "User"
            }
            response = client.post("/users/", json=user_data)
            users.append(response.json())

        # Test pagination
        response = client.get("/users/?skip=1&limit=2")
        assert response.status_code == 200
        assert len(response.json()) <= 2

        # Cleanup
        for user in users:
            test_db.query(models.User).filter(models.User.id == user["id"]).delete()
        test_db.commit()

    def test_get_user_by_id_success(self, test_user):
        response = client.get(f"/users/{test_user['id']}")
        assert response.status_code == 200
        assert response.json()["id"] == test_user["id"]
        assert response.json()["email"] == test_user["email"]

    def test_get_user_by_id_not_found(self):
        response = client.get("/users/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    def test_get_user_by_email_success(self, test_user):
        response = client.get(f"/users/email/{test_user['email']}")
        assert response.status_code == 200
        assert response.json()["id"] == test_user["id"]
        assert response.json()["email"] == test_user["email"]

    def test_get_user_by_email_not_found(self):
        response = client.get("/users/email/nonexistent@example.com")
        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    def test_get_user_by_email_invalid(self):
        response = client.get("/users/email/")
        assert response.status_code == 422

    def test_update_user_success(self, test_user):
        update_data = {
            "firstname": "UpdatedFirst",
            "lastname": "UpdatedLast",
        }
        
        response = client.put(f"/users/{test_user['id']}", json=update_data)
        assert response.status_code == 200
        assert response.json()["firstname"] == update_data["firstname"]
        assert response.json()["lastname"] == update_data["lastname"]
        assert response.json()["email"] == test_user["email"]  # Email shouldn't change

    def test_update_user_not_found(self):
        update_data = {
            "firstname": "UpdatedFirst",
            "lastname": "UpdatedLast",
        }
        
        response = client.put("/users/99999", json=update_data)
        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    def test_change_password_success(self, test_user):
        response = client.put(
            "/users/password",
            params={"userID": test_user["id"], "new_password": "newpassword123"}
        )
        assert response.status_code == 200
        assert response.json()["id"] == test_user["id"]

    def test_change_password_not_found(self):
        response = client.put(
            "/users/password",
            params={"userID": 99999, "new_password": "newpassword123"}
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    def test_change_password_missing_userid(self):
        response = client.put(
            "/users/password",
            params={"new_password": "newpassword123"}
        )
        assert response.status_code == 422

    def test_delete_user_success(self, test_db):
        # Create a user to delete
        user_data = {
            "email": get_unique_email(),
            "password": "testpassword",
            "firstname": "ToDelete",
            "lastname": "User"
        }
        create_response = client.post("/users/", json=user_data)
        user = create_response.json()
        
        # Delete the user
        response = client.delete(f"/users/{user['id']}")
        assert response.status_code == 200
        assert response.json()["id"] == user["id"]
        
        # Verify user is deleted
        get_response = client.get(f"/users/{user['id']}")
        assert get_response.status_code == 404

    def test_delete_user_not_found(self):
        response = client.delete("/users/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "User not found"

    def test_create_user_missing_required_fields(self):
        incomplete_data = {
            "email": get_unique_email()
            # Missing password, firstname, lastname
        }
        
        response = client.post("/users/", json=incomplete_data)
        assert response.status_code == 422
