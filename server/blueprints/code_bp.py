from flask import Blueprint, render_template, request, jsonify
from blueprints.utils.code_utils import *
from dotenv import load_dotenv
import requests
load_dotenv()

code_bp = Blueprint('code', __name__)

API_URL = "https://onecompiler-apis.p.rapidapi.com/api/v1/run"
API_KEY = os.getenv("RAPIDAPI_KEY")  # Store your API key in an environment variable for security
API_HOST = "onecompiler-apis.p.rapidapi.com"

@code_bp.route('/run_code', methods=['POST'])
def run_code():
    data = request.get_json()

    code = data.get('code')
    language = data.get('language')
    stdin = data.get('input', '')  
    question = data.get('question')  

    payload = {
        "language": language,
        "stdin": stdin,
        "files": [
            {
                "name": f"index.{language}",
                "content": code
            }
        ]
    }

    headers = {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
        "Content-Type": "application/json"
    }

    # Make the request to the external API
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response_data = response.json()

        # Check if the external API returned successfully
        if response.status_code == 200 and response_data.get("status") == "success":
            
            correction_response = {
                "Approved": 0,
                "Reason": "Code execution failed",
            }
            if response_data.get("stderr") is None:
                correction_response  = check_code(question, code, response_data.get("stdout"))
                if correction_response is None:
                    return jsonify({"error": "Error generating correction result"}), 123

            return jsonify({
                "status": "success",
                "message": "Code executed successfully",
                "exception": response_data.get("exception", ""),
                "stdout": response_data.get("stdout"),
                "stderr": response_data.get("stderr", ""),
                "executionTime": response_data.get("executionTime"),
                "approved": correction_response["Approved"],
                "reason": correction_response["Reason"],
            })

        else:
            return jsonify({
                "status": "error",
                "message": "Code execution failed",
                "stdout": response_data.get("stdout", ""),
                "stderr": response_data.get("stderr", ""),
                "executionTime": response_data.get("executionTime", 0),
                "approved": 0,
                "reason": "Code execution failed",
            })

    except Exception as e:
        # Catch any exceptions and return error
        return jsonify({
            "status": "error",
            "message": "Server error: " + str(e),
            "stdout": "",
            "stderr": "Server error: " + str(e),
            "executionTime": 0,
            "approved": 0,
            "reason": "Server error",
        })


@code_bp.route("/check", methods=['POST'])
def check():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        ques = data.get("ques")
        code = data.get("code")
        output = data.get("output")

        if not ques or not code:
            return jsonify({"error": "Missing required fields: 'ques' or 'code' or 'output'"}), 400

        res = check_code(ques, code, output)
        if not res:
            return jsonify({"error": "Error generating result"}), 123
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@code_bp.route("/master-ques", methods=['POST'])
def generate_ques():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        objective = data.get("obj")
        number = data.get("no")
        language = data.get("lang")

        if not objective or not number or not language:
            return jsonify({"error": "Missing required fields: 'obj', 'no', or 'lang'"}), 400

        ques = get_lab_questions(objective, number, language)
        if ques is None:
            return jsonify({"error": "Error generating questions, Most likely due to invalid JSON. Retry!!"}), 123
        return jsonify(ques), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@code_bp.route("/follow-ques", methods=['POST'])
def followup_ques():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        ques = data.get("ques")
        code = data.get("code")

        if not ques or not code:
            return jsonify({"error": "Missing required fields: 'ques' or 'code'"}), 400

        followup_question = get_followup_question(ques, code)
        if not followup_question:
            return jsonify({"error": "Error generating follow-up question"}), 123
        return jsonify(followup_question), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@code_bp.route("/hints", methods=['POST'])
def generate_hints():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        ques = data.get("ques")
        code = data.get("code")

        if not ques or not code:
            return jsonify({"error": "Missing required fields: 'ques' or 'code'"}), 400

        hints = get_hint(ques, code)
        if not hints:
            return jsonify({"error": "Error generating hints"}), 123
        return jsonify(hints), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
