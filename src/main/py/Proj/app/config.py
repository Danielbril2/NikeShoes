class Config:
    SECRET_KEY = 'YourVeryLongAndSecureSecretKeyThatShouldBeAtLeast256BitsLong'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///nike_shoes.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False