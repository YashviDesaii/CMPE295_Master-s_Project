from flask import Flask
from flask import json
from flask import Blueprint

StatisticsDashboard = Blueprint('StatisticsDashboard', __name__)


@StatisticsDashboard.route("/statistics_dashboard")
def statistics_dashboard():
    return "A main dashboard to show the statistics like the case metrics, any updates made recently, top 3 hotels with the most cases, etc."