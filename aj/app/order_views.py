
from datetime import datetime

from flask import Blueprint, request, render_template, jsonify, session

from app.models import House, Order
from utils.function import login_required

order_blue = Blueprint('order', __name__)


@order_blue.route('/order/', methods=['POST'])
def order():
    house_id = request.form.get('house_id')
    start_date = datetime.strptime(request.form.get('begin_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.form.get('end_date'), '%Y-%m-%d')
    house = House.query.filter(House.id == house_id).first()

    order = Order()
    order.user_id = session['user_id']
    order.house_id = house_id
    order.begin_date = start_date
    order.end_date = end_date
    order.days = (end_date-start_date).days
    order.house_price = house.price
    order.amount = order.days * order.house_price
    order.add_update()
    return jsonify(code=200, msg='ok', data=order.to_dict())


@order_blue.route('/orders/', methods=['GET'])
def orders():
    return render_template('orders.html')


@order_blue.route('/orders_info/', methods=['GET'])
def orders_info():
    orders = Order.query.filter(Order.user_id == session['user_id']).all()
    order_lsit = [order.to_dict() for order in orders]
    return jsonify(code=200, msg='ok', data=order_lsit)


@order_blue.route('/lorders/', methods=['GET'])
def lorders():
    return render_template('lorders.html')


@order_blue.route('/lorders_info/', methods=['GET'])
def lorders_info():
    user_id = session['user_id']
    houses = House.query.filter(House.user_id == session['user_id']).all()
    orders_list = []
    for house in houses:
        orders = Order.query.filter(Order.house_id == house.id).all()
        order_list = [order.to_dict() for order in orders]
        orders_list += order_list
    return jsonify(code=200, msg='ok', data=orders_list)
