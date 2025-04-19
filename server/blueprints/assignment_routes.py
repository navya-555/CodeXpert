# routes/assignment_routes.py

from flask import Blueprint, request, jsonify
from models import db, Assignment, Class
from datetime import datetime
import json

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/api/assignments/create', methods=['POST'])
def create_assignment():
    try:
        # Get data from request
        data = request.json
        
        # Extract required fields
        title = data.get('title')
        course_id = data.get('courseId')  # This is the class_id in our database
        questions = int(data.get('questions', 0))
        language = data.get('language', 'English')
        objectives = data.get('objectives', '')
        due_date = data.get('dueDate')
        
        # Validate required fields
        if not all([title, course_id, questions, due_date]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
            
        # Convert objectives string to list for database storage
        objectives_list = [obj.strip() for obj in objectives.split(',') if obj.strip()]
        
        # Parse the date string into a Python date object
        try:
            parsed_date = datetime.strptime(due_date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Invalid date format. Use YYYY-MM-DD.'
            }), 400
            
        # Create new assignment
        new_assignment = Assignment(
            name=title,
            no_ques=questions,
            language=language,
            objective=objectives_list,
            date=parsed_date,
            class_id=course_id
        )
        
        # Add to database
        db.session.add(new_assignment)
        db.session.commit()
        
        # Return success with new assignment data
        return jsonify({
            'success': True,
            'message': 'Assignment created successfully',
            'id': new_assignment.assignment_id,
            'title': new_assignment.name,
            'course': course_id,
            'questions': new_assignment.no_ques,
            'language': new_assignment.language,
            'objectives': new_assignment.objective,
            'dueDate': due_date
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error creating assignment: {str(e)}'
        }), 500