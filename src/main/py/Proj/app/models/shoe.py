import enum
from app import db

class ShoeType(enum.Enum):
    Man = "Man"
    Woman = "Woman"
    Children = "Children"

class Shoe(db.Model):
    code = db.Column(db.String(50), primary_key=True)
    loc = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String(100), nullable=True)
    type = db.Column(db.Enum(ShoeType), nullable=True)
    image = db.Column(db.LargeBinary, nullable=True)
    
    def to_dict(self):
        return {
            'code': self.code,
            'loc': self.loc,
            'name': self.name,
            'type': self.type.name if self.type else None,
            'image': self.image if self.image else None
        }