from flask import Flask, jsonify, request, Blueprint
from firebase_admin import firestore
from firebase_utils import db

NewPoliceReport = Blueprint('NewPoliceReport', __name__)

@NewPoliceReport.route('/new_report', methods=['POST'])
def new_police_report():
    content = request.json
    doc_ref = db.collection('your_collection_name').document('your_document_id')
    doc_ref.set(content)
    return jsonify({"success": True}), 200