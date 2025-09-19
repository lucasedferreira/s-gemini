from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from modules.gemini_analyzer import GeminiAnalyzer
from config import Config

analyzer_bp = Blueprint('analyzer', __name__)

@analyzer_bp.route('/api/analyze', methods=['POST'])
@cross_origin()
def analyze_teaching_plan():
    try:
        api_key = request.headers.get('Gemini-API-Key')
        if not api_key:
            return jsonify({'error': 'API Key não fornecida'}), 401

        gemini_analyzer = GeminiAnalyzer(api_key)
        data = request.get_json()

        if not data or 'prompt' not in data:
            return jsonify({'error': 'Prompt não fornecido'}), 400

        prompt = data['prompt']
        result = gemini_analyzer.analyze_content(prompt)

        if result['success']:
            return jsonify(result)
        else:
            return jsonify({'error': result['error']}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
