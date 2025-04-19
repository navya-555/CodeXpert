from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt
from datetime import datetime, timezone, timedelta
from models import Teacher, Student, db

load_dotenv()

auth_bp = Blueprint('auth', __name__)


GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
JWT_SECRET = os.environ.get('JWT_SECRET')


@auth_bp.route('/api/auth/google-login', methods=['POST'])
def google_login():
    try:
        request_data = request.get_json()
        id_token_jwt = request_data.get('id_token')
        user_type = request_data.get('user_type')

        if not id_token_jwt:
            return jsonify({'message': 'ID token is missing'}), 400

        if not GOOGLE_CLIENT_ID:
            return jsonify({'message': 'Google Client ID not configured'}), 500

        # Verify Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                id_token_jwt,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return jsonify({'message': 'Invalid token issuer'}), 401

            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')

            # Check if user exists in DB
            user = None
            if user_type == 'teacher':
                user = Teacher.query.filter_by(email=email).first()
                if not user:
                    user = Teacher(name=name, email=email, profile=picture)
                    db.session.add(user)
                    db.session.commit()
            elif user_type == 'student':
                user = Student.query.filter_by(email=email).first()
                if not user:
                    user = Student(name=name, email=email, profile=picture)
                    db.session.add(user)
                    db.session.commit()
            else:
                return jsonify({'message': 'Invalid user type'}), 400

            # Create our own app token
            token_payload = {
                'sub': user.userid,
                'email': email,
                'name': name,
                'user_type': user_type,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }
            token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')

            return jsonify({
                'token': token,
                'user': {
                    'userid': user.userid,
                    'email': user.email,
                    'name': user.name,
                    'picture': user.profile,
                    'user_type': user_type
                }
            }), 200

        except ValueError as e:
            return jsonify({'message': f'Invalid token: {str(e)}'}), 401

    except Exception as e:
        print("Login exception:", e)
        return jsonify({'message': 'Server error during login'}), 500