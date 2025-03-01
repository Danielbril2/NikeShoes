import base64
#from app.models.shoe import Shoe, ShoeType
#from app.repositories.shoe_repository import ShoeRepository

from app.models.mongo_models import ShoeType, MongoShoe
from app.repositories.mongo_shoe_repository import MongoShoeRepository


class ShoeService:
    @staticmethod
    def create_shoe_dto(mongo_shoe):
        """Convert a MongoDB shoe document to a DTO with base64 encoded image"""
        image_str = mongo_shoe.get('image') if mongo_shoe.get('image') else None
        return {
            'code': mongo_shoe['code'],
            'loc': mongo_shoe.get('loc'),
            'name': mongo_shoe.get('name'),
            'type': mongo_shoe.get('type'),
            'image': image_str
        }
    
    @staticmethod
    def get_all_shoes():
        """Get all shoes from the database"""
        shoes = MongoShoeRepository.find_all()
        shoes = shoes[0:20]  # robust decision - we do not need to show more than first 20
        print(type(shoes[0]))
        return [ShoeService.create_shoe_dto(shoe) for shoe in shoes]
    
    @staticmethod
    def get_shoe_by_code(code):
        """Get a shoe by its code prefix"""
        # For startswith functionality
        shoes = MongoShoeRepository.find_all()
        filtered = [shoe for shoe in shoes if shoe['code'].startswith(code)]

        if len(filtered) == 0:
            return {'message': 'Shoe not found'}, 404

        return [ShoeService.create_shoe_dto(shoe) for shoe in filtered], 200
    
    @staticmethod
    def get_shoes_by_type(type_name):
        """Get all shoes of a specific type"""
        try:
            shoe_type = ShoeType[type_name]
            shoes = MongoShoeRepository.find_by_type(shoe_type)
            return [ShoeService.create_shoe_dto(shoe) for shoe in shoes], 200
        except KeyError:
            return {'message': 'Invalid shoe type'}, 400

    @staticmethod
    def get_shoes_by_location(location):
        """Get all shoes at a specific location"""
        shoes = MongoShoeRepository.find_by_location(location)
        if not shoes:
            return {'message': 'No shoes found at this location'}, 404
        return [ShoeService.create_shoe_dto(shoe) for shoe in shoes], 200
    
    @staticmethod
    def update_shoe_name(code, name):
        """Update a shoe's name"""
        shoe = MongoShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        MongoShoeRepository.update(code, {'name': name})
        return {'success': True}, 200
    
    @staticmethod
    def update_shoe_location(code, location):
        """Update a shoe's location"""
        shoe = MongoShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        MongoShoeRepository.update(code, {'loc': location})
        return {'success': True}, 200
    
    @staticmethod
    def add_shoe(shoe_data):
        """Add a new shoe to the database"""
        # Check if shoe already exists
        if MongoShoeRepository.find_by_code(shoe_data['code']):
            return {'message': 'Shoe already exists'}, 409
        
        # Process image if provided
        image_bytes = None
        if shoe_data.get('image'):
            try:
                image_bytes = base64.b64decode(shoe_data['image'])
                shoe_data['image'] = image_bytes
            except Exception:
                return {'message': 'Invalid image data'}, 400
        
        # Create new shoe document
        new_shoe = MongoShoe.from_dict(shoe_data)
        
        # Save to database
        MongoShoeRepository.save(new_shoe)
        return {'success': True}, 201

    @staticmethod
    def delete_shoe(code):
        """Delete a shoe from the database by code"""
        shoe = MongoShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        MongoShoeRepository.delete(code)
        return {'success': True, 'message': 'Shoe successfully deleted'}, 200

'''
class ShoeService:
    @staticmethod
    def create_shoe_dto(shoe):
        """Convert a Shoe object to a DTO with base64 encoded image"""
        image_str = base64.b64encode(shoe.image).decode('utf-8') if isinstance(shoe.image, bytes) else shoe.image
        return {
            'code': shoe.code,
            'loc': shoe.loc,
            'name': shoe.name,
            'type': shoe.type.name if shoe.type else None,
            'image': image_str
        }
    
    @staticmethod
    def get_all_shoes():
        """Get all shoes from the database"""
        shoes = ShoeRepository.find_all()
        shoes = shoes[0:20] #robust decision - we do not need to show more than first 20.
        return [ShoeService.create_shoe_dto(shoe) for shoe in shoes]
    
    @staticmethod
    def get_shoe_by_code(code):
        """Get a shoe by its code prefix"""
        shoes = ShoeRepository.find_all()
        filtered = [shoe for shoe in shoes if shoe.code.startswith(code)]

        if len(filtered) == 0:
            return {'message': 'Shoe not found'}, 404

        return [ShoeService.create_shoe_dto(shoe) for shoe in filtered], 200
            
        #return ShoeService.create_shoe_dto(shoe), 200
    
    @staticmethod
    def get_shoes_by_type(type_name):
        """Get all shoes of a specific type"""
        try:
            shoe_type = ShoeType[type_name]
            shoes = ShoeRepository.find_by_type(shoe_type)
            return [ShoeService.create_shoe_dto(shoe) for shoe in shoes], 200
        except KeyError:
            return {'message': 'Invalid shoe type'}, 400

    @staticmethod
    def get_shoes_by_location(location):
        """Get all shoes at a specific location"""
        shoes = ShoeRepository.find_by_location(location)
        if not shoes:
            return {'message': 'No shoes found at this location'}, 404
        return [ShoeService.create_shoe_dto(shoe) for shoe in shoes], 200

    
    @staticmethod
    def update_shoe_name(code, name):
        """Update a shoe's name"""
        shoe = ShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        shoe.name = name
        ShoeRepository.update(shoe)
        return {'success': True}, 200
    
    @staticmethod
    def update_shoe_location(code, location):
        """Update a shoe's location"""
        shoe = ShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        shoe.loc = location
        ShoeRepository.update(shoe)
        return {'success': True}, 200
    
    @staticmethod
    def add_shoe(shoe_data):
        """Add a new shoe to the database"""
        # Check if shoe already exists
        if ShoeRepository.find_by_code(shoe_data['code']):
            return {'message': 'Shoe already exists'}, 409
        
        # Process image if provided
        image_bytes = None
        if shoe_data.get('image'):
            try:
                image_bytes = base64.b64decode(shoe_data['image'])
            except Exception:
                return {'message': 'Invalid image data'}, 400
        
        # Create new shoe object
        new_shoe = Shoe(
            code=shoe_data['code'],
            name=shoe_data.get('name'),
            loc=shoe_data.get('loc'),
            type=shoe_data.get('type'),
            image=image_bytes
        )
        
        # Save to database
        ShoeRepository.save(new_shoe)
        return {'success': True}, 201

    @staticmethod
    def delete_shoe(code):
        """Delete a shoe from the database by code"""
        shoe = ShoeRepository.find_by_code(code)
        if not shoe:
            return {'message': 'Shoe not found'}, 404
            
        ShoeRepository.delete(shoe)
        return {'success': True, 'message': 'Shoe successfully deleted'}, 200
'''