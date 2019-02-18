
from flask import Flask
from flask_script import Manager

from app.models import db
from app.order_views import order_blue
from app.user_views import user_blue
from app.home_views import house_blue

app = Flask(__name__)

app.register_blueprint(blueprint=user_blue, url_prefix='/user/')
app.register_blueprint(blueprint=house_blue, url_prefix='/house/')
app.register_blueprint(blueprint=order_blue, url_prefix='/order/')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@127.0.0.1:3306/aj8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


app.secret_key = '123qweasdzxc95da'


manage = Manager(app)

if __name__ == '__main__':
    manage.run()