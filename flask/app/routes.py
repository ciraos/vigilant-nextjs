from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token, create_refresh_token
from app import db
from app.models import User
from app.utils import generate_token, verify_token

# 创建蓝图
auth_bp = Blueprint('auth', __name__)

#!
@auth_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"msg": "APi is healthy now!"})

#!
@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    
    # 验证输入
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400

    # 检查用户名和邮箱是否已存在
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # 第一个注册的用户设为管理员
    is_first_user = User.query.count() == 0
    
    # 创建新用户
    user = User(
        username=data['username'],
        email=data['email'],
        is_admin=is_first_user
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully',
        'user_id': user.id,
        'is_admin': user.is_admin
    }), 201

#! login
@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400
    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = generate_token(user.id)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user_id': user.id,
        'is_admin': user.is_admin
    }), 200

#!
@auth_bp.route('/del/account', methods=['DELETE'])
def delete_account():
    """删除账号"""
    # 获取令牌
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    # 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    
    # 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    # 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 删除用户
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'Account deleted successfully'}), 200

#!
@auth_bp.route('/change/password', methods=['PUT'])
def change_password():
    """修改密码"""
    token = request.headers.get('Authorization')
    data = request.get_json()
    
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    
    # 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    
    # 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    # 验证输入
    if not data or not all(k in data for k in ('old_password', 'new_password')):
        return jsonify({'error': 'Missing old or new password'}), 400
    
    # 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # 验证旧密码
    if not user.check_password(data['old_password']):
        return jsonify({'error': 'Invalid old password'}), 401
    
    # 设置新密码
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
