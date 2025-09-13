import fitz  # PyMuPDF
import cv2
import numpy as np
import pytesseract
from typing import List, Dict, Any
import re
import os
from config import Config

# Configuração do Tesseract
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD

def process_exam_pdf(pdf_path: str, gabarito: List[str]) -> List[Dict[str, Any]]:
    """
    Processa um PDF de provas, retornando lista de dicionários:
    [{nome, respostas, nota}, ...]
    """
    doc = fitz.open(pdf_path)
    resultados = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=300)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3)
        
        # Converte RGB para BGR (OpenCV usa BGR)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        nome = extract_name(img)
        respostas = extract_answers_fixed_grid(img, len(gabarito))
        nota = grade(respostas, gabarito)

        # Salva imagem de debug
        debug_path = f"{Config.DEBUG_FOLDER}/debug_page_{page_num}.jpg"
        save_debug_image(img, respostas, debug_path)

        resultados.append({
            "nome": nome,
            "respostas": respostas,
            "nota": nota,
            "debug_image": debug_path
        })

    return resultados

def extract_name(img: np.ndarray) -> str:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang="por", config='--psm 6')
    
    match = re.search(r"Nome:\s*([A-Za-zÀ-ÿ\s]+)", text)
    if match:
        return match.group(1).strip()
    return "NOME_NÃO_RECONHECIDO"

def extract_answers_fixed_grid(img: np.ndarray, num_questions: int, debug_path: str = "debug_grid.jpg") -> List[str]:
    respostas = ["-"] * num_questions
    choices = ["A", "B", "C", "D"]

    start_x = 890
    start_y = 509
    box_width = 56
    box_height = 56
    gap_x = 32
    spacing_y = 84
    col_gap = 539

    debug_img = img.copy()

    for i in range(num_questions):
        if i < 15:  # coluna da esquerda
            base_x = start_x
            base_y = start_y + i * spacing_y
        else:       # coluna da direita
            base_x = start_x + col_gap
            base_y = start_y + (i - 15) * spacing_y

        preenchimentos = []
        for j in range(4):
            x1 = base_x + j * (box_width + gap_x)
            y1 = base_y
            roi = img[y1:y1+box_height, x1:x1+box_width]

            # Processamento simples
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            fill_ratio = cv2.countNonZero(th) / (box_width * box_height)

            preenchimentos.append(fill_ratio)

            # 🔴 desenha o retângulo para debug
            cv2.rectangle(debug_img, (x1, y1), (x1+box_width, y1+box_height), (0, 0, 255), 10)
            cv2.putText(debug_img, f"{i+1}{choices[j]}", (x1, y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)

        max_fill = max(preenchimentos)
        if max_fill > 0.2:
            respostas[i] = choices[preenchimentos.index(max_fill)]

    cv2.imwrite(debug_path, debug_img)
    print(f"[DEBUG] Imagem salva em {debug_path}")

    return respostas

def grade(respostas: List[str], gabarito: List[str]) -> int:
    """
    Calcula a nota comparando respostas com gabarito.
    """
    score = 0
    for r, g in zip(respostas, gabarito):
        if r == g:
            score += 1
    return score

def save_debug_image(img: np.ndarray, respostas: List[str], path: str):
    """
    Salva imagem com informações de debug.
    """
    debug_img = img.copy()
    h, w = debug_img.shape[:2]

    # Adiciona texto com as respostas detectadas
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(debug_img, f"Respostas: {respostas}", (10, h-30), 
                font, 0.6, (0, 0, 255), 2)

    cv2.imwrite(path, debug_img)
