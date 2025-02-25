from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from app.config import Config

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    from app.controllers.auth_controller import auth_bp
    from app.controllers.shoe_controller import shoe_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(shoe_bp, url_prefix='/main')
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
    return app