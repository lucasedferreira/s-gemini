FROM python:3.13.7-slim

WORKDIR /app

WORKDIR /app

# Instalar dependências do sistema incluindo libGL para OpenCV
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-por \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código da aplicação
COPY . .

# Expor a porta do Flask
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["python", "app.py"]
