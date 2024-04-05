from flask import Flask, jsonify, request, abort, session
# from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
# import datetime
# from flask_marshmallow import Marshmallow
from flask_cors import CORS
from models import db, User
from config import ApplicationConfig
from flask_session import Session

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    name = request.json["name"]
    matric_no = request.json["matric_no"]
    phone_no = request.json["phone_no"]
    school = request.json["school"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, name=name, matric_no=matric_no, phone_no=phone_no, school=school)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "matric_no": new_user.matric_no,
        "phone_no": new_user.phone_no,
        "email": new_user.email,
        "school": new_user.school
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

# @app.route("/logout", methods=["POST"])
# def logout_user():
#     session.pop("user_id")
#     return "200"

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flask2'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# ma = Marshmallow(app)

# class Articles(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100))
#     body = db.Column(db.Text())
#     date = db.Column(db.DateTime, default = datetime.datetime.now)

#     def __init__(self, title, body):
#         self.title = title
#         self.body = body

# class ArticleSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'title', 'body', 'date')

# article_schema = ArticleSchema()
# articles_schema = ArticleSchema(many=True)

# class Feedbacks(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     comment = db.Column(db.Text())
#     date = db.Column(db.DateTime, default = datetime.datetime.now)

#     def __init__(self, comment):
#         self.comment = comment

# class FeedbackSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'comment', 'date')

# feedback_schema = FeedbackSchema()
# feedbacks_schema = FeedbackSchema(many=True)

# @app.route('/community-page/get', methods = ['GET'])
# def get_articles():
#     all_articles = Articles.query.all()
#     results = articles_schema.dump(all_articles)
#     return jsonify(results)

# @app.route('/community-page/get/<id>/', methods = ['GET'])
# def post_details(id):
#     article = Articles.query.get(id)
#     return article_schema.jsonify(article)

# @app.route('/community-page/add', methods = ['POST'])
# def add_article():
#     title = request.json['title']
#     body = request.json['body']

#     articles = Articles(title, body)
#     db.session.add(articles)
#     db.session.commit()
#     return article_schema.jsonify(articles)

# @app.route('/community-page/update/<id>/', methods = ['PUT'])
# def update_article(id):
#     article = Articles.query.get(id)

#     title = request.json['title']
#     body = request.json['body']

#     article.title = title
#     article.body = body

#     db.session.commit()
#     return article_schema.jsonify(article)

# @app.route('/community-page/delete/<id>/', methods = ['DELETE'])
# def article_delete(id):
#     article = Articles.query.get(id)
#     db.session.delete(article)
#     db.session.commit()

#     return article_schema.jsonify(article)

# @app.route('/matching-page/add', methods = ['POST'])
# def submit_feedback():
#     comment = request.json['comment']

#     feedbacks = Feedbacks(comment)
#     db.session.add(feedbacks)
#     db.session.commit()
#     return feedback_schema.jsonify(feedbacks)

if __name__ == "main":
    app.run(debug=True)