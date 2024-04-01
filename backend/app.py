from flask import Flask


app = Flask(__name__)


@app.route('/', methods = ['GET'])
def get_articles():
    return jsonify({"Hello":"World"})


if __name__ == "main":
    app.run(debug=True)