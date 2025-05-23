from flask import Blueprint, request, jsonify
from models import Question, Assignment,db
from blueprints.utils.auth_utils import decode_auth_header
from blueprints.utils.code_utils import get_lab_questions, get_followup_question
import json
import ast
from jwt import decode as jwt_decode
from dotenv import load_dotenv
import os


load_dotenv()
JWT_SECRET = os.environ.get('JWT_SECRET')
playground_bp = Blueprint('playground', __name__)

@playground_bp.route('/api/get-parent-question', methods=['POST'])
def parent_question():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization header'}), 401
    
    token = auth_header.split(" ")[1]

    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
    except Exception as e:
        print(f"Token decoding error: {e}")
        return jsonify({'message': 'Invalid token'}), 401

    student_id = payload.get('sub')

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    assgnment_id = data.get("id")

    try:
        questions = Question.query.filter_by(assignment_id=assgnment_id,student_id = student_id).all()

        if not questions:
            assignment = Assignment.query.filter_by(assignment_id=assgnment_id).first()
            objective = assignment.objective
            no_ques = assignment.no_ques
            language = assignment.language

            generated_data = get_lab_questions(objective, no_ques, language)
            # if generated_data is None:
            #     return jsonify({"error": "Error generating questions, Most likely due to invalid JSON. Retry!!"}), 123
            # for q in generated_data['questions']:
            #     question = Question(
            #         assignment_id=assgnment_id,
            #         student_id=student_id,
            #         parent_question=str(q),  # Store as stringified JSON
            #         parent_att=1,
            #         followup_att=1
            #     )
            #     db.session.add(question)

            # db.session.commit()
            return jsonify({
                'questions': generated_data['questions']
            }), 200
        else:
            return jsonify({
                'questions': [ast.literal_eval(question.parent_question) for question in questions]
            }), 200


    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({'message': 'Error fetching questions'}), 500


@playground_bp.route('/api/get-followup-question', methods=['POST'])
def followup_question():
    data = request.get_json()
    parent_question = data.get('parent_question')
    code = data.get('code')

    student_id = 'cd456'
    assignment_id = 'abcd1'

    followup_question = get_followup_question(parent_question, code)
    if followup_question is None:
        return jsonify({"error": "Error generating follow-up question"}), 123
    return jsonify({'followup_question': followup_question}), 200
    
    # try:
    #     question = Question.query.filter_by(assignment_id=assignment_id,student_id = student_id).first()
    #     if question:
    #         if question.followup_question is not None:
    #             return jsonify({'followup_question': question.followup_question}), 200
            
    #         followup_question = get_followup_question(parent_question, code)
    #         if followup_question is None:
    #             return jsonify({"error": "Error generating follow-up question"}), 123
    #         print(followup_question)
    #         question.followup_question = str(followup_question)
    #         db.session.commit()
    #         return jsonify({'followup_question': followup_question}), 200
    #     else:
    #         return jsonify({'error': 'Parent question not found'}), 404
    # except Exception as e:
    #     print(f"Error generating follow-up question: {e}")
    #     return jsonify({'error': 'Error generating follow-up question'}), 500