from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)


CORS(app, supports_credentials=True)


@app.route('/api/home', methods=['GET'])
def get_data():
    data = {
        'message': 'Hello, World!'
    }
    return jsonify(data),200

if __name__ == '__main__':
    app.run(debug=True, port=5000)