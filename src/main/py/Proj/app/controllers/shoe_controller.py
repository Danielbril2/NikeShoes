from flask import Blueprint, request, jsonify
from app.services.shoe_service import ShoeService
from app.utils.jwt_utils import token_required

shoe_bp = Blueprint('shoe', __name__)

@shoe_bp.route('/getAllShoes', methods=['GET'])
@token_required
def get_all_shoes(current_user):
    shoes = ShoeService.get_all_shoes()
    return jsonify(shoes)

@shoe_bp.route('/getShoe/code/<code>', methods=['GET'])
@token_required
def get_shoe_by_code(current_user, code):
    result, status_code = ShoeService.get_shoe_by_code(code)
    return jsonify(result), status_code

@shoe_bp.route('/getShoe/type/<type>', methods=['GET'])
@token_required
def get_shoes_by_type(current_user, type):
    result, status_code = ShoeService.get_shoes_by_type(type)
    return jsonify(result), status_code

@shoe_bp.route('/getShoe/location/<int:location>', methods=['GET'])
@token_required
def get_shoes_by_location(current_user, location):
    result, status_code = ShoeService.get_shoes_by_location(location)
    return jsonify(result), status_code

@shoe_bp.route('/updateShoe/updateName', methods=['POST'])
@token_required
def update_shoe_name(current_user):
    data = request.get_json()
    
    if not data or 'code' not in data or 'name' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
        
    result, status_code = ShoeService.update_shoe_name(
        code=data['code'],
        name=data['name']
    )
    
    return jsonify(result), status_code

@shoe_bp.route('/updateShoe/updateLoc', methods=['POST'])
@token_required
def update_shoe_location(current_user):
    data = request.get_json()
    
    if not data or 'code' not in data or 'loc' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
        
    result, status_code = ShoeService.update_shoe_location(
        code=data['code'],
        location=data['loc']
    )
    
    return jsonify(result), status_code

@shoe_bp.route('/updateShoe/addShoe', methods=['POST'])
@token_required
def add_shoe(current_user):
    shoe_data = request.get_json()

    print("TEST")
    
    if not shoe_data or 'code' not in shoe_data:
        return jsonify({'message': 'Missing required fields'}), 400
        
    result, status_code = ShoeService.add_shoe(shoe_data)
    return jsonify(result), status_code

@shoe_bp.route('/deleteShoe/<code>', methods=['DELETE'])
@token_required
def delete_shoe(current_user, code):
    result, status_code = ShoeService.delete_shoe(code)
    return jsonify(result), status_code