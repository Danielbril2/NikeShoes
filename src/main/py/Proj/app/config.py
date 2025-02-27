class Config:
    SECRET_KEY = 'YourVeryLongAndSecureSecretKeyThatShouldBeAtLeast256BitsLong'

    #MONGO_URI = 'mongodb+srv://danielbril054:BKNz0rb2GIWMwc7w@shoesdb.wu9xu.mongodb.net/?retryWrites=true&w=majority&appName=ShoesDB'
    MONGO_URI = 'mongodb+srv://danielbril054:BKNz0rb2GIWMwc7w@shoesdb.wu9xu.mongodb.net/nike_shoes?retryWrites=true&w=majority'

    #do not need what goes here - but keeping it just in case...
    SQLALCHEMY_DATABASE_URI = 'sqlite:///nike_shoes.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False