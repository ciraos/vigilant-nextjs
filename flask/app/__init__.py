from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config

# 初始化数据库
db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)
    
    # 初始化扩展
    db.init_app(app)
    
    # 注册蓝图
    from app.routes import auth_bp
    app.register_blueprint(auth_bp) # url_prefix='/api'

    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app
