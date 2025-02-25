from app import db
from app.models.user import User

class UserRepository:
    @staticmethod
    def find_by_worker_code(worker_code):
        return User.query.filter_by(worker_code=worker_code).first()
    
    @staticmethod
    def save(user):
        db.session.add(user)
        db.session.commit()
        return user