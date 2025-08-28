from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    id          = db.Column(db.Integer,     primary_key=True)
    username    = db.Column(db.String(64),  unique=True,    nullable=False)
    password    = db.Column(db.String(128),                 nullable=False)
    email       = db.Column(db.String(120), unique=True,    nullable=True)
    website     = db.Column(db.String(120), unique=True,    nullable=True)
    is_admin    = db.Column(db.Boolean,     default=False)
    created_at  = db.Column(db.DateTime,    default=datetime.utcnow)
    
    def set_password(self, password):
        """设置密码哈希"""
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password, password)
