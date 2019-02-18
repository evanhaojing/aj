
import os
from datetime import datetime

from flask import Blueprint, request, render_template, jsonify, session

from app.models import User, House, Facility, Area, HouseImage, Order
from utils.function import login_required

house_blue = Blueprint('house', __name__)


@house_blue.route('/myhouse/', methods=['GET'])
@login_required
def myhouse():
    return render_template('myhouse.html')


@house_blue.route('/my_house/', methods=['GET'])
@login_required
def my_house():
    user = User.query.get(session['user_id'])
    if user.id_card:
        houses = House.query.filter(House.user_id == user.id).all()
        houses_list = [house.to_dict() for house in houses]
        return jsonify(code=200, msg='请求成功', data=houses_list)
    else:
        return jsonify(code=1001, msg='请先实名认证')


@house_blue.route('/newhouse/', methods=['GET'])
@login_required
def newhouse():
    return render_template('newhouse.html')


@house_blue.route('/new_house/', methods=['POST'])
@login_required
def new_house():
    title = request.form.get('title')
    price = request.form.get('price')
    area_id = request.form.get('area_id')
    address = request.form.get('address')
    room_count = request.form.get('room_count')
    acreage = request.form.get('acreage')
    unit = request.form.get('unit')
    capacity = request.form.get('capacity')
    beds = request.form.get('beds')
    deposit = request.form.get('deposit')
    min_days = request.form.get('min_days')
    max_days = request.form.get('max_days')
    facilities = request.form.getlist('facility')
    if not all([title, price, area_id, address, room_count, acreage, unit, capacity, beds,
                deposit, min_days, max_days, facilities]):
        return jsonify(code=1001, msg='请填写完整的参数')
    house = House()
    house.user_id = session['user_id']
    house.title = title
    house.price = price
    house.area_id = area_id
    house.address = address
    house.room_count = room_count
    house.acreage = acreage
    house.unit = unit
    house.capacity = capacity
    house.beds = beds
    house.deposit = deposit
    house.min_days = min_days
    house.max_days = max_days
    if facilities:
        for facility_id in facilities:
            facility = Facility.query.get(facility_id)
            house.facilities.append(facility)
    house.add_update()
    return jsonify(code=200, msg='保存成功', data=house.to_full_dict())


@house_blue.route('/area_facilities/', methods=['GET'])
def area_facilities():
    areas = Area.query.all()
    facilities = Facility.query.all()
    area_info = [area.to_dict() for area in areas]
    facility_info = [facility.to_dict() for facility in facilities]
    return jsonify(code=200, msg='请求成功', area=area_info, facility=facility_info)


@house_blue.route('/house_image/', methods=['POST'])
def house_image():
    images = request.files.get('house_image')
    house_id = request.form.get('house_id')
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    upload_dir = os.path.join(os.path.join(os.path.join(BASE_DIR, 'static'), 'media'), 'upload')
    url = os.path.join(upload_dir, images.filename)
    images.save(url)
    house_image = HouseImage()
    house_image.house_id = house_id
    images_url = os.path.join('/upload/', images.filename)
    house_image.url = images_url
    house_image.add_update()
    # 创建房屋首图
    house = House.query.get(house_id)
    if not house.index_image_url:
        house.index_image_url = images_url
        house.add_update()
    return jsonify(code=200, msg='保存成功', images_url=images_url)


@house_blue.route('/detail/', methods=['GET'])
def detail():
    return render_template('detail.html')


@house_blue.route('/detail_info/<int:id>/', methods=['GET'])
def detail_info(id):
    house = House.query.filter(House.id == id).first()
    return jsonify(code=200, msg='ok', data=house.to_full_dict())


@house_blue.route('/booking/', methods=['GET'])
def booking():
    return render_template('booking.html')


@house_blue.route('/booking_info/', methods=['GET'])
def booking_info():
    id = request.args.get('id')
    house = House.query.filter(House.id == id).first()
    return jsonify(code=200, msg='ok', house=house.to_dict())


@house_blue.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


@house_blue.route('/index_info/', methods=['GET'])
def index_info():
    user_id = session['user_id']
    user = User.query.filter(User.id == User).first()
    return jsonify(code=200, msg='ok', data=user.to_basic_dict())
