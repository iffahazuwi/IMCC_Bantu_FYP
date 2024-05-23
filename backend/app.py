from flask import Flask, jsonify, request, abort, redirect, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from sqlalchemy.orm import aliased
from functools import wraps
from models import Matching, Student, db, User, Feedback, Application, Post, Notification, Admin, Bookmark
from config import ApplicationConfig
from werkzeug.utils import secure_filename
from flask_session import Session
from datetime import datetime
import os
import base64

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = 'C:\\Users\\USER\\IMCC_Bantu_FYP\\uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

bcrypt = Bcrypt(app)
CORS(app, origins="http://localhost:3000", supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

login_manager = LoginManager()
login_manager.init_app(app)

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
        "is_mentor": user.is_mentor
        })
    else:
        return jsonify({"error": "Unknown user type"}), 400

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    name = request.json["name"]
    matric_no = request.json["matric_no"]
    phone_no = request.json["phone_no"]
    school = request.json["school"]
    is_mentor = False
    type = "student"

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
                       phone_no=phone_no, school=school, is_mentor=is_mentor)
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
            "is_mentor": new_user.is_mentor
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
    app_skill = request.form.get("app_skill")
    app_date = datetime.now()
    file = request.files['file']

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        application = Application(id=user.id, app_gender=app_gender, app_country=app_country, 
                                  app_language=app_language, app_skill=app_skill, app_filename=filename, 
                                  app_filedata=file_path, app_date=app_date)
        db.session.add(application)
        db.session.commit()

        return jsonify({"message": "Mentor Application submitted successfully!"}), 200
    else:
        return jsonify({"error": "No file selected!"}), 400
    
@app.route('/get-applications', methods=['GET'])
@login_required
@admin_required
def get_applications():
    try:
        applications = Application.query.all()
        if not applications:
            return jsonify({"error": "No applications found"}), 404
        
        applications_list = [
            {
                'app_id': app.app_id,
                "app_gender": app.app_gender,
                "app_country": app.app_country,
                "app_language": app.app_language,
                "app_skill": app.app_skill,
                "app_filename": app.app_filename,
                'app_filedata': base64.b64encode(app.app_filedata).decode('utf-8'),
                'user_name': app.user.name,
                'matric_no': app.user.matric_no,
                'school': app.user.school,
                'phone_no': app.user.phone_no,
                'email': app.user.email,
                'app_date': app.app_date.strftime('%Y-%m-%d'),
                "app_status": app.app_status
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
    app_id = data.get('app_id')
    new_status = data.get('status')

    application = Application.query.filter_by(app_id=app_id).first()
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    application.app_status = new_status

    if new_status == 'Approved':
        student = Student.query.filter_by(id=application.id).first()
        if student:
            student.is_mentor = True

    db.session.commit()
    return jsonify({'success': 'Status updated successfully'})
    
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
    posts_list = [
        {
            'post_id': post.post_id,
            'title': post.post_title,
            'description': post.post_desc,
            'date': post.post_date.strftime('%Y-%m-%d'),
            'name': post.user.name
        }
        for post in posts
    ]
    return jsonify(posts_list)

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
    bookmarks_list = [
        {
            'post_id': bookmark.post.post_id,
            'title': bookmark.post.post_title,
            'description': bookmark.post.post_desc,
            'date': bookmark.post.post_date.strftime('%Y-%m-%d'),
            'name': bookmark.post.user.name
        }
        for bookmark in bookmarks
    ]
    return jsonify(bookmarks_list)

@app.route('/submit-feedback', methods=['POST'])
@login_required
def submit_feedback():
    user = current_user
    
    feedback_desc = request.json["feedback_desc"]
    feedback_date = datetime.now()

    feedback = Feedback(id=user.id, feedback_desc=feedback_desc, feedback_date=feedback_date)
    db.session.add(feedback)
    db.session.commit()

    return 'Feedback submitted successfully!'

@app.route('/get-clients', methods=['GET'])
@login_required
@admin_required
def get_clients():
    clients = Student.query.filter_by(is_mentor=False).all()
    client_list = [{"id": client.id, "name": client.name} for client in clients]
    return jsonify(client_list)

@app.route('/get-mentors', methods=['GET'])
@login_required
@admin_required
def get_mentors():
    mentors = Student.query.filter_by(is_mentor=True).all()
    mentor_list = [{"id": mentor.id, "name": mentor.name} for mentor in mentors]
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

        return 'New match has been created successfully!', 201
    except Exception as e:
        print(f"Error: {e}")
        return str(e), 500
    
from sqlalchemy.orm import aliased

@app.route('/getMatches', methods=['GET'])
@login_required
@admin_required
def get_matches():
    Client = aliased(Student)
    Mentor = aliased(Student)

    matches = db.session.query(
        Matching.matching_id,
        Client.name.label('client_name'),
        Client.matric_no.label('client_matric_no'),
        Mentor.name.label('mentor_name'),
        Mentor.matric_no.label('mentor_matric_no'),
        Matching.matching_date
    ).join(Client, Matching.client_id == Client.id).join(Mentor, Matching.mentor_id == Mentor.id
                                                         ).order_by(Matching.matching_date.desc()).all()

    matches_list = [{"matching_id": match.matching_id, 
                     "client_name": match.client_name, 
                     "client_matric_no": match.client_matric_no,
                     "mentor_name": match.mentor_name,
                     "mentor_matric_no": match.mentor_matric_no,
                     "matching_date": match.matching_date.strftime('%Y-%m-%d %H:%M:%S')} for match in matches]
    return jsonify(matches_list)

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
@admin_required
def get_feedback(matching_id):
    feedback = db.session.query(
        Feedback.feedback_desc,
        Feedback.feedback_date
    ).join(Matching, Feedback.id == Matching.client_id).filter(Matching.matching_id == matching_id).first()

    if feedback:
        feedback_data = {
            "feedback_desc": feedback.feedback_desc,
            "feedback_date": feedback.feedback_date.strftime('%Y-%m-%d')
        }
        return jsonify(feedback_data)
    else:
        return jsonify({"error": "No feedback found"}), 404

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
    return jsonify({"type": user_type})

@app.route("/logout", methods=["POST"])
def logout():
    logout_user()  # This is the function from flask_login
    return jsonify({"message": "Logged out successfully!"}), 200

if __name__ == "__main__":
    # db.create_all()
    app.run(debug=True)