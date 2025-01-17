from flask import Flask, jsonify, request, abort, redirect, send_from_directory, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from flask_mail import Mail, Message
from sqlalchemy import func
from sqlalchemy.orm import aliased
from functools import wraps
from models import Form, Matching, Reply, Student, db, User, Feedback, Application, Post, Notification, Admin, Bookmark
from config import ApplicationConfig
from werkzeug.utils import secure_filename
from flask_session import Session
from datetime import datetime
import os
import base64
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = 'C:\\Users\\USER\\IMCC_Bantu_FYP\\uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'iffah.imccbantufyp@gmail.com'
app.config['MAIL_PASSWORD'] = 'qudnblafgvrruvok'
app.config['MAIL_DEFAULT_SENDER'] = 'iffah.imccbantufyp@gmail.com'

mail = Mail(app)

bcrypt = Bcrypt(app)
CORS(app, origins="http://localhost:3000", supports_credentials=True)
server_session = Session(app)
db.init_app(app)

bp = Blueprint('api', __name__)

with app.app_context():
    db.create_all()

login_manager = LoginManager()
login_manager.init_app(app)

# Load the data from the Excel file
# file_path = 'C:\\Users\\USER\\IMCC_Bantu_FYP\\Helperss.xlsx'
# df = pd.read_excel(file_path)

# Query the Student table to get the data

def send_match_email(client_email, mentor_details):
    with app.app_context():
        msg = Message(
            subject='Your Mentor Match Details',
            recipients=[client_email]
        )
        msg.body = f"""You have been matched with a mentor. Here are the details:
        Name: {mentor_details['name']}
        School: {mentor_details['school']}
        Phone No.: {mentor_details['phone']}
        Email: {mentor_details['email']}
        """
        mail.send(msg)

def get_student_data():
    with app.app_context():
        students = Student.query.filter_by(is_mentor=True, is_available=True).with_entities(
        Student.id,
        Student.name,
        Student.matric_no,
        Student.gender,
        Student.country,
        Student.school,
        Student.language_1,
        Student.language_2
    ).all()
        
    print("Retrieved Students:", students)

    student_df = pd.DataFrame(students, columns=['id', 'name', 'matric_no', 'gender', 'country', 'school', 'language_1', 'language_2'])
    return student_df

def find_top_matches(input_data, n=3):
    # Get the student data
    student_df = get_student_data()

    # Select the columns to compare
    columns_to_compare = ['gender', 'country', 'school', 'language_1', 'language_2']

    # One-hot encode the selected columns with handle_unknown='ignore'
    encoder = OneHotEncoder(handle_unknown='ignore')
    encoded_data = encoder.fit_transform(student_df[columns_to_compare]).toarray()

    # One-hot encode the input data
    input_encoded = encoder.transform([input_data]).toarray()
    
    # Calculate cosine similarity between the input data and the dataset
    similarities = cosine_similarity(input_encoded, encoded_data).flatten()
    
    # Get the indices of the top n most similar people
    top_indices = np.argsort(similarities)[-n:][::-1]
    
    # Get the top n most similar people from the dataframe
    top_matches = student_df.iloc[top_indices].copy()
    top_matches['Similarity'] = similarities[top_indices] * 100
    
    return top_matches[['id', 'name', 'matric_no', 'gender', 'country', 'school', 'language_1', 'language_2', 'Similarity']]

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"error": "Unauthorized!"}), 401
        if not isinstance(current_user, Admin):
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)
    return decorated_function

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.route("/@me")
@login_required
def get_current_user():
    user = current_user
    if isinstance(user, Admin):
        return jsonify({
        "id": user.id,
        "name": user.name,
        "phone_no": user.phone_no,
        "email": user.email
        })
    elif isinstance(user, Student):
        return jsonify({
        "id": user.id,
        "name": user.name,
        "matric_no": user.matric_no,
        "phone_no": user.phone_no,
        "email": user.email,
        "school": user.school,
        "is_mentor": user.is_mentor,
        "gender": user.gender,
        "country": user.country,
        "language_1": user.language_1,
        "language_2": user.language_2,
        })
    else:
        return jsonify({"error": "Unknown user type"}), 400

