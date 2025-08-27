from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.utils import generate_token, verify_token

#!! 创建蓝图
auth_bp = Blueprint('auth', __name__)

#! 健康检查
@auth_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"msg": "APi is healthy now!"})

#! 检查是否有管理员用户
@auth_bp.route('/check-admin', methods=['GET'])
def check_admin():
    #? 检查是否有任何用户
    has_users = User.query.count() > 0
    #? 检查是否有管理员
    has_admin = User.query.filter_by(is_admin=True).first() is not None
    return jsonify({
        'has_users': has_users,
        'has_admin': has_admin
    })

#! 注册
@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    #? 验证输入
    if not data or not all(k in data for k in ('username', 'password', 'email')):
        return jsonify({'error': 'Missing required fields'}), 400
    #? 检查用户名和邮箱是否已存在
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': '用户名已经存在！'}), 400
    # if User.query.filter_by(email=data['email']).first():
    #     return jsonify({'error': '邮箱已经存在！'}), 400
    #? 第一个注册的用户设为管理员
    is_first_user = User.query.count() == 0
    #? 创建新用户0
    new_user = User(
        username=data['username'],
        # password=data['password'],
        email=data['email'],
        is_admin=is_first_user
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'message': '用户创建成功！',
        'user_id': new_user.id,
        'username': new_user.username,
        'user_password': new_user.password,
        'email': new_user.email,
        'is_admin': new_user.is_admin
    }), 201

#! 刷新token
@auth_bp.route('/ref/token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify(
        access_token = new_token
    ), 200


#! 登录
@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    #? 验证输入
    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({'error': '用户名或密码错误！'}), 400
    user = User.query.filter_by(username=data['username']).first()
    #? 验证用户
    if not user or not user.check_password(data['password']):
        return jsonify({'error': '用户名或密码错误！'}), 401
    #? 判断是否为第一个注册用户
    # is_first_user = User.query.count() == 0
    token = generate_token(user.username)
    ref_token = create_refresh_token(identity=user.username)
    return jsonify({
        'message': '登录成功！',
        'user_id': user.id,
        'token': token,
        'ref_toekn': ref_token,
        'username': user.username,
        'is_admin': user.is_admin
    }), 200

#! 删除
@auth_bp.route('/del/account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """删除账号"""
    #? 获取令牌
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    #? 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    #? 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401
    #? 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    #? 删除用户
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'}), 200

#! 修改密码
@auth_bp.route('/change/password', methods=['PUT'])
@jwt_required()
def change_password():
    """修改密码"""
    token = request.headers.get('Authorization')
    data = request.get_json()
    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    #? 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    #? 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401
    #? 验证输入
    if not data or not all(k in data for k in ('old_password', 'new_password')):
        return jsonify({'error': 'Missing old or new password'}), 400
    #? 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    #? 验证旧密码
    if not user.check_password(data['old_password']):
        return jsonify({'error': 'Invalid old password'}), 401
    #? 设置新密码
    user.set_password(data['new_password'])
    db.session.commit()    
    return jsonify({'message': 'Password changed successfully'}), 200
