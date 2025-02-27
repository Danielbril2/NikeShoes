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
    
    # Ensure SECRET_KEY is a string
    secret_key = current_app.config['SECRET_KEY']
    if isinstance(secret_key, bytes):
        secret_key = secret_key.decode('utf-8')
    
    token = jwt.encode(
        payload, 
        secret_key,
        algorithm="HS256"
    )
    
    # Convert token to string if it's bytes (PyJWT v1.x returns bytes, v2.x returns str)
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
        print(f"Authorization header: {token}")
        print(f"Header type: {type(token)}")

        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:

            if token.startswith('Bearer '):
                token = token.split('Bearer ')[1]

            print("Step 1 complete")

            try:
                data = jwt.decode(
                    token, 
                    current_app.config['SECRET_KEY'], 
                    algorithms=["HS256"]
                )
                print("Step 2 complete")
            except Exception as e:
                print(f"Error during decode: {str(e)}")
                raise e
            
            try:
                worker_code = data['worker_code']
                print("Step 3 coplete")
            except Exception as e:
                print(f"Error during getting worker code: {str(e)}")
                raise e
            
            # Normal case - verify user exists in database
            try:
                current_user = MongoUserRepository.find_by_worker_code(worker_code)
                print("Step 4 complete")
            except Exception as e:
                print(f"Error during getting user: {str(e)}")
                raise e
            
            if not current_user:
                raise ValueError("User not found")
                        
            try:
                return f(current_user, *args, **kwargs)
            except TypeError as e:
                print(f"Type error with current_user: {str(e)}")
                # Try another format if MongoDB returns a string
                if isinstance(current_user.get('worker_code'), str):
                    worker_code_bytes = current_user['worker_code'].encode('utf-8')
                    return f(worker_code_bytes, *args, **kwargs)

        except Exception as e:
            print(f"Token validation error: {str(e)}")  # Add logging for debugging
            return jsonify({'message': 'Token is invalid'}), 401
        
    return decorated