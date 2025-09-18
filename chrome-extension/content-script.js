// content-script.js - Para injetar em páginas PDF
(function () {
    'use strict';

    // Observar mudanças no DOM para capturar conteúdo carregado dinamicamente
    const observer = new MutationObserver(() => {
        // O visualizador de PDF pode carregar conteúdo gradualmente
        console.log('DOM modificado - conteúdo PDF pode estar disponível');
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Função global para extração de texto
    window.extractPDFText = function () {
        try {
            // Tentar encontrar o canvas/text layer do visualizador de PDF
            const textLayer = document.querySelector('.textLayer') ||
                document.querySelector('[class*="text"]');

            let textContent = '';

            if (textLayer) {
                textContent = textLayer.textContent;
            } else {
                // Fallback: todo o texto do body
                textContent = document.body.textContent;

                // Tentar limpar texto irrelevante
                textContent = textContent
                    .replace(/\d+\s*\/\s*\d+/g, '') // Remover números de página
                    .replace(/[^\w\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ.,;:!?()-]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            return textContent || 'Não foi possível extrair texto';

        } catch (error) {
            console.error('Erro na extração:', error);
            return 'Erro na extração: ' + error.message;
        }
    };

})();
