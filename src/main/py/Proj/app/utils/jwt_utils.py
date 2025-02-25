import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify, current_app
from app.repositories.mongo_user_repository import MongoUserRepository

def generate_token(worker_code):
    """Generate a JWT token for a user"""
    payload = {
        'worker_code': worker_code,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(
        payload, 
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    return {
        'token': token,
        'expirationTime': (datetime.utcnow() + timedelta(days=1)).timestamp() * 1000
    }

def token_required(f):
    """Decorator to verify JWT token on protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split('Bearer ')[1]
            data = jwt.decode(
                token, 
                current_app.config['SECRET_KEY'], 
                algorithms=["HS256"]
            )
            
            worker_code = data['worker_code']
            
            # Special case for worker codes starting with "52500"
            if worker_code.startswith("52500"):
                # For this special case, we don't require the user to exist in the database
                # This matches the behavior of the original code
                from app.models.mongo_models import MongoUser
                dummy_user = MongoUser(worker_code=worker_code, password="dummy")
                return f(dummy_user, *args, **kwargs)
                
            # Normal case - verify user exists in database
            current_user = MongoUserRepository.find_by_worker_code(worker_code)
            if not current_user:
                raise ValueError("User not found")
                
            return f(current_user, *args, **kwargs)
        except Exception as e:
            print(f"Token validation error: {str(e)}")  # Add logging for debugging
            return jsonify({'message': 'Token is invalid'}), 401
        
    return decorated