from flask import Flask
from flask import json
from flask import Blueprint

CrimeMapping = Blueprint('CrimeMapping', __name__)


@CrimeMapping.route("/crime_mapping")
def crime_mapping():
    return "A webpage to show a map view of all the reported cases in a region selected by the user, allowing filters and other crime statistics."