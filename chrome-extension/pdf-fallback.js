// pdf-fallback.js - Fallback para extração simples de PDF
async function simplePDFExtraction() {
    try {
        // Tenta usar a API nativa do navegador para PDFs
        const pdfContainer = document.querySelector('embed[type="application/pdf"]') ||
            document.querySelector('iframe[src*=".pdf"]');

        if (pdfContainer) {
            console.log('PDF detectado via embed/iframe');
            // Para PDFs embutidos, precisamos de uma abordagem diferente
            return await extractFromEmbeddedPDF();
        }

        // Para PDFs nativos do navegador
        const paragraphs = document.querySelectorAll('p');
        let text = '';

        paragraphs.forEach(p => {
            text += p.textContent + '\n';
        });

        return text || document.body.innerText;

    } catch (error) {
        console.error('Erro na extração simples:', error);
        return null;
    }
}

async function extractFromEmbeddedPDF() {
    // Implementação básica para PDFs embutidos
    return document.body.innerText;
}
