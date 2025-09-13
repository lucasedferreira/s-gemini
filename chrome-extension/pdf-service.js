// pdf-service.js
class PDFService {
    constructor() {
        this.pdfjsLib = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Import dinâmico do pdfjs-dist
            const pdfjsLib = await import(chrome.runtime.getURL('node_modules/pdfjs-dist/build/pdf.min.mjs'));
            const pdfWorker = await import(chrome.runtime.getURL('node_modules/pdfjs-dist/build/pdf.worker.min.mjs'));
            
            this.pdfjsLib = pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
            
            this.isInitialized = true;
            console.log('PDF.js inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar PDF.js:', error);
            throw error;
        }
    }

    async loadPDFFromUrl(url) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            console.log('Carregando PDF da URL:', url);
            
            const loadingTask = this.pdfjsLib.getDocument({
                url: url,
                withCredentials: false
            });
            
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

    async extractPDFData(url) {
        try {
            console.log(`url`, url);
            const pdfText = await this.loadPDFFromUrl(url);
            return pdfText;
        } catch (error) {
            console.error('Erro na extração do PDF:', error);
            return null;
        }
    }
}

// Singleton instance
const pdfService = new PDFService();
