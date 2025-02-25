from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_code = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    
    def __init__(self, worker_code, password):
        self.worker_code = worker_code
        self.set_password(password)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def confirm_password(password):
        # can also check if password == 52500219 but its boring
        return check_password_hash(generate_password_hash("52500219"), password)