from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from prerequsites import generate_prerequisites_ollama, create_solid_line_graph
import matplotlib.pyplot as plt
import json
import io

app = Flask(__name__)
CORS(app)

DATA_FILE = 'graph_data.json'

@app.route('/')
def home():
    return '✅ Flask API running. Use frontend at http://localhost:5173'

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    topic = data.get('topic', 'Deep Learning')
    model = data.get('model', 'gemma:2b')
    layout = data.get('layout', 'hierarchical')

    prereq_data = generate_prerequisites_ollama(topic, model)
    create_solid_line_graph(prereq_data, layout)

    with open(DATA_FILE, 'w') as f:
        json.dump(prereq_data, f)

    img_io = io.BytesIO()
    plt.savefig(img_io, format='png')
    img_io.seek(0)
    plt.close()
    return send_file(img_io, mimetype='image/png')

@app.route('/download_json')
def download_json():
    return send_file(DATA_FILE, as_attachment=True)

if __name__ == '__main__':
    app.run(port=8000)
