from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from modules.gemini_analyzer import GeminiAnalyzer

analyzer_bp = Blueprint('analyzer', __name__)
gemini_analyzer = GeminiAnalyzer()

@analyzer_bp.route('/api/analyze', methods=['POST'])
@cross_origin()
def analyze_teaching_plan():
    try:
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

@analyzer_bp.route('/api/export-pdf', methods=['POST'])
@cross_origin()
def export_pdf():
    try:
        data = request.get_json()

        if not data or 'html_content' not in data:
            return jsonify({'error': 'Conteúdo HTML não fornecido'}), 400

        return jsonify({
            'success': True,
            'html_content': data['html_content']
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
