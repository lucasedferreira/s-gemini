import markdown
from google import genai
from google.genai import types
from config import Config

class GeminiAnalyzer:
    def __init__(self):
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY não encontrada nas variáveis de ambiente")
        
        self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
    
    def analyze_content(self, prompt: str) -> dict:
        """
        Analisa conteúdo usando a API Gemini
        """
        try:
            response = self.client.models.generate_content(
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

            return {
                'success': True,
                'html_content': html_content,
                'text_response': response.text
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
