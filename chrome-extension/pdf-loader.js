// pdf-loader.js
const PDFJS = window['pdfjs-dist/build/pdf'];
PDFJS.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs');

async function loadPDFFromUrl(url) {
    try {
        console.log('Carregando PDF da URL:', url);

        const loadingTask = PDFJS.getDocument(url);
        const pdf = await loadingTask.promise;
        console.log('PDF carregado:', pdf.numPages, 'páginas');

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `===== Page ${i} =====\n\n${pageText}\n\n`;
        }

        return fullText;
    } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        throw error;
    }
}

async function extractPDFData(url) {
    try {
        const pdfText = await loadPDFFromUrl(url);
        return pdfText;
    } catch (error) {
        console.error('Erro na extração do PDF:', error);
        return null;
    }
}
