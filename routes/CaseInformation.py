from flask import Flask
from flask import json
from flask import Blueprint

CaseInformation = Blueprint('CaseInformation', __name__)


@CaseInformation.route("/case_information")
def case_information():
    return "A webpage to show all the information for all the cases under an officer and their status and other related iformation."