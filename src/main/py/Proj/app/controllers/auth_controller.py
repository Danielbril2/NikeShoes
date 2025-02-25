from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or 'workerCode' not in data or 'password' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
        
    result, status_code = AuthService.register(
        worker_code=data['workerCode'],
        password=data['password']
    )
    
    return jsonify(result), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'workerCode' not in data or 'password' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    result, status_code = AuthService.login(
        worker_code=data['workerCode'],
        password=data['password']
    )
    
    return jsonify(result), status_code