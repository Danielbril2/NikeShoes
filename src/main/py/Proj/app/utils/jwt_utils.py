import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify, current_app
from app.repositories.mongo_user_repository import MongoUserRepository

# Update this function in jwt_utils.py
def generate_token(worker_code):
    """Generate a JWT token for a user"""
    payload = {
        'worker_code': worker_code,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    
    # Get the secret key
    secret_key = current_app.config['SECRET_KEY']
    
    # Ensure secret key is bytes
    if isinstance(secret_key, str):
        secret_key = secret_key.encode('utf-8')
    
    # Generate token
    token = jwt.encode(
        payload, 
        secret_key,
        algorithm="HS256"
    )
    
    # Ensure token is string
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
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
            if token.startswith('Bearer '):
                token = token.split('Bearer ')[1]
            
            # Get the secret key
            secret_key = current_app.config['SECRET_KEY']
            
            # Ensure secret key is bytes
            if isinstance(secret_key, str):
                secret_key = secret_key.encode('utf-8')
            
            # Decode token
            data = jwt.decode(
                token, 
                secret_key,
                algorithms=["HS256"]
            )
            
            worker_code = data['worker_code']
                        
            # Normal case
            current_user = MongoUserRepository.find_by_worker_code(worker_code)
            if not current_user:
                raise ValueError("User not found")
            
            return f(current_user, *args, **kwargs)
                
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return jsonify({'message': 'Token is invalid'}), 401
        
    return decorated