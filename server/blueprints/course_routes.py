from flask import Blueprint, request, jsonify
from models import db, Class, Teacher, StudentClass, Student
from jwt import decode as jwt_decode, ExpiredSignatureError, InvalidTokenError

from dotenv import load_dotenv
import os

load_dotenv()
JWT_SECRET = os.environ.get('JWT_SECRET')

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/api/courses/create', methods=['POST'])
def create_course():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization header'}), 401
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
        teacher_id = payload.get('sub')
        if not teacher_id:
            return jsonify({'message': 'Invalid token payload'}), 401
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title'):
        return jsonify({'message': 'Course name is required'}), 400
    
    try:
        # Create new class (course)
        new_class = Class(
            classname=data.get('title'),
            teacher_id=teacher_id
        )
        
        # Save to database
        db.session.add(new_class)
        db.session.commit()
        
        # Return the created course
        return jsonify({
            'message': 'Course created successfully',
            'id': new_class.classid,
            'title': new_class.classname
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create course: {str(e)}'}), 500

@courses_bp.route('/api/courses/join', methods=['POST'])
def join_course():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization header'}), 401
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
        student_id = payload.get('sub')
        if not student_id:
            return jsonify({'message': 'Invalid token payload'}), 401
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    
    data = request.get_json()
    course_id = data.get('course_id')
    
    # Validate required fields
    if not course_id:
        return jsonify({'message': 'Course ID is required'}), 400
    
    # Check if course exists
    course = Class.query.filter_by(classid=course_id).first()
    if not course:
        return jsonify({'message': 'Course not found'}), 404
    
    # Check if student is already enrolled in this course
    existing_enrollment = StudentClass.query.filter_by(
        student_id=student_id, 
        class_id=course_id
    ).first()
    
    if existing_enrollment:
        return jsonify({'message': 'You are already enrolled in this course'}), 400
    
    try:
        # Create new enrollment
        new_enrollment = StudentClass(
            student_id=student_id,
            class_id=course_id
        )
        
        # Save to database
        db.session.add(new_enrollment)
        db.session.commit()
        
        # Return success message
        return jsonify({
            'message': 'Successfully joined course',
            'course_title': course.classname  # Using classname as title based on your create route
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to join course: {str(e)}'}), 500