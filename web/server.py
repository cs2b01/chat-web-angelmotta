from flask import Flask,render_template, request, session, Response, redirect
from database import connector
from model import entities
import json
import time
from sqlalchemy import or_

db = connector.Manager()
engine = db.createEngine()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<content>')
def static_content(content):
    return render_template(content)

@app.route('/authenticate', methods = ['POST'])
def authenticate():
    #Get data from request
    time.sleep(3)
    message = json.loads(request.data)
    username = message['username']
    password = message['password']
    #look in database
    db_session = db.getSession(engine)
    try:
        user = db_session.query(entities.User
        ).filter(entities.User.username == username
        ).filter(entities.User.password == password
        ).one()
        #return render_template("success.html")
        session['logged_user'] = user.id
        message = {'message': 'Authorized'}
        return Response(message, status=200, mimetype='application/json')
    except Exception:
        #return render_template("fail.html")
        message = {'message': 'Unauthorized'}
        return Response(message, status=401, mimetype='application/json')

@app.route('/users', methods = ['GET'])
def get_users():
    session = db.getSession(engine)
    dbResponse = session.query(entities.User)
    data = []
    for user in dbResponse:
        data.append(user)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype='application/json')

@app.route('/users', methods = ['POST'])
def create_user():
    c =  json.loads(request.form['values'])
    user = entities.User(
        username=c['username'],
        name=c['name'],
        fullname=c['fullname'],
        password=c['password']
    )
    session = db.getSession(engine)
    session.add(user)
    session.commit()
    return 'Created User'

@app.route('/users', methods = ['PUT'])
def update_user():
    session = db.getSession(engine)
    id = request.form['key']
    user = session.query(entities.User).filter(entities.User.id == id).first()
    c =  json.loads(request.form['values'])
    for key in c.keys():
        setattr(user, key, c[key])
    session.add(user)
    session.commit()
    return 'Updated User'

@app.route('/users', methods = ['DELETE'])
def delete_user():
    id = request.form['key']
    session = db.getSession(engine)
    users = session.query(entities.User).filter(entities.User.id == id)
    for user in users:
        session.delete(user)
    session.commit()
    return "Deleted User"

@app.route('/users/<id>', methods = ['GET'])
def get_user(id):
    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.id == id)
    for user in users:
        js = json.dumps(user, cls=connector.AlchemyEncoder)
        return  Response(js, status=200, mimetype='application/json')

    message = { 'status': 404, 'message': 'Not Found'}
    return Response(message, status=404, mimetype='application/json')

@app.route('/create_test_users', methods = ['GET'])
def create_test_users():
    db_session = db.getSession(engine)
    user = entities.User(name="David", fullname="Lazo", password="1234", username="qwerty")
    db_session.add(user)
    db_session.commit()
    return "Test user created!"

## Messages Methods
@app.route('/messages', methods = ['GET'])
def get_Message():
    session = db.getSession(engine)
    dbResponse = session.query(entities.Message)
    data = []
    for messages in dbResponse:
        data.append(messages)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype='application/json')

@app.route('/messages/<id>', methods = ['GET'])
def get_Message_id(id):
    db_session = db.getSession(engine)
    #dbResponse_messages = db_session.query(entities.Message).filter(entities.Message.user_from_id == id)
    dbResponse_messages = db_session.query(entities.Message).filter(or_((entities.Message.user_from_id == id) & (entities.Message.user_to_id == 4),
                                                                    (entities.Message.user_from_id == 4) & (entities.Message.user_to_id == id)))
    data_messages = []
    for msg in dbResponse_messages:
        data_messages.append(msg)
    js = json.dumps(data_messages, cls=connector.AlchemyEncoder)
    print(js)
    return  Response(js, status=200, mimetype='application/json')
    message = { 'status': 404, 'message': 'Not Found'}
    return Response(message, status=404, mimetype='application/json')

@app.route('/messages', methods = ['POST'])
def create_Message():
    c = json.loads(request.form['values'])
    message = entities.Message(
        content=c['content'],
        user_from_id=c['user_from_id'],
        user_to_id=c['user_to_id'],
    )
    session = db.getSession(engine)
    session.add(message)
    session.commit()
    return 'Created Message'

@app.route('/create_messages', methods = ['GET'])
def create_test_messages():
    db_session = db.getSession(engine)
    message = entities.Message(user_from_id="3", user_to_id="2", content="Otro hola")
    db_session.add(message)
    db_session.commit()
    return "Test message created!"

## End Messages Methods

@app.route('/current', methods = ["GET"])
def current_user():
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(
        entities.User.id == session['logged_user']
        ).first()
    return Response(json.dumps(
            user,
            cls=connector.AlchemyEncoder),
            mimetype='application/json'
        )

@app.route('/logout', methods = ["GET"])
def logout():
    session.clear()
    return render_template('index.html')

if __name__ == '__main__':
    app.secret_key = ".."
    app.run(port=8080, threaded=True, host=('127.0.0.1'))
