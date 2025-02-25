# app/repositories/mongo_shoe_repository.py
from app import mongo
from bson.binary import Binary

class MongoShoeRepository:
    @staticmethod
    def find_all():
        return list(mongo.db.shoes.find())
    
    @staticmethod
    def find_by_code(code):
        return mongo.db.shoes.find_one({'code': code})
    
    @staticmethod
    def find_by_type(shoe_type):
        return list(mongo.db.shoes.find({'type': shoe_type.name}))
    
    @staticmethod
    def find_by_location(location):
        return list(mongo.db.shoes.find({'loc': location}))
    
    @staticmethod
    def save(shoe_dict):
        return mongo.db.shoes.insert_one(shoe_dict)
    
    @staticmethod
    def update(code, update_data):
        return mongo.db.shoes.update_one({'code': code}, {'$set': update_data})
    
    @staticmethod
    def delete(code):
        return mongo.db.shoes.delete_one({'code': code})