from flask import Flask
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard


app = Flask(__name__)


app.register_blueprint(SignIn.SignIn)
app.register_blueprint(SignUp.SignUp)
app.register_blueprint(NewPoliceReport.NewPoliceReport)
app.register_blueprint(HotelIdentification.HotelIdentification)
app.register_blueprint(CaseInformation.CaseInformation)
app.register_blueprint(HotelInformation.HotelInformation)
app.register_blueprint(CrimeMapping.CrimeMapping)
app.register_blueprint(StatisticsDashboard.StatisticsDashboard)


if __name__ == '__app__':
    app.run(debug=True)