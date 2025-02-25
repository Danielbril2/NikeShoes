# app/repositories/mongo_user_repository.py
from app import mongo

class MongoUserRepository:
    @staticmethod
    def find_by_worker_code(worker_code):
        return mongo.db.users.find_one({'worker_code': worker_code})
    
    @staticmethod
    def save(user_dict):
        return mongo.db.users.insert_one(user_dict)