from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Shuoshuo, FriendLink
from app.utils import generate_token, verify_token
from datetime import timedelta
import logging

#! 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#! 创建蓝图
auth_bp = Blueprint('auth', __name__)

#! 健康检查
@auth_bp.route('/health', methods=['GET'])
def health_check():
    """API健康检查接口"""
    return jsonify({"msg": "API is healthy now!"}), 200

#! ------------------- 用户相关路由 ------------------- #

@auth_bp.route('/check-admin', methods=['GET'])
def check_admin():
    """检查是否存在管理员用户"""
    try:
        has_users = User.query.count() > 0
        has_admin = User.query.filter_by(is_admin=True).first() is not None
        return jsonify({
            'has_users': has_users,
            'has_admin': has_admin
        }), 200
    except Exception as e:
        logger.error(f"检查管理员时出错: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册接口"""
    try:
        data = request.get_json()
        #? 验证输入
        required_fields = ['username', 'password', 'email']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': '缺失必要的字段！'}), 400
        #? 检查用户名是否已存在
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': '用户名已经存在！'}), 400
        #? 检查邮箱是否已存在
        # if User.query.filter_by(email=data['email']).first():
        #     return jsonify({'error': '邮箱已经存在！'}), 400
        #? 第一个注册的用户设为管理员
        is_first_user = User.query.count() == 0
        #? 创建新用户
        new_user = User(
            username=data['username'],
            email=data['email'],
            website=data.get('website', ''),  #? 可选字段
            avatar=data.get('avatar', ''),    #? 可选字段
            is_admin=is_first_user
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        logger.info(f"新用户注册: {data['username']}")
        return jsonify({
            'message': '用户创建成功！',
            'user_id': new_user.id,
            'username': new_user.username,
            'is_admin': new_user.is_admin
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"注册失败: {str(e)}")
        return jsonify({'error': '注册过程中发生错误'}), 500

@auth_bp.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    """刷新访问令牌"""
    try:
        current_user = get_jwt_identity()
        new_token = create_access_token(
            identity=current_user,
            expires_delta=timedelta(hours=1)
        )
        return jsonify(access_token=new_token), 200
    except Exception as e:
        logger.error(f"刷新令牌失败: {str(e)}")
        return jsonify({'error': '令牌刷新失败'}), 401

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录接口"""
    try:
        data = request.get_json()
        
        # 验证输入
        if not data or not all(k in data for k in ('username', 'password')):
            return jsonify({'error': '请提供用户名和密码！'}), 400
            
        user = User.query.filter_by(username=data['username']).first()
        
        # 验证用户
        if not user or not user.check_password(data['password']):
            logger.warning(f"登录失败: 用户名或密码错误 - {data['username']}")
            return jsonify({'error': '用户名或密码错误！'}), 401
        
        # 生成令牌，设置过期时间
        token = generate_token(user.username)
        ref_token = create_refresh_token(
            identity=user.username,
            expires_delta=timedelta(days=7)
        )
        
        logger.info(f"用户登录成功: {user.username}")
        return jsonify({
            'message': '登录成功！',
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_admin,
            'token': token,
            'ref_token': ref_token,
        }), 200
        
    except Exception as e:
        logger.error(f"登录过程出错: {str(e)}")
        return jsonify({'error': '登录过程中发生错误'}), 500

@auth_bp.route('/account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """删除账号接口"""
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        
        if not user:
            return jsonify({'error': '用户未找到'}), 404
            
        # 删除用户相关数据
        Shuoshuo.query.filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        
        logger.info(f"用户账号已删除: {current_user}")
        return jsonify({'message': '账号删除成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"删除账号失败: {str(e)}")
        return jsonify({'error': '删除账号过程中发生错误'}), 500

@auth_bp.route('/password', methods=['PUT'])
@jwt_required()
def change_password():
    """修改密码接口"""
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # 验证输入
        if not data or not all(k in data for k in ('old_password', 'new_password')):
            return jsonify({'error': '缺失旧密码或新密码'}), 400
            
        # 查找用户
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({'error': '用户未找到'}), 404
            
        # 验证旧密码
        if not user.check_password(data['old_password']):
            logger.warning(f"密码修改失败: 旧密码错误 - {current_user}")
            return jsonify({'error': '旧密码不正确'}), 401
            
        # 验证新密码强度（简单示例）
        if len(data['new_password']) < 6:
            return jsonify({'error': '新密码长度不能少于6个字符'}), 400
            
        # 设置新密码
        user.set_password(data['new_password'])
        db.session.commit()
        
        logger.info(f"用户密码已修改: {current_user}")
        return jsonify({'message': '密码修改成功'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"修改密码失败: {str(e)}")
        return jsonify({'error': '修改密码过程中发生错误'}), 500

#! ------------------- 说说相关路由 ------------------- #

@auth_bp.route('/shuoshuo', methods=['POST'])
@jwt_required()
def create_shuoshuo():
    """创建说说接口"""
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({'error': '缺失内容'}), 400
            
        new_shuoshuo = Shuoshuo(
            content=data['content'],
            tags=data.get('tags', []),
            user_id=user.id
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
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"创建说说失败: {str(e)}")
        return jsonify({'error': '创建说说过程中发生错误'}), 500

@auth_bp.route('/shuoshuo', methods=['GET'])
def get_all_shuoshuo():
    """获取全部说说"""
    try:
        # 支持分页
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        pagination = Shuoshuo.query.order_by(Shuoshuo.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        shuoshuo_list = pagination.items
        
        if not shuoshuo_list and page == 1:
            return jsonify({'message': '没有说说！'}), 404
            
        return jsonify({
            'shuoshuo': [
                {
                    'id': s.id,
                    'content': s.content,
                    'tags': s.tags,
                    'created_at': s.created_at,
                    'username': s.user.username if s.user else '未知用户'
                } for s in shuoshuo_list
            ],
            'pagination': {
                'total': pagination.total,
                'pages': pagination.pages,
                'page': page,
                'per_page': per_page,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        logger.error(f"获取说说列表失败: {str(e)}")
        return jsonify({'error': '获取说说列表时发生错误'}), 500

@auth_bp.route('/shuoshuo/<int:id>', methods=['GET'])
def get_shuoshuo_by_id(id):
    """根据ID获取说说"""
    try:
        shuoshuo = Shuoshuo.query.get_or_404(id)
        
        return jsonify({
            'id': shuoshuo.id,
            'content': shuoshuo.content,
            'tags': shuoshuo.tags,
            'created_at': shuoshuo.created_at,
            'username': shuoshuo.user.username if shuoshuo.user else '未知用户'
        }), 200
        
    except Exception as e:
        logger.error(f"获取说说 {id} 失败: {str(e)}")
        return jsonify({'error': '获取说说时发生错误'}), 500

@auth_bp.route('/shuoshuo/<int:id>', methods=['PUT'])
@jwt_required()
def update_shuoshuo(id):
    """更新说说"""
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        shuoshuo = Shuoshuo.query.get_or_404(id)
        
        # 检查权限：只有作者或管理员可以修改
        if shuoshuo.user_id != user.id and not user.is_admin:
            return jsonify({'error': '没有权限修改此说说'}), 403
            
        data = request.get_json()
        if 'content' in data:
            shuoshuo.content = data['content']
        if 'tags' in data:
            shuoshuo.tags = data['tags']
            
        db.session.commit()
        
        return jsonify({'message': '说说更新成功！'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"更新说说 {id} 失败: {str(e)}")
        return jsonify({'error': '更新说说时发生错误'}), 500

@auth_bp.route('/shuoshuo/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_shuoshuo(id):
    """删除说说"""
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        shuoshuo = Shuoshuo.query.get_or_404(id)
        #? 检查权限：只有作者或管理员可以删除
        if shuoshuo.user_id != user.id and not user.is_admin:
            return jsonify({'error': '没有权限删除此说说'}), 403
        db.session.delete(shuoshuo)
        db.session.commit()
        return jsonify({'message': '说说删除成功！'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"删除说说 {id} 失败: {str(e)}")
        return jsonify({'error': '删除说说时发生错误'}), 500

#! ------------------- 友链相关 ------------------- #

@auth_bp.route('/friends', methods=['POST'])
@jwt_required()
def create_friends():
    """创建友链"""
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        #? 只有管理员可以创建友链
        if not user.is_admin:
            return jsonify({'error': '没有权限创建友链'}), 403
        data = request.get_json()
        required_fields = ['name', 'url']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': '缺失名称或链接'}), 400
        #? 检查友链是否已存在
        if FriendLink.query.filter_by(url=data['name']).first():
            return jsonify({'error': '该链接已存在'}), 400
        new_friendlink = FriendLink(
            name=data['name'],
            url=data['url'],
            avatar=data.get('avatar', ''),
            descr=data.get('descr', '')
        )
        db.session.add(new_friendlink)
        db.session.commit()
        return jsonify({
            'message': '友链创建成功！',
            'id': new_friendlink.id,
            'name': new_friendlink.name,
            'url': new_friendlink.url,
            'avatar': new_friendlink.avatar,
            'descr': new_friendlink.descr
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"创建友链失败: {str(e)}")
        return jsonify({'error': '创建友链过程中发生错误'}), 500

@auth_bp.route('/friends', methods=['GET'])
def get_friends():
    """获取全部友链"""
    try:
        friend_links = FriendLink.query.all()
        if not friend_links:
            return jsonify({'message': '没有友链！'}), 404
        return jsonify([
            {
                'id': fl.id,
                'name': fl.name,
                'url': fl.url,
                'avatar': fl.avatar,
                'descr': fl.descr
            } for fl in friend_links
        ]), 200
    except Exception as e:
        logger.error(f"获取友链失败: {str(e)}")
        return jsonify({'error': '获取友链时发生错误'}), 500
