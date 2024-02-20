from flask import Flask
from flask import Blueprint

SignIn = Blueprint('SignIn', __name__)

@SignIn.route('/')
def sign_in():
    return "This is the landing page which allows the users to log in to the portal."