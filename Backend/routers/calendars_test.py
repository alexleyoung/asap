import pytest
import uuid
from fastapi.testclient import TestClient
from ..main import app
from ..database.db import get_db
from ..database import models
from ..utils.auth import get_current_user

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

@pytest.fixture(scope="function")
def mock_current_user(test_db):
    """Create and return a mock user for authentication"""
    user = models.User(
        email=get_unique_email(),
        hashed_password="hashedpass",
        firstname="Test",
        lastname="User",
        avatar=None
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    yield user
    # Cleanup - first delete related calendars
    test_db.query(models.Calendar).filter(models.Calendar.userID == user.id).delete()
    test_db.commit()
    # Then delete user
    test_db.query(models.User).filter(models.User.id == user.id).delete()
    test_db.commit()

@pytest.fixture(autouse=True)
def override_dependencies(mock_current_user):
    """Automatically override dependencies for all tests"""
    app.dependency_overrides[get_current_user] = lambda: mock_current_user
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(test_db):
    """Create a test user in the database"""
    user = models.User(
        email=get_unique_email(),
        hashed_password="hashedpass",
        firstname="Test",
        lastname="User",
        avatar=None
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    yield user
    # Cleanup - first delete related calendars
    test_db.query(models.Calendar).filter(models.Calendar.userID == user.id).delete()
    test_db.commit()
    # Then delete user
    test_db.query(models.User).filter(models.User.id == user.id).delete()
    test_db.commit()

@pytest.fixture
def test_calendar(test_db, test_user):
    """Create a test calendar in the database"""
    calendar = models.Calendar(
        name="Test Calendar",
        description="Test Description",
        timezone="UTC",
        userID=test_user.id
    )
    test_db.add(calendar)
    test_db.commit()
    test_db.refresh(calendar)
    yield calendar
    # Calendar cleanup is handled by test_user fixture

class TestCalendarEndpoints:
    def test_create_calendar_success(self, test_db, test_user):
        calendar_data = {
            "name": "New Test Calendar",
            "description": "Test Description",
            "timezone": "UTC",
            "userID": test_user.id
        }
        
        response = client.post("/calendars/", json=calendar_data)
        
        assert response.status_code == 200
        assert response.json()["name"] == calendar_data["name"]
        assert response.json()["description"] == calendar_data["description"]

    def test_get_calendar_success(self, test_calendar):
        response = client.get(f"/calendars/calendars/{test_calendar.id}")
        
        assert response.status_code == 200
        assert response.json()["id"] == test_calendar.id
        assert response.json()["name"] == test_calendar.name

    def test_get_calendar_not_found(self, mock_current_user):
        response = client.get("/calendars/calendars/99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Calendar not found"

    def test_edit_calendar_success(self, test_calendar):
        update_data = {
            "name": "Updated Calendar",
            "description": "Updated Description"
        }
        
        response = client.put(
            f"/calendars/calendars/{test_calendar.id}",
            json=update_data
        )
        
        assert response.status_code == 200
        assert response.json()["name"] == update_data["name"]
        assert response.json()["description"] == update_data["description"]

    def test_get_user_calendars_success(self, test_db, test_user):
        # Create multiple calendars for the user
        calendars = [
            models.Calendar(
                name=f"Calendar {i}",
                description=f"Description {i}",
                timezone="UTC",
                userID=test_user.id
            )
            for i in range(2)
        ]
        
        for calendar in calendars:
            test_db.add(calendar)
        test_db.commit()
        
        response = client.get(f"/calendars/calendars/?userID={test_user.id}")
        
        assert response.status_code == 200
        assert len(response.json()) >= 2

    def test_get_user_calendars_not_found(self, mock_current_user):
        response = client.get("/calendars/calendars/?userID=99999")
        assert response.status_code == 404
        assert response.json()["detail"] == "No calendars found for this user"

    def test_delete_calendar_success(self, test_db, test_calendar):
        calendar_id = test_calendar.id
        response = client.delete(f"/calendars/calendars/{calendar_id}")
        assert response.status_code == 204
        
        # Verify calendar was deleted
        deleted_calendar = test_db.query(models.Calendar).filter(
            models.Calendar.id == calendar_id
        ).first()
        assert deleted_calendar is None

    def test_delete_calendar_not_found(self, mock_current_user):
        response = client.delete("/calendars/calendars/99999")
        assert response.status_code == 500

    def test_create_calendar_invalid_data(self, mock_current_user):
        invalid_data = {
            "name": "",  # Empty name
            "timezone": "INVALID",
            "userID": mock_current_user.id
        }
        
        response = client.post("/calendars/", json=invalid_data)
        assert response.status_code == 422


    def test_create_calendar_nonexistent_user_explicit_endpoint(self):
        calendar_data = {
            "name": "Test Calendar",
            "description": "Test Description",
            "timezone": "UTC",
            "userID": 99999
        }
        
        response = client.post("/calendars/calendars", json=calendar_data)
        assert response.status_code == 422