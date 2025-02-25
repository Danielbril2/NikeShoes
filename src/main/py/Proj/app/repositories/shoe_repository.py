from app import db
from app.models.shoe import Shoe, ShoeType

class ShoeRepository:
    @staticmethod
    def find_all():
        return Shoe.query.all()
    
    @staticmethod
    def find_by_code(code):
        return Shoe.query.filter_by(code=code).first()
    
    @staticmethod
    def find_by_type(shoe_type):
        return Shoe.query.filter_by(type=shoe_type).all()
    
    @staticmethod
    def save(shoe):
        db.session.add(shoe)
        db.session.commit()
        return shoe

    @staticmethod
    def find_by_location(location):
        return Shoe.query.filter_by(loc=location).all()
    
    @staticmethod
    def update(shoe):
        db.session.commit()
        return shoe

    @staticmethod
    def delete(shoe):
        db.session.delete(shoe)
        db.session.commit()