import os
import random
import re
import uuid

from flask import Blueprint, request, render_template, jsonify, session
from flask_login import login_user

from app.models import User
from utils.function import login_required

user_blue = Blueprint('user', __name__)


@user_blue.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user_blue.route('/register/', methods=['POST'])
def my_register():
    # 获取参数
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    passwd = request.form.get('passwd')
    passwd2 = request.form.get('passwd2')
    # 1、验证参数是否都填写了
    if not all([mobile, imagecode, passwd, passwd2]):
        return jsonify({'code': 1001, 'msg': '请填写完整'})
    # 2、验证手机号正确
    if not re.match('^1[3456789]\d{9}$', mobile):
        return jsonify({'code': 1002, 'msg': '手机号不正确'})
    # 3、验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code': 1003, 'msg': '验证码不正确'})
    # 4、密码和确认密码是否一致
    if passwd != passwd2:
        return jsonify({'code': 1004, 'msg': '密码不一致'})
    # 验证手机号是否被注册
    user = User.query.filter_by(phone=mobile).first()
    if user:
        return jsonify({'code': 1005, 'msg': '手机号已被注册'})
    # 创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = passwd
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user_blue.route('/code/', methods=['GET'])
def get_code():
    # 获取验证码
    # 方式1：后端生成图片，并返回验证码图片的地址
    # 方式2：后端只生成随机参数，返回给页面，在页面中生成图片（前端做）
    s = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code': 200, 'msg': '请求成功', 'data': code})


@user_blue.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@user_blue.route('/my_login/', methods=['GET'])
def my_login():
    # 获取提交数据
    phone = request.args.get('phone')
    pwd = request.args.get('pwd')
    # 判断是否有完整的提交数据
    if not all([phone, pwd]):
        return jsonify({'code': 1006, 'msg': '请填写完整'})
    # 通过号码查找数据库中相匹配的数据
    user = User.query.filter(User.phone == phone).first()
    # 校验登陆
    if not user:
        return jsonify({'code': 1007, 'msg': '账号未注册'})
    if not user.check_pwd(pwd):
        return jsonify({'code': 1008, 'msg': '密码错误'})
    # login_user(user)
    # 登陆
    session['user_id'] = user.id
    return jsonify({'code': 200, 'msg': '请求成功'})


@user_blue.route('/my/', methods=['GET'])
@login_required
def my():
    return render_template('my.html')


@user_blue.route('/user_info/', methods=['GET'])
@login_required
def user_info():
    # 获取用户基本信息
    user_id = session['user_id']
    user = User.query.get(user_id)
    return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_basic_dict()})


@user_blue.route('/profile/', methods=['GET'])
@login_required
def profile():
    return render_template('profile.html')


@user_blue.route('/profile/', methods=['PATCH'])
@login_required
def icon_profile():
    icon = request.files.get('avatar')
    name = request.form.get('name')
    if icon:
        # 获取根目录
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 获取媒体图片路径
        STATIC_DIR = os.path.join(BASE_DIR, 'static')
        MEDIA_DIR = os.path.join(STATIC_DIR, 'media')
        # 生成图片名
        filename = str(uuid.uuid4())
        e = icon.mimetype.split('/')[-1:][0]
        icon_name = filename + '.' + e
        # 拼接图片的地址
        path = os.path.join(MEDIA_DIR, icon_name)
        # 保存图片
        icon.save(path)
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.avatar = icon_name
        try:
            user.add_update()
            return jsonify(code=200, msg='上传成功', avatar=user.avatar)
        except:
            return jsonify(code=1011, msg='保存失败')

    if name:
        if User.query.filter(User.name == name).count():
            return jsonify(code=1009, msg='名称已被使用')
        user = User.query.get(session['user_id'])
        user.name = name
        try:
            user.add_update()
            return jsonify(code=1010, msg='保存成功', name=user.name)
        except:
            return jsonify(code=1011, msg='保存失败')


@user_blue.route('/auth/', methods=['GET'])
@login_required
def auth():
    return render_template('auth.html')


@user_blue.route('/auth/', methods=['PATCH'])
@login_required
def my_auth():
    # 获取认证信息
    id_name = request.form.get('real_name')
    id_card = request.form.get('id_card')
    # 检验认证信息是否填写完整
    if not all([id_name, id_card]):
        return jsonify(code=1001, msg='请填写完整')
    if not re.match(r'[\u4E00-\u9FA5]+', id_name):
        return jsonify(code=1002, msg='姓名不符合规范')
    if not re.match(r'[1-9]\d{16}[0-9X]', id_card):
        return jsonify(code=1003, msg='身份证号码不正确')
    user = User.query.get(session['user_id'])
    user.id_name = id_name
    user.id_card = id_card
    try:
        user.add_update()
        return jsonify(code=200, msg='保存成功', data=user.to_auth_dict())
    except:
        return jsonify(code=1004, msg='保存失败')


@user_blue.route('/auth_info/', methods=['GET'])
@login_required
def auth_info():
    # 获取用户基本信息
    user_id = session['user_id']
    user = User.query.get(user_id)
    return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_auth_dict()})


@user_blue.route('/logout/', methods=['GET'])
@login_required
def logout():
    return jsonify(code=200, msg='ok')
