from flask import Blueprint, request, jsonify
from models import db, Class, Assignment, StudentClass  # Adjust import based on your structure
from jwt import decode as jwt_decode, ExpiredSignatureError, InvalidTokenError
from datetime import datetime
from dotenv import load_dotenv
import os


load_dotenv()
JWT_SECRET = os.environ.get('JWT_SECRET')
dashboard_bp = Blueprint('dashboard', __name__)  


@dashboard_bp.route('/api/teacher-dashboard', methods=['GET'])
def get_teacher_dashboard():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization header'}), 401
    
    token = auth_header.split(" ")[1]

    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
        teacher_id = payload.get('sub')
        teacher_name = payload.get('name')
        if not teacher_id:
            return jsonify({'message': 'Invalid token payload'}), 401
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    # Fetch classes taught by the teacher
    classes = Class.query.filter_by(teacher_id=teacher_id).all()

    courses = []
    assignments = []

    for class_ in classes:
        class_assignments = Assignment.query.filter_by(class_id=class_.classid).all()

        courses.append({
            'id': class_.classid,
            'title': class_.classname,
            'lessons': len(class_assignments),
        })

        for assignment in class_assignments:
            assignments.append({
                'id': assignment.assignment_id,
                'title': assignment.name,
                'course': class_.classname,
            })

    return jsonify({
        'name': teacher_name,
        'courses': courses,
        'assignments': assignments
    })

@dashboard_bp.route('/api/student-dashboard', methods=['GET'])
def get_student_dashboard():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization header'}), 401
    
    token = auth_header.split(" ")[1]

    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
        student_id = payload.get('sub')
        student_name = payload.get('name')
        if not student_id:
            return jsonify({'message': 'Invalid token payload'}), 401
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    # Fetch classes taught by the teacher
    classes = StudentClass.query.filter_by(student_id=student_id).all()

    courses = []
    assignments = []

    for class_ in classes:
        class_assignments = Assignment.query.filter_by(class_id=class_.classid).all()

        courses.append({
            'id': class_.classid,
            'title': class_.classname,
            'lessons': len(class_assignments),
        })

        for assignment in class_assignments:
            assignments.append({
                'id': assignment.assignment_id,
                'title': assignment.name,
                'course': class_.classname,
            })

    return jsonify({
        'name': student_name,
        'courses': courses,
        'assignments': assignments
    })
