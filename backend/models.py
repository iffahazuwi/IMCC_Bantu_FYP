from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime
from flask_login import UserMixin

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(345), nullable=True)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    phone_no = db.Column(db.String(32), nullable=True)

    discriminator = db.Column('type', db.String(20))
    __mapper_args__ = {'polymorphic_on': discriminator}
    def __init__(self, name, email, password, phone_no):
        self.name = name
        self.email = email
        self.password = password
        self.phone_no = phone_no

    notifications = db.relationship('Notification', back_populates='user')

class Student(User):
    __tablename__ = 'students'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True, nullable=False)
    matric_no = db.Column(db.String(20), nullable=True)
    school = db.Column(db.String(345), nullable=True)
    is_mentor = db.Column(db.Boolean, default=False, nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    gender = db.Column(db.String(32), nullable=True)
    country = db.Column(db.String(32), nullable=True)
    language_1 = db.Column(db.String(32), nullable=True)
    language_2 = db.Column(db.String(32), nullable=True)
    # acc_points = db.Column(db.Integer, nullable=True)

    __mapper_args__ = {'polymorphic_identity': 'student'}
    def __init__(self, name, email, password, phone_no, matric_no, school, gender,  
                 country, language_1, language_2, is_mentor=False, is_available=True):
        super().__init__(name, email, password, phone_no)
        self.matric_no = matric_no
        self.school = school
        self.is_mentor = is_mentor
        self.is_available = is_available
        self.gender = gender
        self.country = country
        self.language_1 = language_1
        self.language_2 = language_2
        # self.acc_points = acc_points

    # def update_acc_points(self, operation, amount):
    #     if operation == 'add':
    #         self.acc_points += amount
    #     elif operation == 'subtract':
    #         self.acc_points -= amount
    #     db.session.commit()

class Admin(User):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True, nullable=False)

    __mapper_args__ = {'polymorphic_identity': 'admin'}
    def __init__(self, name, email, password, phone_no,):
        super().__init__(name, email, password, phone_no)

class Feedback(db.Model):
    __tablename__ = "feedbacks"
    feedback_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    fb_client = db.Column(db.String(32), nullable=False)
    fb_mentor = db.Column(db.String(32), nullable=False)
    fb_accessible = db.Column(db.Integer, nullable=False)
    fb_interactions = db.Column(db.Integer, nullable=False)
    fb_communication = db.Column(db.Integer, nullable=False)
    fb_knowledgeable = db.Column(db.Integer, nullable=False)
    fb_attitude = db.Column(db.Integer, nullable=False)
    fb_friendly = db.Column(db.Integer, nullable=False)
    fb_effort = db.Column(db.Integer, nullable=False)
    feedback_overall = db.Column(db.Integer, nullable=False)
    feedback_comment = db.Column(db.String(345), nullable=True)
    feedback_date = db.Column(db.DateTime, default=datetime.now)
 
class Application(db.Model):
    __tablename__ = "applications"
    app_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    app_gender = db.Column(db.String(345), nullable=True)
    app_country = db.Column(db.String(345), nullable=True)
    app_language = db.Column(db.String(345), nullable=True)
    app_language_2 = db.Column(db.String(345), nullable=True)
    app_skill = db.Column(db.String(345), nullable=True)
    app_filename = db.Column(db.String(345), nullable=False)
    app_filedata = db.Column(db.String(345), nullable=False)
    app_date = db.Column(db.DateTime, default=datetime.now)
    app_status = db.Column(db.String(345), nullable=True)
    id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('Student', backref=db.backref('applications', lazy=True))

class Post(db.Model):
    __tablename__ = "posts"
    post_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    post_title = db.Column(db.String(345), nullable=True)
    post_desc = db.Column(db.String(345), nullable=True)
    post_date = db.Column(db.DateTime, default=datetime.now)
    id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

class Notification(db.Model):
    __tablename__ = "notifications"
    noti_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    noti_message = db.Column(db.String(345), nullable=False)
    noti_date = db.Column(db.DateTime, default=datetime.now)
    id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))
    user = db.relationship('User', back_populates='notifications')

class Bookmark(db.Model):
    __tablename__ = "bookmarks"
    bookmark_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)

    post = db.relationship('Post', backref=db.backref('bookmarked_by', lazy=True, cascade='all, delete'))
    user = db.relationship('User', backref=db.backref('bookmarks', lazy=True))

class Matching(db.Model):
    __tablename__ = "matchings"
    matching_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    matching_date = db.Column(db.DateTime, default=datetime.now)
    feedback_desc = db.Column(db.String(345), nullable=True)
    feedback_date = db.Column(db.DateTime)
    evaluation = db.Column(db.String(345), nullable=True)
    matching_status = db.Column(db.String(32), nullable=True, default='Active')
    
    accessibility_rating = db.Column(db.Integer, nullable=True)
    initiation_rating = db.Column(db.Integer, nullable=True)
    communication_rating = db.Column(db.Integer, nullable=True)
    knowledge_rating = db.Column(db.Integer, nullable=True)
    behavior_rating = db.Column(db.Integer, nullable=True)
    friendliness_rating = db.Column(db.Integer, nullable=True)
    effort_rating = db.Column(db.Integer, nullable=True)
    overall_rating = db.Column(db.Integer, nullable=True)

    client = db.relationship('User', foreign_keys=[client_id])
    mentor = db.relationship('User', foreign_keys=[mentor_id])

class Reply(db.Model):
    __tablename__ = "replies"
    reply_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.post_id', ondelete='CASCADE'), nullable=False)
    id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reply_content = db.Column(db.String(345), nullable=True)
    reply_date = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('Student', backref=db.backref('replies', lazy=True))
    post = db.relationship('Post', backref=db.backref('replies', lazy=True, cascade='all, delete'))
    
class Form(db.Model):
    __tablename__ = "forms"
    form_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    form_name = db.Column(db.String(345), nullable=True)
    form_ic = db.Column(db.String(345), nullable=True)
    form_matric_no = db.Column(db.String(32), nullable=True)
    form_programme = db.Column(db.String(345), nullable=True)
    form_school = db.Column(db.String(345), nullable=True)
    form_country = db.Column(db.String(345), nullable=True)
    form_languages = db.Column(db.String(345), nullable=True)
    form_phone_no = db.Column(db.String(32), nullable=True)
    form_email = db.Column(db.String(345), nullable=True)
    form_allergies = db.Column(db.String(345), nullable=True)
    form_date = db.Column(db.DateTime, default=datetime.now)
    form_status = db.Column(db.String(345), nullable=True)