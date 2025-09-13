from flask import Blueprint, request, jsonify, render_template
from werkzeug.utils import secure_filename
import json
import os
from config import Config
from modules.omr import process_exam_pdf

omr_bp = Blueprint('omr', __name__)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@omr_bp.route("/omr", methods=["GET", "POST"])
def upload_file():
    if request.method == "GET":
        return render_template("omr.html")
    
    if "file" not in request.files or "gabarito" not in request.form:
        return jsonify({"error": "Arquivo PDF e gabarito são obrigatórios!"}), 400

    file = request.files["file"]
    gabarito_text = request.form["gabarito"].strip().upper().split()

    if not file or file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)

        try:
            resultados = process_exam_pdf(filepath, gabarito_text)
            
            # Salva resultados em JSON
            result_json = json.dumps(resultados, indent=2, ensure_ascii=False)
            with open(os.path.join(Config.DEBUG_FOLDER, "resultados.json"), "w", encoding="utf-8") as f:
                f.write(result_json)
            
            # Prepara dados para exibição na página
            html_result = "<h3>Resultados da Correção</h3>"
            for i, resultado in enumerate(resultados):
                html_result += f"""
                <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
                    <h4>Página {i+1}</h4>
                    <p><strong>Aluno:</strong> {resultado['nome']}</p>
                    <p><strong>Respostas:</strong> {resultado['respostas']}</p>
                    <p><strong>Nota:</strong> {resultado['nota']}/{len(gabarito_text)}</p>
                    <p><strong>Debug:</strong> <a href="/debug/{os.path.basename(resultado['debug_image'])}" target="_blank">Ver imagem</a></p>
                </div>
                """
            
            return jsonify({
                "status": "success",
                "html": html_result,
                "resultados": resultados,
                "message": f"Processado {len(resultados)} página(s) com sucesso!"
            })
            
        except Exception as e:
            return jsonify({"error": f"Erro no processamento: {str(e)}"}), 500
        finally:
            # Remove o arquivo após processamento
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({"error": "Tipo de arquivo não permitido. Use apenas PDF."}), 400

@omr_bp.route('/debug/<filename>')
def serve_debug_image(filename):
    return os.path.join(Config.DEBUG_FOLDER, filename)