@app.route("/updateUser", methods=["PUT"])
@login_required
def update_user():
    data = request.get_json()
    user = current_user

    user.name = data.get("name", user.name)
    user.phone_no = data.get("phone_no", user.phone_no)
    user.email = data.get("email", user.email)

    if isinstance(user, Student):
        user.matric_no = data.get("matric_no", user.matric_no)
        user.school = data.get("school", user.school)
        user.gender = data.get("gender", user.gender)
        user.country = data.get("country", user.country)
        user.language_1 = data.get("language_1", user.language_1)
        user.language_2 = data.get("language_2", user.language_2)

    db.session.commit()

    if isinstance(user, Admin):
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "phone_no": user.phone_no,
                "email": user.email
            }
        })
    elif isinstance(user, Student):
        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "matric_no": user.matric_no,
                "phone_no": user.phone_no,
                "email": user.email,
                "school": user.school,
                "is_mentor": user.is_mentor,
                "gender": user.gender,
                "country": user.country,
                "language_1": user.language_1,
                "language_2": user.language_2
            }
        })
    else:
        return jsonify({"error": "Unknown user type"}), 400
    
# @app.route('/update-reward-points', methods=['POST'])
# def update_reward_points():
#     data = request.json
#     student_id = data.get('student_id')
#     operation = data.get('operation')
#     amount = data.get('amount')

#     student = Student.query.get(student_id)
#     if student:
#         student.update_acc_points(operation, amount)
#         return jsonify({'message': 'Points updated successfully'}), 200
#     return jsonify({'message': 'Student not found'}), 404
    
@app.route('/match', methods=['POST'])
@login_required
@admin_required
def match():
    data = request.json
    input_data = [
        data['gender'],
        data['country'],
        data['school'],
        data['language_1'],
        data['language_2']
    ]

    top_matches = find_top_matches(input_data)
    top_matches_list = top_matches.to_dict(orient='records')

    return jsonify(top_matches_list)

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    name = request.json["name"]
    matric_no = request.json["matric_no"]
    phone_no = request.json["phone_no"]
    school = request.json["school"]
    is_mentor = True
    type = "student"
    gender = request.json["gender"]
    country = request.json["country"]
    language_1 = request.json["language_1"]
    language_2 = request.json["language_2"]

    if email.endswith("@usm.my"):
        type = "admin"
    else:
        type = "student"

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Account already exist!"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    if type == "admin":
        new_user = Admin(email=email, password=hashed_password, name=name, phone_no=phone_no)
    else:
        new_user = Student(email=email, password=hashed_password, name=name, matric_no=matric_no, 
                       phone_no=phone_no, school=school, is_mentor=is_mentor, gender=gender,
                       country=country, language_1=language_1, language_2=language_2)
    db.session.add(new_user)
    db.session.commit()
    
    login_user(new_user)

    if type == 'student':
        return jsonify({
            "id": new_user.id,
            "name": new_user.name,
            "matric_no": new_user.matric_no,
            "phone_no": new_user.phone_no,
            "email": new_user.email,
            "school": new_user.school,
            "is_mentor": new_user.is_mentor,
            "gender": new_user.gender,
            "country": new_user.country,
            "language_1": new_user.language_1,
            "language_2": new_user.language_2
        })
    elif type == 'admin':
        return jsonify({
            "id": new_user.id,
            "name": new_user.name,
            "phone_no": new_user.phone_no,
            "email": new_user.email
        })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route('/submit-application', methods=['POST'])
