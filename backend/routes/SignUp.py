from flask import Flask
from flask import json
from flask import Blueprint

SignUp = Blueprint('SignUp', __name__)


@SignUp.route("/sign_up")
def sign_up():
    return "Sign up/Registration page to add a new user."