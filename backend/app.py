from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ============ HELPER FUNCTIONS ============

def generate_incident_id():
    """Génère un ID d'incident au format INC-YYYY-NNN"""
    current_year = datetime.now().year
    
    # Récupérer le dernier incident de l'année en cours
    last_incident = db.session.query(Incident)\
        .filter(Incident.id.like(f'INC-{current_year}-%'))\
        .order_by(Incident.id.desc())\
        .first()
    
    if last_incident:
        last_number = int(last_incident.id.split('-')[-1])
        next_number = last_number + 1
    else:
        next_number = 1
    
    return f'INC-{current_year}-{next_number:03d}'

def get_or_404(model, id):
    """Remplace Query.get_or_404 pour SQLAlchemy 2.x"""
    obj = db.session.get(model, id)
    if obj is None:
        abort(404, description=f"{model.__name__} not found")
    return obj

# ============ MODELS ============

class Vulnerability(db.Model):
    __tablename__ = "vulnerabilities"
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)
    severity = db.Column(db.String, nullable=False)
    system = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    status = db.Column(db.String, nullable=False)
    discoveredat = db.Column(db.DateTime, nullable=False)
    cvssscore = db.Column(db.Float, nullable=False)
    incidents = db.relationship('Incident', backref='vulnerability', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'severity': self.severity,
            'system': self.system,
            'description': self.description,
            'status': self.status,
            'discoveredAt': self.discoveredat.isoformat() if self.discoveredat else None,
            'cvssScore': self.cvssscore
        }

class Incident(db.Model):
    __tablename__ = "incidents"
    id = db.Column(db.String, primary_key=True)
    vulnerabilityid = db.Column(db.String, db.ForeignKey('vulnerabilities.id'), nullable=False)
    assignedto = db.Column(db.String, nullable=False)
    priority = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    createdat = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'vulnerabilityId': self.vulnerabilityid,
            'assignedTo': self.assignedto,
            'priority': self.priority,
            'description': self.description,
            'createdAt': self.createdat.isoformat() if self.createdat else None
        }

# ============ HEALTH CHECK ============

@app.route('/health')
def health():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "database": "disconnected", "details": str(e)}), 500

# ============ VULNERABILITIES ROUTES ============

@app.route('/api/vulnerabilities', methods=['GET'])
def get_vulnerabilities():
    try:
        vulnerabilities = db.session.query(Vulnerability).all()
        return jsonify([vuln.to_dict() for vuln in vulnerabilities]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch vulnerabilities", "details": str(e)}), 500

@app.route('/api/vulnerabilities/<string:vuln_id>', methods=['GET'])
def get_vulnerability(vuln_id):
    try:
        vulnerability = get_or_404(Vulnerability, vuln_id)
        return jsonify(vulnerability.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Vulnerability not found", "details": str(e)}), 404

@app.route('/api/vulnerabilities', methods=['POST'])
def create_vulnerability():
    try:
        data = request.get_json()
        required_fields = ['id', 'title', 'severity', 'system', 'status', 'cvssScore']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        vulnerability = Vulnerability(
            id=data['id'],
            title=data['title'],
            severity=data['severity'],
            system=data['system'],
            description=data.get('description', ''),
            status=data['status'],
            discoveredat=datetime.fromisoformat(data.get('discoveredAt', datetime.now().isoformat())),
            cvssscore=float(data['cvssScore'])
        )
        
        db.session.add(vulnerability)
        db.session.commit()
        return jsonify(vulnerability.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create vulnerability", "details": str(e)}), 500

@app.route('/api/vulnerabilities/<string:vuln_id>', methods=['PUT'])
def update_vulnerability(vuln_id):
    try:
        vulnerability = get_or_404(Vulnerability, vuln_id)
        data = request.get_json()
        
        if 'title' in data:
            vulnerability.title = data['title']
        if 'severity' in data:
            vulnerability.severity = data['severity']
        if 'system' in data:
            vulnerability.system = data['system']
        if 'description' in data:
            vulnerability.description = data['description']
        if 'status' in data:
            vulnerability.status = data['status']
        if 'cvssScore' in data:
            vulnerability.cvssscore = float(data['cvssScore'])
        
        db.session.commit()
        return jsonify(vulnerability.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update vulnerability", "details": str(e)}), 500

@app.route('/api/vulnerabilities/<string:vuln_id>', methods=['DELETE'])
def delete_vulnerability(vuln_id):
    try:
        vulnerability = get_or_404(Vulnerability, vuln_id)
        db.session.delete(vulnerability)
        db.session.commit()
        return jsonify({"message": "Vulnerability deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete vulnerability", "details": str(e)}), 500

# ============ INCIDENTS ROUTES ============

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    try:
        incidents = db.session.query(Incident).all()
        return jsonify([incident.to_dict() for incident in incidents]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch incidents", "details": str(e)}), 500

@app.route('/api/incidents/<string:incident_id>', methods=['GET'])
def get_incident(incident_id):
    try:
        incident = get_or_404(Incident, incident_id)
        return jsonify(incident.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Incident not found", "details": str(e)}), 404

@app.route('/api/incidents', methods=['POST'])
def create_incident():
    try:
        data = request.get_json()
        required_fields = ['vulnerabilityId', 'assignedTo', 'priority']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        vulnerability = db.session.get(Vulnerability, data['vulnerabilityId'])
        if not vulnerability:
            return jsonify({"error": "Vulnerability not found"}), 404
        
        incident_id = generate_incident_id()
        incident = Incident(
            id=incident_id,
            vulnerabilityid=data['vulnerabilityId'],
            assignedto=data['assignedTo'],
            priority=data['priority'],
            description=data.get('description', ''),
            createdat=datetime.now()
        )
        
        db.session.add(incident)
        db.session.commit()
        return jsonify(incident.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create incident", "details": str(e)}), 500

@app.route('/api/incidents/<string:incident_id>', methods=['PUT'])
def update_incident(incident_id):
    try:
        incident = get_or_404(Incident, incident_id)
        data = request.get_json()
        
        if 'assignedTo' in data:
            incident.assignedto = data['assignedTo']
        if 'priority' in data:
            incident.priority = data['priority']
        if 'description' in data:
            incident.description = data['description']
        
        db.session.commit()
        return jsonify(incident.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update incident", "details": str(e)}), 500

@app.route('/api/incidents/<string:incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    try:
        incident = get_or_404(Incident, incident_id)
        db.session.delete(incident)
        db.session.commit()
        return jsonify({"message": "Incident deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete incident", "details": str(e)}), 500

# ============ STATISTICS ROUTES ============

@app.route('/api/stats/vulnerabilities', methods=['GET'])
def get_vulnerability_stats():
    try:
        total = db.session.query(Vulnerability).count()
        by_severity = db.session.query(
            Vulnerability.severity, 
            db.func.count(Vulnerability.id)
        ).group_by(Vulnerability.severity).all()
        
        by_status = db.session.query(
            Vulnerability.status, 
            db.func.count(Vulnerability.id)
        ).group_by(Vulnerability.status).all()
        
        return jsonify({
            "total": total,
            "bySeverity": dict(by_severity),
            "byStatus": dict(by_status)
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch statistics", "details": str(e)}), 500

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500

# ============ DATABASE INITIALIZATION ============

@app.cli.command()
def init_db():
    db.create_all()
    print("Database initialized!")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
