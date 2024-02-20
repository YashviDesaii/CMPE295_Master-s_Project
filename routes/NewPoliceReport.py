from flask import Flask
from flask import Blueprint

NewPoliceReport = Blueprint('NewPoliceReport', __name__)

@NewPoliceReport.route('/new_report')
def new_police_report():
    return "This would be the webpage which allows the law enforecement agents to fill out a police report and upload the relevant images to the database."