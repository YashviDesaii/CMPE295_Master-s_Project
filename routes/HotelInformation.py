from flask import Flask
from flask import json
from flask import Blueprint

HotelInformation = Blueprint('HotelInformation', __name__)


@HotelInformation.route("/hotel_information")
def hotel_information():
    return "All the information related to a particular hotel, like cases it's been involved in, images gathered so far."