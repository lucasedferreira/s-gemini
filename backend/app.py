import os
from flask import Flask, render_template
from config import Config, create_folders
from routes.omr_routes import omr_bp
from routes.analyzer_routes import analyzer_bp

# Criar pastas necessárias
create_folders()

app = Flask(__name__)
app.config.from_object(Config)

# Registrar blueprints
app.register_blueprint(omr_bp)
app.register_blueprint(analyzer_bp)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
