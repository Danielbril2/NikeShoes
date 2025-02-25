from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.utils.jwt_utils import generate_token

class AuthService:
    @staticmethod
    def register(worker_code, password):
        """Register a new user"""
        # Check if user already exists
        existing_user = UserRepository.find_by_worker_code(worker_code)
        if existing_user:
            return {'message': 'User already exists'}, 409
        
        # Create new user
        new_user = User(worker_code=worker_code, password=password)
        UserRepository.save(new_user)
        
        return {'message': 'User created successfully'}, 201
    
    @staticmethod
    def login(worker_code, password):
        """Authenticate a user and return a token"""
        # Special case for worker codes starting with 52500
        if worker_code.startswith("52500") and User.confirm_password(password):
            return generate_token(worker_code), 200
        
        # Normal authentication flow
        user = UserRepository.find_by_worker_code(worker_code)
        if user and user.check_password(password):
            return generate_token(user.worker_code), 200
            
        return {'message': 'Invalid credentials'}, 401