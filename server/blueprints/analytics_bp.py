from flask import Blueprint, render_template, request, jsonify
from blueprints.utils.analytics_utils import *
from dotenv import load_dotenv
import os
load_dotenv()

analysis_bp = Blueprint('analytics', __name__)

API_URL = "https://onecompiler-apis.p.rapidapi.com/api/v1/run"
API_KEY = os.getenv("RAPIDAPI_KEY")  # Store your API key in an environment variable for security
API_HOST = "onecompiler-apis.p.rapidapi.com"

@analysis_bp.route('/class-analytics', methods=['POST'])
def class_analytics():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        assignment_id = data.get("id")

        if not assignment_id:
            return jsonify({"error": "Missing required fields: 'id'"}), 400

        res = class_analysis(assignment_id)
        if res is None:
            return jsonify({"error": "Error generating result, Most likely due to invalid JSON. Retry!!"}), 123
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@analysis_bp.route('/student-analytics', methods=['POST'])
def student_analytics():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        name = data.get("name")
        assignment_id = data.get("id")

        if not name or not assignment_id:
            return jsonify({"error": "Missing required fields: 'name' or 'id'"}), 400

        res = student_analysis(name, assignment_id)
        if res is None:
            return jsonify({"error": "Error generating results, Most likely due to invalid JSON. Retry!!"}), 123
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
