import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_token(user_id):
    """生成JWT令牌"""
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),  # 1天有效期
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

def verify_token(token):
    """验证JWT令牌"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