@login_required
def submit_application():
    user = current_user
    
    app_gender = request.form.get("app_gender")
    app_country = request.form.get("app_country")
    app_language = request.form.get("app_language")
    app_language_2 = request.form.get("app_language_2")
    app_skill = request.form.get("app_skill")
    app_date = datetime.now()
    file = request.files['file']

    # noti_message = f"{user.name} submitted a Mentor Application Form."
    # new_notification = Notification(
    #     noti_message=noti_message,
    #     noti_date=datetime.now(),
    #     id=user.id
    # )

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        application = Application(id=user.id, app_gender=app_gender, app_country=app_country, 
                                  app_language=app_language, app_language_2=app_language_2, 
                                  app_skill=app_skill, app_filename=filename, 
                                  app_filedata=file_path, app_date=app_date)
        db.session.add(application)
        db.session.commit()

        return jsonify({"message": "Mentor Application submitted successfully!"}), 200
    else:
        return jsonify({"error": "No file selected!"}), 400
    
# @app.route('/get-applications', methods=['GET'])
# @login_required
# @admin_required
# def get_applications():
#     try:
#         applications = Application.query.all()
#         if not applications:
#             return jsonify({"error": "No applications found"}), 404
        
#         applications_list = [
#             {
#                 'app_id': app.app_id,
#                 "app_gender": app.app_gender,
#                 "app_country": app.app_country,
#                 "app_language": app.app_language,
#                 "app_language_2": app.app_language_2,
#                 "app_skill": app.app_skill,
#                 "app_filename": app.app_filename,
#                 'app_filedata': base64.b64encode(app.app_filedata).decode('utf-8'),
#                 'user_name': app.user.name,
#                 'matric_no': app.user.matric_no,
#                 'school': app.user.school,
#                 'phone_no': app.user.phone_no,
#                 'email': app.user.email,
#                 'app_date': app.app_date.strftime('%Y-%m-%d'),
#                 "app_status": app.app_status
#             }
#             for app in applications
#         ]
#         return jsonify(applications_list)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/get-applications', methods=['GET'])
@login_required
@admin_required
def get_applications():
    try:
        # Fetch applications and order by form_date in ascending order
        applications = Form.query.order_by(Form.form_date.asc()).all()
        if not applications:
            return jsonify({"error": "No applications found"}), 404
        
        applications_list = [
            {
                'form_id': app.form_id,
                'form_name': app.form_name,
                'form_ic': app.form_ic,
                'form_matric_no': app.form_matric_no,
                'form_programme': app.form_programme,
                'form_school': app.form_school,
                'form_country': app.form_country,
                'form_languages': app.form_languages,
                'form_phone_no': app.form_phone_no,
                'form_email': app.form_email,
                'form_allergies': app.form_allergies,
                'form_date': app.form_date,
                'form_status': app.form_status
            }
            for app in applications
        ]
        return jsonify(applications_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@app.route('/uploads/<filename>', methods=['GET'])
def get_file(filename):
    application = Application.query.filter_by(app_filename=filename, id=current_user.id).first()
    if application:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    else:
        return jsonify({"error": "File not found or access denied!"}), 404
    
@app.route('/update-application-status', methods=['POST'])
def update_application_status():
    data = request.json
    form_id = data.get('form_id')
    new_status = data.get('status')

    application = Form.query.filter_by(form_id=form_id).first()
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    application.form_status = new_status

    # if new_status == 'Approved':
    #     student = Student.query.filter_by(id=application.id).first()
    #     if student:
    #         student.is_mentor = True

    db.session.commit()
    # send_email_notification(application.form_email, new_status)

    return jsonify({'success': 'Status updated successfully'})

def send_email_notification(student_email, new_status):
    subject = "Mentor Application Status Update"
    if new_status == 'Approved':
        body = "Congratulations! Your mentor application has been approved."
    else:
        body = "We regret to inform you that your mentor application has been rejected."

    msg = Message(subject, recipients=[student_email], body=body)
    mail.send(msg)

@app.route('/update-evaluation', methods=['POST'])
def update_evaluation():
    data = request.json
    matching_id = data.get('matching_id')
    new_evaluation = data.get('evaluation')

    match = Matching.query.filter_by(matching_id=matching_id).first()
    if not match:
        return jsonify({'error': 'Matching not found'}), 404

    match.evaluation = new_evaluation

    db.session.commit()
    return jsonify({'success': 'Evaluation updated successfully'})
    
@app.route('/get-notifications', methods=['GET'])
@login_required
def get_notifications():
    user = current_user

    notifications = Notification.query.filter_by(id=user.id).order_by(Notification.noti_date.desc()).all()
    notifications_data = [{
        'noti_message': notification.noti_message,
        'noti_date': notification.noti_date.strftime('%Y-%m-%d %H:%M:%S')
    } for notification in notifications]

    return jsonify(notifications_data)

@app.route('/insert-post', methods=['POST'])
@login_required
def insert_post():
    user = current_user
    
    post_title = request.json["post_title"]
    post_desc = request.json["post_desc"]
    post_date = datetime.now()

    post = Post(id=user.id, post_title=post_title, post_desc=post_desc, post_date=post_date)
    db.session.add(post)
    db.session.commit()

    return 'Post has been created successfully!'

@app.route('/get-posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.post_date.desc()).all()
    posts_data = []
    for post in posts:
        replies = Reply.query.filter_by(post_id=post.post_id).order_by(Reply.reply_date.asc()).all()
        replies_data = []
        for reply in replies:
            replies_data.append({
                "reply_id": reply.reply_id,
                "reply_content": reply.reply_content,
                "reply_date": reply.reply_date,
                "user_id": reply.id,
                "reply_name": reply.user.name
                # Add more fields if necessary
            })
        posts_data.append({
            "post_id": post.post_id,
            "title": post.post_title,
            "description": post.post_desc,
            "date": post.post_date,
            "name": post.user.name,  # Assuming you have a relationship with the User model
            "user_id": post.user.id,
            "replies": replies_data
        })
    return jsonify(posts_data)

# routes.py or app.py (wherever you define your routes)
@app.route('/get-post/<post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    return jsonify({
        'post_title': post.post_title,
        'post_desc': post.post_desc
    }), 200

# routes.py or app.py (wherever you define your routes)
@app.route('/update-post/<post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    post.post_title = data.get('title', post.post_title)
    post.post_desc = data.get('description', post.post_desc)
    db.session.commit()

    return jsonify({'message': 'Post updated successfully'}), 200

@app.route('/add-reply', methods=['POST'])
@login_required
def add_reply():
    user = current_user

    data = request.json
    post_id = data.get('post_id')
    # user_id = data.get('user_id')  # Assuming you have user authentication
    reply_content = data.get('reply_content')
    
    new_reply = Reply(
        post_id=post_id,
        id=user.id,
        reply_content=reply_content,
        reply_date=datetime.now()
    )
    
    db.session.add(new_reply)
    db.session.commit()
    
    return jsonify({"message": "Reply added successfully!"}), 201

@app.route('/delete-reply/<reply_id>', methods=['DELETE'])
def delete_reply(reply_id):
    reply = Reply.query.get(reply_id)
    if reply:
        db.session.delete(reply)
        db.session.commit()
        return jsonify({'message': 'Reply deleted successfully!'}), 200
    else:
        return jsonify({'message': 'Reply not found!'}), 404

@app.route('/delete-post/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.filter_by(post_id=post_id).first()
    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Post deleted"}), 200
    else:
        return jsonify({"message": "Post not found"}), 404
    
@app.route('/bookmark-post', methods=['POST'])
@login_required
def bookmark_post():
    data = request.get_json()
    user_id = current_user.id
    post_id = data['post_id']

    bookmark = Bookmark.query.filter_by(id=user_id, post_id=post_id).first()
    if bookmark:
        # If bookmark exists, delete it
        db.session.delete(bookmark)
        db.session.commit()
        return jsonify({"message": "Post unbookmarked", "status": "unbookmarked"}), 200
    else:
        # If bookmark does not exist, create a new one
        new_bookmark = Bookmark(id=user_id, post_id=post_id)
        db.session.add(new_bookmark)
        db.session.commit()
        return jsonify({"message": "Post bookmarked", "status": "bookmarked"}), 200

@app.route('/get-bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    user = current_user
    bookmarks = Bookmark.query.filter_by(id=user.id).join(Post).order_by(Post.post_date.desc()).all()
    bookmarks_list = []
    
    for bookmark in bookmarks:
        post = bookmark.post
        replies = Reply.query.filter_by(post_id=post.post_id).all()
        replies_data = [
            {
                'reply_id': reply.reply_id,
                'reply_content': reply.reply_content,
                'reply_date': reply.reply_date,
                'user_id': reply.id,
                'reply_name': reply.user.name  # Assuming reply.user is a relationship to User model
            }
            for reply in replies
        ]
        
        bookmarks_list.append({
            'post_id': post.post_id,
            'title': post.post_title,
            'description': post.post_desc,
            'date': post.post_date,
            'name': post.user.name,  # Assuming post.user is a relationship to User model
            'replies': replies_data
        })
    
    return jsonify(bookmarks_list)

@app.route('/submit-feedback', methods=['POST'])
@login_required
def submit_feedback():
    user = current_user
    
    feedback_desc = request.json["feedback_desc"]
    feedback_date = datetime.now()

     # Extract ratings from the request
    accessibility_rating = request.json["accessibility_rating"]
    initiation_rating = request.json["initiation_rating"]
    communication_rating = request.json["communication_rating"]
    knowledge_rating = request.json["knowledge_rating"]
    behavior_rating = request.json["behavior_rating"]
    friendliness_rating = request.json["friendliness_rating"]
    effort_rating = request.json["effort_rating"]
    overall_rating = request.json["overall_rating"]

    matching = Matching.query.filter_by(client_id=user.id).first()
    if matching:
        matching.feedback_desc = feedback_desc
        matching.feedback_date = feedback_date
        # Update ratings
        matching.accessibility_rating = accessibility_rating
        matching.initiation_rating = initiation_rating
        matching.communication_rating = communication_rating
        matching.knowledge_rating = knowledge_rating
        matching.behavior_rating = behavior_rating
        matching.friendliness_rating = friendliness_rating
        matching.effort_rating = effort_rating
        matching.overall_rating = overall_rating
        db.session.commit()
        return 'Feedback submitted successfully!'
    else:
        return 'Matching not found', 404

@app.route('/submit-mentor-feedback', methods=['POST'])
def submit_mentor_feedback():
    user = current_user
    
    # Extracting feedback details from JSON request
    feedback_details = request.json
    
    # Creating a new instance of Feedback model
    new_feedback = Feedback(
        fb_client=feedback_details["selectedClient"],
        fb_mentor=feedback_details["selectedMentor"],
        fb_accessible=feedback_details["ratings"]["accessibility"],
        fb_interactions=feedback_details["ratings"]["initiation"],
        fb_communication=feedback_details["ratings"]["communication"],
        fb_knowledgeable=feedback_details["ratings"]["knowledge"],
        fb_attitude=feedback_details["ratings"]["behavior"],
        fb_friendly=feedback_details["ratings"]["friendliness"],
        fb_effort=feedback_details["ratings"]["effort"],
        feedback_overall=feedback_details["ratings"]["overall"],
        feedback_comment=feedback_details["feedback_comment"],
        matching_id=feedback_details["matching_id"]
    )

    # Saving the new feedback to the database
    db.session.add(new_feedback)
    db.session.commit()

    return "Feedback submitted successfully", 200

@app.route('/get-clients', methods=['GET'])
@login_required
@admin_required
def get_clients():
    clients = Student.query.filter_by(is_mentor=False, is_available=True).all()
    client_list = [{"id": client.id, "name": client.name, "matric_no": client.matric_no} for client in clients]
    return jsonify(client_list)

@app.route('/get-client-details/<int:client_id>', methods=['GET'])
@login_required
@admin_required
def get_client_details(client_id):
    client = Student.query.filter_by(id=client_id, is_mentor=False).first()
    if client:
        client_details = {
            "gender": client.gender,
            "country": client.country,
            "school": client.school,
            "language_1": client.language_1,
            "language_2": client.language_2
        }
        return jsonify(client_details)
    return jsonify({"error": "Client not found"}), 404

@app.route('/get-mentors', methods=['GET'])
@login_required
@admin_required
def get_mentors():
    mentors = Student.query.filter_by(is_mentor=True).all()
    mentor_list = [{"id": mentor.id, 
                    "name": mentor.name,
                    "matric_no": mentor.matric_no,
                    "school": mentor.school, 
                    "email": mentor.email,
                    "phone_no": mentor.phone_no,
                    "gender": mentor.gender,
                    "country": mentor.country, 
                    "language_1": mentor.language_1,
                    "language_2": mentor.language_2,
                    # "acc_points": mentor.acc_points
                    } for mentor in mentors]
    return jsonify(mentor_list)

@app.route('/insert-match', methods=['POST'])
@login_required
@admin_required
def insert_match():
    try:
        user = current_user
        
        client_id = request.json["client_id"]
        mentor_id = request.json["mentor_id"]

        print(f"Received client_id: {client_id}, mentor_id: {mentor_id}")

        matching = Matching(client_id=client_id, mentor_id=mentor_id)
        db.session.add(matching)
        db.session.commit()

        client = aliased(Student)
        mentor = aliased(Student)

        db.session.query(Student).\
            filter(Student.id == client_id).\
            update({Student.is_available: False})
        
        db.session.query(Student).\
            filter(Student.id == mentor_id).\
            update({Student.is_available: False})

        db.session.commit()

        # Fetch mentor details
        # mentor_details = db.session.query(Student).filter(Student.id == mentor_id).first()
        # client_details = db.session.query(Student).filter(Student.id == client_id).first()

        # if mentor_details and client_details:
        #     mentor_info = {
        #         'name': mentor_details.name,
        #         'school': mentor_details.school,
        #         'phone': mentor_details.phone_no,
        #         'email': mentor_details.email
        #     }

        #     # Send email to the client
        #     send_match_email(client_details.email, mentor_info)

        return 'New match has been created successfully!', 201
    except Exception as e:
        print(f"Error: {e}")
        return str(e), 500
    
from sqlalchemy.orm import aliased

@app.route('/update-match-status/<matching_id>', methods=['POST'])
@login_required
@admin_required
def update_match_status(matching_id):
    try:
        matching = Matching.query.filter_by(matching_id=matching_id).first()
        if not matching:
            return "Match not found", 404

        new_status = request.json.get("status")
        if new_status not in ['Active', 'Completed']:
            return "Invalid status", 400

        matching.matching_status = new_status
        db.session.commit()

        if new_status == 'Active':
            matching.client.is_available = False
            matching.mentor.is_available = False
        elif new_status == 'Completed':
            matching.client.is_available = True
            matching.mentor.is_available = True
        db.session.commit()

        return "Match status updated successfully", 200
    except Exception as e:
        print(f"Error updating match status: {e}")
        db.session.rollback()  # Rollback changes in case of error
        return str(e), 500

@app.route('/getMatches', methods=['GET'])
@login_required
def get_matches():
    Client = aliased(Student)
    Mentor = aliased(Student)

    matches = db.session.query(
        Matching.matching_id,
        Client.name.label('client_name'),
        Client.matric_no.label('client_matric_no'),
        Client.phone_no.label('client_phone_no'),
        Client.email.label('client_email'),
        Client.school.label('client_school'),
        Mentor.name.label('mentor_name'),
        Mentor.matric_no.label('mentor_matric_no'),
        Mentor.phone_no.label('mentor_phone_no'),
        Mentor.email.label('mentor_email'),
        Mentor.school.label('mentor_school'),
        Matching.matching_date,
        Matching.evaluation,
        Matching.matching_status,
        Matching.overall_rating
    ).join(Client, Matching.client_id == Client.id).join(Mentor, Matching.mentor_id == Mentor.id
                                                         ).order_by(Matching.matching_date.desc()).all()

    matches_list = [{"matching_id": match.matching_id, 
                     "client_name": match.client_name, 
                     "client_matric_no": match.client_matric_no,
                     "client_phone_no": match.client_phone_no, 
                     "client_email": match.client_email,
                     "client_school": match.client_school,
                     "mentor_name": match.mentor_name,
                     "mentor_matric_no": match.mentor_matric_no,
                     "mentor_phone_no": match.mentor_phone_no,
                     "mentor_email": match.mentor_email,
                     "mentor_school": match.mentor_school,
                     "matching_date": match.matching_date.strftime('%Y-%m-%d %H:%M:%S'),
                     "evaluation": match.evaluation,
                     "matching_status": match.matching_status,
                     "overall_rating": match.overall_rating} for match in matches]
    return jsonify(matches_list)

@app.route('/getMentorMatches', methods=['GET'])
@login_required
def get_mentor_matches():
    Client = aliased(Student)
    Mentor = aliased(Student)

    # Assuming current_user.id represents the ID of the logged-in mentor
    matches = db.session.query(
        Matching.matching_id,
        Client.name.label('client_name'),
        Client.matric_no.label('client_matric_no'),
        Client.phone_no.label('client_phone_no'),
        Client.email.label('client_email'),
        Matching.overall_rating,
        Matching.matching_date
    ).join(Client, Matching.client_id == Client.id).join(Mentor, Matching.mentor_id == Mentor.id
                                                         ).filter(Mentor.id == current_user.id
                                                         ).order_by(Matching.matching_date.desc()).all()

    matches_list = [{"matching_id": match.matching_id, 
                     "client_name": match.client_name, 
                     "client_matric_no": match.client_matric_no,
                     "client_phone_no": match.client_phone_no,
                     "client_email": match.client_email,
                     "overall_rating": match.overall_rating,
                     "matching_date": match.matching_date.strftime('%Y-%m-%d %H:%M:%S')} for match in matches]
    return jsonify(matches_list)

@app.route('/get_match_details/<matching_id>', methods=['GET'])
@login_required
def get_match_details(matching_id):
    match = Matching.query.get(matching_id)
    if not match:
        return jsonify({'error': 'Match not found'}), 404
    
    client = Student.query.get(match.client_id)
    mentor = Student.query.get(match.mentor_id)

    if not client or not mentor:
        return jsonify({'error': 'Client or Mentor not found'}), 404

    match_details = {
        'client_name': client.name,
        'client_school': client.school,
        'client_phone_no': client.phone_no,
        'client_email': client.email,
        'mentor_name': mentor.name,
        'mentor_school': mentor.school,
        'mentor_phone_no': mentor.phone_no,
        'mentor_email': mentor.email,
        'is_mentor': current_user.id == mentor.id
    }
    return jsonify(match_details)

@app.route('/delete-match/<matching_id>', methods=['DELETE'])
def delete_match(matching_id):
    match = Matching.query.get(matching_id)
    if not match:
        return jsonify({'error': 'Match not found'}), 404

    db.session.delete(match)
    db.session.commit()
    return jsonify({'success': 'Match deleted successfully'})

@app.route('/getFeedback/<matching_id>', methods=['GET'])
@login_required
def get_feedback(matching_id):
    feedback = db.session.query(
        Matching.accessibility_rating,
        Matching.initiation_rating,
        Matching.communication_rating,
        Matching.knowledge_rating,
        Matching.behavior_rating,
        Matching.friendliness_rating,
        Matching.effort_rating,
        Matching.overall_rating,
        Matching.feedback_desc,
        Matching.feedback_date
    ).filter(Matching.matching_id == matching_id).first()

    if feedback is not None:
        feedback_data = {
            "accessibility_rating": feedback.accessibility_rating,
            "initiation_rating": feedback.initiation_rating,
            "communication_rating": feedback.communication_rating,
            "knowledge_rating": feedback.knowledge_rating,
            "behavior_rating": feedback.behavior_rating,
            "friendliness_rating": feedback.friendliness_rating,
            "effort_rating": feedback.effort_rating,
            "overall_rating": feedback.overall_rating,
            "feedback_desc": feedback.feedback_desc,
            "feedback_date": feedback.feedback_date
        }
        return jsonify(feedback_data)
    else:
        return jsonify({"error": "No feedback found"}), 404
    
@app.route('/getMentorCount', methods=['GET'])
@login_required
def get_mentor_count():
    mentor_count = Student.query.filter_by(is_mentor=True).count()
    return jsonify({"mentor_count": mentor_count})

@app.route('/getMatchingStats', methods=['GET'])
@login_required
def get_matching_stats():
    total_matches = db.session.query(Matching).count()
    avg_rating = db.session.query(func.avg(Matching.overall_rating)).scalar() or 0.0
    return jsonify({"total_matches": total_matches, "average_rating": avg_rating})

@app.route('/getMatchStatusDistribution', methods=['GET'])
@login_required
def get_match_status_distribution():
    status_distribution = db.session.query(
        Matching.matching_status,
        func.count(Matching.matching_id).label('count')
    ).group_by(Matching.matching_status).all()

    data = [{"status": status.matching_status, "count": status.count} for status in status_distribution]
    return jsonify(data)

@app.route("/login", methods=["POST"])
def login_user_route():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Account does not exist!"}), 401

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password!"}), 401
    
    login_user(user)

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone_no": user.phone_no
    })

@app.route('/getUserRole', methods=['GET'])
@login_required
def get_user_role():
    user = current_user
    user_type = user.discriminator

    if user_type == "student":
        is_mentor = user.is_mentor
        return jsonify({"type": user_type, "is_mentor": is_mentor, "id": user.id})
    elif user_type == "admin":
        return jsonify({"type": user_type, "id": user.id})

@app.route("/logout", methods=["POST"])
def logout():
    logout_user()  # This is the function from flask_login
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route('/get_student_matching_id', methods=["GET"])
@login_required
def get_student_matching_id():
    user = current_user
    user_type = user.discriminator
    if user_type == "student":
        if user.is_mentor == False:
            matching = Matching.query.filter_by(client_id=current_user.id).first()
            matching_id = matching.matching_id
            return jsonify({"matching_id": matching_id}), 200
        if user.is_mentor == True:
            matching = Matching.query.filter_by(mentor_id=current_user.id).first()
            matching_id = matching.matching_id
            return jsonify({"matching_id": matching_id}), 200

@app.route('/submit-form', methods=['POST'])
def submit_form():
    data = request.get_json()
    new_form = Form(
        form_name=data.get('form_name'),
        form_ic=data.get('form_ic'),
        form_matric_no=data.get('form_matric_no'),
        form_programme=data.get('form_programme'),
        form_school=data.get('form_school'),
        form_country=data.get('form_country'),
        form_languages=data.get('form_languages'),
        form_phone_no=data.get('form_phone_no'),
        form_email=data.get('form_email'),
        form_allergies=data.get('form_allergies')
    )
    db.session.add(new_form)
    db.session.commit()
    return jsonify({'message': 'Form submitted successfully'}), 201

if __name__ == "__main__":
    # db.create_all()
    app.run(debug=True)