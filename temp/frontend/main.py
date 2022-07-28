from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import requests
import json

app = Flask(__name__)


def login(username, password, email):
    # create login spec
    if email == None:
        login_spec = {"username":username, "password":password}
    else:
        login_spec = {"username":username, "password":password, "email":email}
    # send login spec to server
    r = requests.post("https://api.multiauth.us/auth/register", json=login_spec).json()
    print(r)
    if r['success'] == True:
        return True
    else:
        return r["message"]
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/register', methods=['POST'])
def register():
    # get form data
    username = request.form['username']
    password = request.form['password']
    confpassword = request.form['confopassword']
    try:
        email = request.form['email']
    except:
        email = None
    if email == '' or email == None:
        email = None
    if password == '' or password == None:
        return render_template('index.html', error="Password cannot be empty")
    if username == '' or username == None:
        return render_template('index.html', error="Username cannot be empty")
    if password != confpassword:
        return render_template('index.html', error="Passwords do not match")
    # call login function
    lgtv = login(username, password, email)
    # redirect to login page
    if lgtv == True:
        return redirect(url_for('index', type="success", message="Registration successful! Welcome " + username))
    else:
        return redirect(url_for('index', type="error", message=lgtv))

if __name__ == '__main__':
    app.run(debug=True)