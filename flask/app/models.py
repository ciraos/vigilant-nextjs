from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

#! 用户模型
class User(db.Model):
    id          = db.Column(db.Integer,     primary_key=True)
    nickname    = db.Column(db.String(64),  unique=True,    nullable=False)
    username    = db.Column(db.String(64),  unique=True,    nullable=False)
    password    = db.Column(db.String(128),                 nullable=False)
    avatar      = db.Column(db.String(120), unique=False,   nullable=True)
    email       = db.Column(db.String(120), unique=True,    nullable=True)
    website     = db.Column(db.String(120), unique=False,   nullable=True)
    is_admin    = db.Column(db.Boolean,     default=False)
    created_at  = db.Column(db.DateTime,    default=datetime.utcnow)

    def set_password(self, password):
        """设置密码哈希"""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password, password)

#! 说说模型
class Shuoshuo(db.Model):
    id          = db.Column(db.Integer,     primary_key=True)
    content     = db.Column(db.Text,        nullable=False)
    tags        = db.Column(db.String(64),  nullable=True)
    created_at  = db.Column(db.DateTime,    default=datetime.utcnow)

#! 友链模型
class FriendLink(db.Model):
    id          = db.Column(db.Integer,     primary_key=True)
    name        = db.Column(db.String(64),  nullable=False, unique=True)
    url         = db.Column(db.String(120), nullable=False)
    avatar      = db.Column(db.String(120), nullable=True)
    descr       = db.Column(db.Text,        nullable=True)

#! 日记模型
class Note(db.Model):
    id          = db.Column(db.Integer,     primary_key=True)
    title       = db.Column(db.String(64),  nullable=False)
    content     = db.Column(db.Text,        nullable=False)
    tags        = db.Column(db.String(64),  nullable=False)
    author      = db.Column(db.String(10),  nullable=False)
    created_at  = db.Column(db.DateTime,    default=datetime.utcnow)
