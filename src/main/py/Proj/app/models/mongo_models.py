# app/models/mongo_models.py
import enum
from bson.binary import Binary
from datetime import datetime

class ShoeType(enum.Enum):
    Man = "Man"
    Woman = "Woman"
    Children = "Children"

class MongoShoe:
    @staticmethod
    def from_dict(data):
        """Create a dictionary for MongoDB from input data"""
        shoe_dict = {
            'code': data['code'],
            'loc': data.get('loc'),
            'name': data.get('name'),
            'type': data.get('type'),
            'image': Binary(data['image']) if data.get('image') and isinstance(data['image'], bytes) else data.get('image'),
            'created_at': datetime.utcnow()
        }
        return shoe_dict
    
    @staticmethod
    def to_dict(mongo_doc):
        """Convert MongoDB document to dictionary"""
        return {
            'code': mongo_doc['code'],
            'loc': mongo_doc.get('loc'),
            'name': mongo_doc.get('name'),
            'type': mongo_doc.get('type'),
            'image': mongo_doc.get('image')
        }

class MongoUser:
    @staticmethod
    def from_dict(data, password_hash):
        """Create a dictionary for MongoDB from input data"""
        user_dict = {
            'worker_code': data['worker_code'],
            'password_hash': password_hash,
            'created_at': datetime.utcnow()
        }
        return user_dict