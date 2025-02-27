#from app.models.user import User
#from app.repositories.user_repository import UserRepository
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.mongo_models import MongoUser
from app.repositories.mongo_user_repository import MongoUserRepository
from app.utils.jwt_utils import generate_token


class AuthService:
    @staticmethod
    def register(worker_code, password):
        """Register a new user"""
        # Check if user already exists
        existing_user = MongoUserRepository.find_by_worker_code(worker_code)
        if existing_user:
            return {'message': 'User already exists'}, 409
        
        # Create new user
        password_hash = generate_password_hash(password)
        new_user = MongoUser.from_dict(
            {'worker_code': worker_code},
            password_hash
        )
        MongoUserRepository.save(new_user)
        
        return {'message': 'User created successfully'}, 201
    
    @staticmethod
    def login(worker_code, password):
        """Authenticate a user and return a token"""
        # Special case for worker codes starting with 52500
        #if worker_code.startswith("52500") and AuthService.confirm_password(password):
            #return generate_token(worker_code), 200
        
        # Normal authentication flow
        user = MongoUserRepository.find_by_worker_code(worker_code)
        if user and check_password_hash(user['password_hash'], password):
            return generate_token(user['worker_code']), 200
            
        return {'message': 'Invalid credentials'}, 401
    
    @staticmethod
    def confirm_password(password):
        # can also check if password == 52500219 but its boring
        return check_password_hash(generate_password_hash("52500219"), password)

'''
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
'''