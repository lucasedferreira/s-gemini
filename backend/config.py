import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configurações gerais
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # Pastas
    UPLOAD_FOLDER = "uploads"
    DEBUG_FOLDER = "debug"
    STATIC_FOLDER = "static"
    TEMPLATE_FOLDER = "templates"
    
    # Extensões permitidas
    ALLOWED_EXTENSIONS = {"pdf"}
    
    # API Gemini
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Tesseract (se necessário)
    TESSERACT_CMD = os.getenv('TESSERACT_CMD', r"C:\Program Files\Tesseract-OCR\tesseract.exe")
    
    # pdf2image - Poppler path (Windows)
    POPPLER_PATH = os.getenv('POPPLER_PATH', r"C:\poppler\Library\bin")

def create_folders():
    """Cria as pastas necessárias para a aplicação"""
    folders = [
        Config.UPLOAD_FOLDER,
        Config.DEBUG_FOLDER,
        Config.STATIC_FOLDER
    ]
    
    for folder in folders:
        os.makedirs(folder, exist_ok=True)
