import google.generativeai as genai
import re
import json
import os
from dotenv import load_dotenv
import anthropic
load_dotenv()

genai.configure(api_key=os.environ['GEMINI-API'])
client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC-API'])

model = genai.GenerativeModel('gemini-1.5-flash')

def clean_json_response(raw_text):
    # Strip ```json ... ``` or ``` ... ``` blocks if they exist
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip())
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned

def get_lab_questions(objectives: list[str], no: int, lang: str):
    formatted_objectives = "\n".join([f"{i+1}. {obj}" for i, obj in enumerate(objectives)])
    prompt = f"""
        You are a programming instructor generating structured lab questions.
        
        Generate exactly {no} structured programming questions in {lang} that cover the objectives given below:.
        Some questions can cover more than one objective, but make sure each objective is covered in at least one question. The questions should vary in difficulty and complexity, and should test the student's ability to apply concepts from the listed objectives effectively.

        Language: {lang}  
        Number of Questions per Objective: {no}  

        Objectives:
        {formatted_objectives}

        Generate exactly {no} questions. Each question must contain:
        - number (int)
        - title (str)
        - problem_statement (str)
        - input_format (str)
        - output_format (str)
        - sample_input (str)
        - sample_output (str)

        Return the entire result as a JSON object following this format:

        objective: str
        language: str
        questions: List[Question]
        """
    
    response = model.generate_content(prompt,generation_config=genai.GenerationConfig(response_mime_type="application/json"))
    raw_text = response.text
    cleaned_json = clean_json_response(raw_text)

    try:
        json_data = json.loads(cleaned_json)
        return json_data
    except Exception as e:
        print("Parsing Error:", e)
        print("Raw output:", raw_text)
        return None


def get_followup_question(question_details: dict, student_code: str):
    prompt = f"""
    You are a programming instructor evaluating a student's understanding of a specific programming concept.

    Below is the original question given to the student and the code they submitted:

    Original Question:
    {question_details}

    Student's Code:
    {student_code}

    Your task is to generate a *follow-up question* that directly builds on the student's submitted code. The goal is to test whether the student truly understood the concept by asking them to *modify, extend, or refactor* their existing code.

    DO NOT generate a completely new or unrelated problem.

    ---

    Here are some examples of what good follow-up questions might look like:

    Original Question: Write a function to calculate the factorial of a number using recursion.

    Possible Follow-Ups:
    1. *Refactoring*: Change the code to use while loop instead of for loop.
    2. *New Constraint*: Rewrite the function to handle negative inputs with appropriate error handling.
    3. *Change of Input*: Modify the function to calculate the factorial for a list of numbers.
    4. *Output Format Change*: Return the result as a formatted string: “Factorial of 5 is 120”.

    In your follow-up question, you should try to apply a similar idea—take the *same problem context, and **add a twist* that makes the student update the code.

    ---

    Return your final result in the following JSON format as a json object  (no explanation, no markdown, just the raw JSON object):
    {{
        "number": (int),
        "title": (str),
        "problem_statement": (str),
        "input_format": (str),
        "output_format": (str),
        "sample_input": (str),
        "sample_output": (str)
    }}
    """
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        temperature=0.1,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    cleaned_json = clean_json_response(response.content[0].text)

    try:
        json_data = json.loads(cleaned_json)
        # If Gemini wraps the content in a top-level "LabQuestions" key, unwrap it:
        return json_data
    except Exception as e:
        print("Parsing Error:", e)
        print("Raw output:", response.content[0].text)
        return None


def get_hint(question, code, error=None):
    prompt=f"""
    You are a programming mentor helping a student who is stuck on a problem.

    Your job is to guide the student using *three progressive hints* that help them understand and fix their mistake—without giving away the answer directly.

    Here’s the problem they were trying to solve:

    {question}

    {f"The student encountered the following error:\n{error}" if error else "The student is not getting the expected output, but there is no error."}

    Here is the code written by the student:

    {code}

    Please provide *3 hints* in *increasing order of specificity*:
    - Hint 1: A broad-level nudge (conceptual)
    - Hint 2: A more focused tip (e.g., what part of the code to look at or rethink)
    - Hint 3: A detailed logic hint (almost the solution, but not code)

    Return the hints as a JSON object with this format witth no additional markdown text:
    
        "hint_1": "...",
        "hint_2": "...",
        "hint_3": "..."
    
    """
    response = client.messages.create(
        model="claude-3-opus-20240229",  # or claude-3-sonnet or haiku
        max_tokens=1024,
        temperature=0.7,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    cleaned_json = clean_json_response(response.content[0].text)
    try:
        #text = response.content[0].text.strip()
        parsed_json = json.loads(cleaned_json)
        return parsed_json
    except Exception as e:
        print("Parsing Error:", e)
        print("Raw response:", response.content[0].text)
        return None
    

def check_code(question_details: dict, student_code: str, output: str):
    prompt = f"""
    You are a programming instructor evaluating a student's submission. Your job is to check if the student's code fulfills all the requirements of the original question, and if the output is correct.

    Below is the full information you have:

    --- Original Question ---
    {question_details}

    --- Student's Submitted Code ---
    {student_code}

    --- Output Produced by the Code ---
    {output}

    --- Evaluation Instructions ---
    1. Read the question carefully. Check for all required parts:
        - What the function is supposed to do.
        - Required input format (e.g., number of arguments, data types).
        - Expected output format (e.g., type and structure of return value).

    2. Check the student code:
        - Does it define the function with the correct name and number/types of parameters?
        - Does the logic correctly solve the problem as stated?
        - Does it return (not just print) the correct result in the correct format?

    3. Validate the output:
        - Calculate the expected output based on the arguments used in the student's function call.
        - Compare that with the provided output.
        - If the result is mathematically incorrect or improperly formatted, do NOT approve.

    --- Return Your Final Judgment in the Following JSON Format ---
    
        "Approved": (int) 1 if everything is correct, else 0,
        "Reason": (str) Briefly explain why it's approved or what’s wrong addressing the student in reason. (e.g., wrong return type, incorrect logic, wrong function name, etc.)
    
    """
    response = model.generate_content(prompt,generation_config=genai.GenerationConfig(response_mime_type="application/json"))
    raw_text = response.text
    cleaned_json = clean_json_response(raw_text)

    try:
        json_data = json.loads(cleaned_json)
        return json_data
    except Exception as e:
        print("Parsing Error:", e)
        print("Raw output:", raw_text)
        return None
