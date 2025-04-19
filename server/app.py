from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db
from flask_migrate import Migrate
from blueprints.auth_bp import auth_bp
from blueprints.code_bp import code_bp
from blueprints.dashboard_bp import dashboard_bp
from blueprints.course_routes import courses_bp
from blueprints.assignment_routes import assignment_bp


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

CORS(app, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(code_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(assignment_bp)


@app.route('/api/home', methods=['GET'])
def get_data():
    data = {
        'message': 'Hello, World!'
    }
    return jsonify(data),200

if __name__ == '__main__':
    app.run(debug=True, port=5000)