# migrate_to_mongo.py
import sqlite3
import base64
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os

# Connect to MongoDB
mongo_uri = os.environ.get(
    'MONGO_URI', 
    'mongodb+srv://danielbril054:BKNz0rb2GIWMwc7w@shoesdb.wu9xu.mongodb.net/nike_shoes?retryWrites=true&w=majority&appName=ShoesDB'
)
client = MongoClient(mongo_uri)
db = client.get_database()

# Connect to SQLite
sqlite_db_path = r"C:\Users\yuval yael\Desktop\NikeShoes\src\main\py\Proj\instance\nike_shoes.db"  # Use raw string with r prefix on Windows
if not os.path.exists(sqlite_db_path):
    print(f"Error: Database file not found at {sqlite_db_path}")
    exit(1)

conn = sqlite3.connect(sqlite_db_path)
conn.row_factory = sqlite3.Row

# Migrate Shoes
c = conn.cursor()
'''
c.execute('SELECT * FROM shoe')
shoes = c.fetchall()

for shoe in shoes:
    shoe_dict = {
        'code': shoe['code'],
        'loc': shoe['loc'],
        'name': shoe['name'],
        'type': shoe['type'],
        'image': base64.b64encode(shoe['image']).decode('utf-8') if shoe['image'] else None
    }
    db.shoes.insert_one(shoe_dict)
'''
# Migrate Users
c.execute('SELECT * FROM user')
users = c.fetchall()

for user in users:
    user_dict = {
        'worker_code': user['worker_code'],
        'password_hash': user['password_hash']
    }
    db.users.insert_one(user_dict)

conn.close()
print("Migration completed successfully!")