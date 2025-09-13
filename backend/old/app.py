import os
import markdown
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não encontrada nas variáveis de ambiente")

client = genai.Client(api_key=GEMINI_API_KEY)

@app.route('/api/analyze', methods=['POST'])
def analyze_teaching_plan():
    try:
        data = request.get_json()

        if not data or 'prompt' not in data:
            return jsonify({'error': 'Prompt não fornecido'}), 400

        prompt = data['prompt']

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=8192,
                response_mime_type="text/plain"
            )
        )

        html_content = markdown.markdown(response.text)

        # Retornar a resposta em HTML
        return jsonify({
            'success': True,
            'html_content': html_content,
            'text_response': response.text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export-pdf', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)