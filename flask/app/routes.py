from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Shuoshuo, FriendLink
from app.utils import generate_token, verify_token

#!! 创建蓝图
auth_bp = Blueprint('auth', __name__)

#! 健康检查
@auth_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"msg": "APi is healthy now!"})

#! --------------- 用户相关 --------------- #

#! 检查是否有管理员及用户
@auth_bp.route('/check-admin-and-user', methods=['GET'])
def check_admin():
    #? 检查是否有任何用户
    has_users = User.query.count() > 0
    #? 检查是否有管理员
    has_admin = User.query.filter_by(is_admin=True).first() is not None
    return jsonify({
        'success': True,
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
        return jsonify({'error': '缺失必要的字段！'}), 400
    #? 检查用户名和邮箱是否已存在
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': '用户名已经存在！'}), 400
    #? 第一个注册的用户设为管理员
    is_first_user = User.query.count() == 0
    #? 创建新用户0
    new_user = User(
        username=data['username'],
        email=data['email'],
        website=data['website'],
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
        'website': new_user.website,
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
        'username': user.username,
        'password': user.password,
        # "website": user.website,
        'is_admin': user.is_admin,
        'token': token,
        'ref_toekn': ref_token,
    }), 200

#! 删除
@auth_bp.route('/del/account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """删除账号"""
    #? 获取令牌
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': '丢失Token令牌！'}), 401
    #? 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    #? 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': '无效或过期的令牌！'}), 401
    #? 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用户未找到'}), 404
    #? 删除用户
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': '账号删除成功'}), 200

#! 修改密码
@auth_bp.route('/change/password', methods=['PUT'])
@jwt_required()
def change_password():
    """修改密码"""
    token = request.headers.get('Authorization')
    data = request.get_json()
    if not token:
        return jsonify({'error': '丢失Token令牌！'}), 401
    #? 移除Bearer前缀
    if token.startswith('Bearer '):
        token = token[7:]
    #? 验证令牌
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': '无效或过期的令牌！'}), 401
    #? 验证输入
    if not data or not all(k in data for k in ('old_password', 'new_password')):
        return jsonify({'error': '缺失旧密码或新密码'}), 400
    #? 查找用户
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用户未找到'}), 404
    #? 验证旧密码
    if not user.check_password(data['old_password']):
        return jsonify({'error': '旧密码不正确'}), 401
    #? 设置新密码
    user.set_password(data['new_password'])
    db.session.commit()
    return jsonify({'message': '密码修改成功'}), 200

#! --------------- 说说相关 --------------- #

#! 创建
@auth_bp.route('/shuoshuo', methods=['POST'])
def create_shuoshuo():
    """创建说说"""
    data = request.get_json()
    if not data or not all(k in data for k in ('content', 'tags')):
        return jsonify({'error': '缺失必要的字段！'}), 400
    new_shuoshuo = Shuoshuo(
        content=data['content'],
        tags=data['tags'],
    )
    db.session.add(new_shuoshuo)
    db.session.commit()
    return jsonify({
        'message': '说说创建成功！',
        'id': new_shuoshuo.id,
        'content': new_shuoshuo.content,
        'tags': new_shuoshuo.tags,
        'created_at': new_shuoshuo.created_at
    }), 201

#! 获取全部
@auth_bp.route('/shuoshuo', methods=['GET'])
def get_shuoshuo():
    """获取全部说说"""
    shuoshuo_list = Shuoshuo.query.all()
    if not shuoshuo_list:
        return jsonify({'message': '没有说说，可能是您还没有发布说说！',}), 200
    return jsonify([
        {
            'id': item.id,
            'content': item.content,
            'tags': item.tags,
            'created_at': item.created_at
        } for item in shuoshuo_list
    ]), 200

#! 获取单个
@auth_bp.route('/shuoshuo/<int:id>', methods=['GET'])
def get_shuoshuo_by_id(id):
    """获取单个说说"""
    shuoshuo = Shuoshuo.query.get(id)
    if not shuoshuo:
        return jsonify({'message': '说说未找到！'}), 404
    return jsonify({
        'id': shuoshuo.id,
        'content': shuoshuo.content,
        'tags': shuoshuo.tags,
    })

#! 更新
@auth_bp.route('/shuoshuo/<int:id>', methods=['PUT'])
def update_shuoshuo(id):
    """更新说说"""
    shuoshuo = Shuoshuo.query.get(id)
    if not shuoshuo:
        return jsonify({'message': '说说未找到！'}), 404
    data = request.get_json()
    if not data or not all(k in data for k in ('content', 'tags')):
        return jsonify({'error': '缺失必要的字段！'}), 400

#! 删除
@auth_bp.route('/shuoshuo/<int:id>', methods=['DELETE'])
def delete_shuoshuo(id):
    """删除说说"""
    shuoshuo = Shuoshuo.query.get(id)
    if not shuoshuo:
        return jsonify({'message': '说说未找到！'}), 404
    db.session.delete(shuoshuo)
    db.session.commit()
    return jsonify({'message': '说说删除成功！'}), 200

#!! --------------- 友链相关 --------------- #

#! 检测友链连通
# def check_friendlink(url):
    # """检查友链"""
