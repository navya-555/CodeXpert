#from app import app
from models import db, AssignmentProgress, Question, Student, Error
from sqlalchemy import func
from collections import Counter

# Needed for using the db.session inside Jupyter
#app.app_context().push()

def get_avg_time_for_assignment(assignment_id):
    result = (
        db.session.query(func.avg(AssignmentProgress.time))
        .filter(AssignmentProgress.assignment_id == assignment_id)
        .scalar()
    )
    
    # Return the average time or 0 if no entries
    return round(result, 2) if result is not None else 0


def get_question_attempt_distribution(assignment_id):
    #with app.app_context():
        # Step 1: Get all progress entries for the assignment, grouped by student
        results = (
            db.session.query(AssignmentProgress.student_id, AssignmentProgress.solved_questions)
            .filter(AssignmentProgress.assignment_id == assignment_id)
            .all()
        )

        if not results:
            print(f"No progress found for assignment ID: {assignment_id}")
            return {}

        # Step 2: Count how many students attempted X number of questions
        distribution = Counter()

        for student_id, total_questions in results:
            distribution[total_questions] += 1

        # Return the distribution dictionary
        return dict(distribution)
    

def get_assignment_time_distribution(assignment_id):
    #with app.app_context():
        # Step 1: Get all progress entries for the assignment, grouped by student
        results = (
            db.session.query(AssignmentProgress.time)
            .filter(AssignmentProgress.assignment_id == assignment_id)
            .all()
        )

        if not results:
            print(f"No progress found for assignment ID: {assignment_id}")
            return {}

        # Return the distribution dictionary
        return [time[0] for time in results]
    

def get_avg_score_for_assignment(assignment_id):
    result = (
        db.session.query(func.avg(AssignmentProgress.score))
        .filter(AssignmentProgress.assignment_id == assignment_id)
        .scalar()
    )
    
    # Return the average time or 0 if no entries
    return round(result, 2) if result is not None else 0


def get_assignment_score_distribution(assignment_id):
    #with app.app_context():
        # Step 1: Get all progress entries for the assignment, grouped by student
        results = (
            db.session.query(AssignmentProgress.score)
            .filter(AssignmentProgress.assignment_id == assignment_id)
            .all()
        )

        if not results:
            print(f"No progress found for assignment ID: {assignment_id}")
            return {}

        # Return the distribution dictionary
        return [score[0] for score in results]
    

def class_analysis(assignment_id):
    avg_time = get_avg_time_for_assignment(assignment_id)
    question_distribution = get_question_attempt_distribution(assignment_id)
    time_distribution = get_assignment_time_distribution(assignment_id)
    avg_score = get_avg_score_for_assignment(assignment_id)
    score_distribution = get_assignment_score_distribution(assignment_id)
    return {"avg_time": avg_time, "question_distribution": question_distribution, "time_distribution": time_distribution, "avg_score": avg_score, "score_distribution": score_distribution}


def get_student_question_parent_time_distribution(student_name, assignment_id):
    #with app.app_context():
        # Step 1: Get student_id from student name
        student = db.session.query(Student).filter(Student.name == student_name).first()

        if not student:
            print(f"Student with name {student_name} not found.")
            return {}

        # Step 2: Get all questions for the given assignment_id and student_id
        results = (
            db.session.query(Question.question_id, Question.parent_time)
            .filter(Question.assignment_id == assignment_id, Question.student_id == student.userid)
            .all()
        )

        if not results:
            print(f"No questions found for student {student_name} in assignment ID: {assignment_id}")
            return {}

        # Step 3: Create a dictionary with question_id as key and parent_time as value
        question_time_dict = {question_id: parent_time for question_id, parent_time in results}

        return question_time_dict


def get_student_question_followup_time_distribution(student_name, assignment_id):
    #with app.app_context():
        # Step 1: Get student_id from student name
        student = db.session.query(Student).filter(Student.name == student_name).first()

        if not student:
            print(f"Student with name {student_name} not found.")
            return {}

        # Step 2: Get all questions for the given assignment_id and student_id
        results = (
            db.session.query(Question.question_id, Question.followup_time)
            .filter(Question.assignment_id == assignment_id, Question.student_id == student.userid)
            .all()
        )

        if not results:
            print(f"No questions found for student {student_name} in assignment ID: {assignment_id}")
            return {}

        # Step 3: Create a dictionary with question_id as key and parent_time as value
        question_time_dict = {question_id: follow_time for question_id, follow_time in results}

        return question_time_dict


def get_student_question_attempt_distribution(student_name, assignment_id):
    #with app.app_context():
        # Step 1: Get student_id from student name
        student = db.session.query(Student).filter(Student.name == student_name).first()

        if not student:
            print(f"Student with name {student_name} not found.")
            return {}

        # Step 2: Get all questions for the given assignment_id and student_id
        results = (
            db.session.query(Question.question_id, Question.parent_att)
            .filter(Question.assignment_id == assignment_id, Question.student_id == student.userid)
            .all()
        )

        if not results:
            print(f"No questions found for student {student_name} in assignment ID: {assignment_id}")
            return {}

        # Step 3: Create a dictionary with question_id as key and parent_time as value
        question_att_dict = {question_id: par_att for question_id, par_att in results}

        return question_att_dict


def get_student_question_fol_attempt_distribution(student_name, assignment_id):
    #with app.app_context():
        # Step 1: Get student_id from student name
        student = db.session.query(Student).filter(Student.name == student_name).first()

        if not student:
            print(f"Student with name {student_name} not found.")
            return {}

        # Step 2: Get all questions for the given assignment_id and student_id
        results = (
            db.session.query(Question.question_id, Question.followup_att)
            .filter(Question.assignment_id == assignment_id, Question.student_id == student.userid)
            .all()
        )

        if not results:
            print(f"No questions found for student {student_name} in assignment ID: {assignment_id}")
            return {}

        # Step 3: Create a dictionary with question_id as key and parent_time as value
        question_att_dict = {question_id: fol_att for question_id, fol_att in results}

        return question_att_dict


def get_error_summary_by_student_name(student_name):
    # Get the student by name
    student = Student.query.filter_by(name=student_name).first()
    
    if not student:
        print(f"No student found with name: {student_name}")
        return {}

    # Use the student's ID to fetch error summary
    results = (
        db.session.query(Error.error_message, db.func.count().label("count"))
        .filter(Error.student_id == student.userid)
        .group_by(Error.error_message)
        .all()
    )

    if not results:
        print(f"No errors found for student: {student_name}")
        return {}

    return {error: count for error, count in results}


def student_analysis(student_name, assignment_id):
    question_parent_time = get_student_question_parent_time_distribution(student_name, assignment_id)
    question_followup_time = get_student_question_followup_time_distribution(student_name, assignment_id)
    question_parent_att = get_student_question_attempt_distribution(student_name, assignment_id)
    question_followup_att = get_student_question_fol_attempt_distribution(student_name, assignment_id)
    get_error=get_error_summary_by_student_name(student_name)
    return {"question_parent_time": question_parent_time, "question_followup_time": question_followup_time, "question_parent_att": question_parent_att, "question_followup_att": question_followup_att, "get_error": get_error}