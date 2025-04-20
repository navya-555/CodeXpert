from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableList
import uuid
db = SQLAlchemy()

def generate_id():
    return str(uuid.uuid4())[:5]


class Teacher(db.Model):
    __tablename__ = 'teachers'

    userid = db.Column(db.String(5), primary_key=True, default=generate_id)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    profile = db.Column(db.Text)

    def __repr__(self):
        return f"<Teacher {self.name}>"

    def to_dict(self):
        return {
            "userid": self.userid,
            "name": self.name,
            "email": self.email,
            "profile": self.profile
        }

class Student(db.Model):
    __tablename__ = 'students'

    userid = db.Column(db.String(5), primary_key=True, default=generate_id)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    profile = db.Column(db.Text)

    def __repr__(self):
        return f"<Student {self.name}>"

    def to_dict(self):
        return {
            "userid": self.userid,
            "name": self.name,
            "email": self.email,
            "profile": self.profile
        }

class Class(db.Model):
    __tablename__ = 'classes'

    classid = db.Column(db.String(5), primary_key=True, default=generate_id)
    classname = db.Column(db.String(100), nullable=False)

    teacher_id = db.Column(db.String(5), db.ForeignKey('teachers.userid'), nullable=False)
    teacher = db.relationship('Teacher', backref='classes')

    def __repr__(self):
        return f"<Class {self.classname}>"

    def to_dict(self):
        return {
            "classid": self.classid,
            "classname": self.classname,
            "teacher_id": self.teacher_id
        }

class StudentClass(db.Model):
    __tablename__ = 'student_classes'

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.String(5), db.ForeignKey('students.userid'), nullable=False)
    class_id = db.Column(db.String(5), db.ForeignKey('classes.classid'), nullable=False)

    student = db.relationship('Student', backref='class_links')
    class_ = db.relationship('Class', backref='student_links')

    def __repr__(self):
        return f"<StudentClass Student: {self.student_id}, Class: {self.class_id}>"

    def to_dict(self):
        return {
            "student_id": self.student_id,
            "class_id": self.class_id
        }

class Assignment(db.Model):
    __tablename__ = 'assignments'
    
    assignment_id = db.Column(db.String(5), primary_key=True, default=generate_id)
    name = db.Column(db.String(100), nullable=False)
    no_ques = db.Column(db.Integer, nullable=False)
    language = db.Column(db.String(50), nullable=False)
    objective = db.Column(MutableList.as_mutable(db.JSON), nullable=False)  # Storing as list of strings
    date = db.Column(db.Date, nullable=False)

    # Foreign key linking to Class
    class_id = db.Column(db.String(5), db.ForeignKey('classes.classid'), nullable=False)
    class_ = db.relationship('Class', backref='assignments')

    def __repr__(self):
        return f"<Assignment {self.name}>"

    def to_dict(self):
        return {
            "assignment_id": self.assignment_id,
            "name": self.name,
            "no_ques": self.no_ques,
            "language": self.language,
            "objective": self.objective,
            "date": self.date,
            "class_id": self.class_id
        }

class Question(db.Model):
    __tablename__ = 'questions'

    question_id = db.Column(db.String(5), primary_key=True, default=generate_id)
    
    # Foreign Keys
    assignment_id = db.Column(db.String(5), db.ForeignKey('assignments.assignment_id'), nullable=False)
    student_id = db.Column(db.String(5), db.ForeignKey('students.userid'), nullable=False)
    
    # Question fields
    parent_question = db.Column(db.Text, nullable=True)
    followup_question = db.Column(db.Text, nullable=True)

    parent_time = db.Column(db.Integer, nullable=True)
    followup_time = db.Column(db.Integer, nullable=True)

    parent_att = db.Column(db.Integer, nullable=True, default=1)
    followup_att = db.Column(db.Integer, nullable=True, default=1)

    error = db.Column(MutableList.as_mutable(db.JSON), nullable=True)  
    parent_hints = db.Column(MutableList.as_mutable(db.JSON), nullable=True)  
    followup_hints = db.Column(MutableList.as_mutable(db.JSON), nullable=True)
    solved = db.Column(db.Boolean, nullable=False, default=False)

    assignment = db.relationship('Assignment', backref='questions')
    student = db.relationship('Student', backref='questions')

    def __repr__(self):
        return f"<Question {self.parent_question}>"

    def to_dict(self):
        return {
            "question_id": self.question_id,
            "assignment_id": self.assignment_id,
            "student_id": self.student_id,
            "parent_question": self.parent_question,
            "followup_question": self.followup_question,
            "parent_time": self.parent_time,
            "followup_time": self.followup_time,
            "parent_att": self.parent_att,
            "followup_att": self.followup_att,
            "error": self.error,
            "parent_hints": self.parent_hints,
            "follow_hints": self.followup_hints,
            "solved": self.solved
        }

class AssignmentProgress(db.Model):
    __tablename__ = 'assignment_progress'

    id = db.Column(db.Integer, primary_key=True)
    
    assignment_id = db.Column(db.String(5), db.ForeignKey('assignments.assignment_id'), nullable=False)
    student_id = db.Column(db.String(5), db.ForeignKey('students.userid'), nullable=False)

    total_questions = db.Column(db.Integer, nullable=False)
    solved_questions = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)  
    time = db.Column(db.Integer, nullable=False) 
    
    errors = db.Column(MutableList.as_mutable(db.JSON), nullable=True)  

    assignment = db.relationship('Assignment', backref='progress')
    student = db.relationship('Student', backref='progress')

    def __repr__(self):
        return f"<AssignmentProgress student_id={self.student_id}, assignment_id={self.assignment_id}>"

    def to_dict(self):
        return {
            "assignment_id": self.assignment_id,
            "student_id": self.student_id,
            "total_questions": self.total_questions,
            "solved_questions": self.solved_questions,
            "score": self.score,
            "time": self.time,
            "errors": self.errors
        }
    
class Error(db.Model):
    __tablename__ = 'errors'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(5), nullable=False)
    error_message = db.Column(db.Text, nullable=False)


    def __repr__(self):
        return f"<Error {self.id} for Student {self.student_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "error_message": self.error_message
        }