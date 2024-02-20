from flask import Flask
from flask import Blueprint

HotelIdentification = Blueprint('HotelIdentification', __name__)

@HotelIdentification.route('/hote_identification')
def hote_identification():
    return "This page will show the police officer the top 5 hotels that match with the photo uploaded by them."