from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

# from flask_sqlalchemy import SQLAlchemy

from app.config import Config

# Initialize SQLAlchemy
#db = SQLAlchemy()
mongo = PyMongo()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    #db.init_app(app)
    mongo.init_app(app)

    with app.app_context():
        try:
            # Test MongoDB connection
            mongo.db.command('ping')
            print("MongoDB connection successful!")
            print(f"Available collections: {mongo.db.list_collection_names()}")
        except Exception as e:
            print(f"MongoDB connection failed: {str(e)}")
    
    # Register blueprints
    from app.controllers.auth_controller import auth_bp
    from app.controllers.shoe_controller import shoe_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(shoe_bp, url_prefix='/main')
        
    return app