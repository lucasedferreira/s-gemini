document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000';

    const copyBtn = document.getElementById('copyBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const status = document.getElementById('status');

    let extractedData = null;

    // Verificar se estamos em um PDF online ao carregar
    checkCurrentTab();

    copyBtn.addEventListener('click', handleCopy);
    analyzeBtn.addEventListener('click', handleAnalyze);

    async function checkCurrentTab() {
        try {
            const tab = await getCurrentTab();
            if (tab && tab.url && isOnlinePDF(tab.url)) {
                // Estamos em um PDF online, extrair automaticamente
                extractData();
            }
        } catch (error) {
            console.log('Não é um PDF online ou não foi possível verificar');
        }
    }

    function isOnlinePDF(url) {
        return url.toLowerCase().endsWith('.pdf') &&
            !url.startsWith('file://') &&
            (url.startsWith('http://') || url.startsWith('https://'));
    }

    async function extractData() {
        try {
            showStatus('Extraindo conteúdo do PDF...', 'info');

            const tab = await getCurrentTab();
            if (!tab || !tab.url) {
                showStatus('Nenhuma aba ativa encontrada', 'error');
                return;
            }

            if (isOnlinePDF(tab.url)) {
                const pdfText = await extractOnlinePDFContent(tab);

                if (pdfText && pdfText.length > 0) {
                    extractedData = {
                        textoCompleto: pdfText,
                        dataExtracao: new Date().toLocaleString('pt-BR'),
                        url: tab.url,
                        totalPaginas: (pdfText.match(/=== PÁGINA \d+ ===/g) || []).length
                    };
                    showStatus('Conteúdo extraído com sucesso!', 'success');
                    setTimeout(hideStatus, 2000);
                } else {
                    showStatus('Erro ao extrair conteúdo do PDF', 'error');
                }
            } else {
                // Não é PDF online, oferecer upload
                showStatus('Clique para selecionar um PDF', 'info');
            }
        } catch (error) {
            console.error('Erro na extração:', error);
            showStatus('Erro: ' + error.message, 'error');
        }
    }

    async function extractOnlinePDFContent(tab) {
        try {
            showStatus('Extraindo PDF...', 'info');

            // Injetar PDF.js
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['pdf.min.js', 'pdf.worker.min.js']
            });

            // Executar extração
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: extractFullPDFText
            });

            return results[0].result;

        } catch (error) {
            console.error('Erro com PDF online:', error);

            // Fallback: extrair texto básico
            try {
                const fallback = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => document.body.textContent
                });

                return fallback[0].result || 'Não foi possível extrair o conteúdo do PDF';
            } catch (fallbackError) {
                return 'Erro na extração do PDF: ' + error.message;
            }
        }
    }

    function extractFullPDFText() {
        return new Promise(async (resolve) => {
            try {
                if (typeof pdfjsLib === 'undefined') {
                    console.error('PDF.js não carregado');
                    resolve('PDF.js não disponível');
                    return;
                }

                // Configurar worker
                pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.js');

                // Carregar PDF
                const loadingTask = pdfjsLib.getDocument(window.location.href);
                const pdf = await loadingTask.promise;

                let fullText = `=== CONTEÚDO COMPLETO DO PDF ===\n`;
                fullText += `URL: ${window.location.href}\n`;
                fullText += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
                fullText += `Páginas: ${pdf.numPages}\n\n`;

                for (let i = 1; i <= pdf.numPages; i++) {
                    try {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();

                        let pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += `=== PÁGINA ${i} ===\n${pageText}\n\n`;

                    } catch (pageError) {
                        console.error(`Erro página ${i}:`, pageError);
                        fullText += `=== PÁGINA ${i} (ERRO) ===\n\n`;
                    }
                }

                resolve(fullText);

            } catch (error) {
                console.error('Erro geral:', error);
                resolve('Erro na extração: ' + error.message);
            }
        });
    }

    async function handleFileUpload() {
        return new Promise((resolve) => {
            showStatus('Selecione o arquivo PDF...', 'info');

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf';
            input.style.display = 'none';

            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file && file.type === 'application/pdf') {
                    try {
                        showStatus('Processando PDF...', 'info');
                        const arrayBuffer = await file.arrayBuffer();
                        const text = await extractTextFromFile(arrayBuffer, file.name);
                        resolve(text);
                    } catch (error) {
                        console.error('Erro ao processar arquivo:', error);
                        resolve('Erro ao processar o arquivo PDF');
                    }
                } else {
                    resolve('Por favor, selecione um arquivo PDF válido');
                }
            };

            document.body.appendChild(input);
            input.click();

            // Limpar input após 30 segundos se nada for selecionado
            setTimeout(() => {
                if (document.body.contains(input)) {
                    document.body.removeChild(input);
                    resolve('Seleção de arquivo cancelada');
                }
            }, 30000);
        });
    }

    async function extractTextFromFile(arrayBuffer, fileName) {
        return new Promise(async (resolve) => {
            try {
                // Carregar PDF.js
                await loadPDFJS();

                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                let fullText = `=== CONTEÚDO COMPLETO DO PDF ===\n`;
                fullText += `Arquivo: ${fileName}\n`;
                fullText += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
                fullText += `Páginas: ${pdf.numPages}\n\n`;

                for (let i = 1; i <= pdf.numPages; i++) {
                    try {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();

                        let pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += `=== PÁGINA ${i} ===\n${pageText}\n\n`;

                    } catch (pageError) {
                        console.error(`Erro página ${i}:`, pageError);
                        fullText += `=== PÁGINA ${i} (ERRO) ===\n\n`;
                    }
                }

                resolve(fullText);

            } catch (error) {
                console.error('Erro na extração do arquivo:', error);
                resolve('Erro ao extrair texto do PDF');
            }
        });
    }

    async function loadPDFJS() {
        return new Promise((resolve, reject) => {
            if (typeof window.pdfjsLib !== 'undefined') {
                resolve(window.pdfjsLib);
                return;
            }

            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('pdf.min.js');
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.js');
                resolve(window.pdfjsLib);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            return tab;
        } catch (error) {
            console.error('Erro ao obter aba:', error);
            return null;
        }
    }

    async function handleCopy() {
        if (!extractedData) {
            // Se não temos dados extraídos, oferecer upload
            showStatus('Selecionar PDF para copiar...', 'info');
            const pdfText = await handleFileUpload();

            if (pdfText && pdfText.length > 100) { // Pelo menos 100 caracteres
                extractedData = {
                    textoCompleto: pdfText,
                    dataExtracao: new Date().toLocaleString('pt-BR'),
                    url: 'Arquivo local',
                    totalPaginas: (pdfText.match(/=== PÁGINA \d+ ===/g) || []).length
                };
                await copyTeachingPlan();
            } else {
                showStatus('Não foi possível extrair o PDF', 'error');
            }
            return;
        }
        await copyTeachingPlan();
    }

    async function handleAnalyze() {
        if (!extractedData) {
            // Se não temos dados extraídos, oferecer upload
            showStatus('Selecionar PDF para analisar...', 'info');
            const pdfText = await handleFileUpload();

            if (pdfText && pdfText.length > 100) { // Pelo menos 100 caracteres
                extractedData = {
                    textoCompleto: pdfText,
                    dataExtracao: new Date().toLocaleString('pt-BR'),
                    url: 'Arquivo local',
                    totalPaginas: (pdfText.match(/=== PÁGINA \d+ ===/g) || []).length
                };
                await sendToGemini();
            } else {
                showStatus('Não foi possível extrair o PDF', 'error');
            }
            return;
        }
        await sendToGemini();
    }

    async function copyTeachingPlan() {
        try {
            const teachingPlanText = generateTeachingPlanText(extractedData);

            // Garantir que o documento está focado antes de copiar
            window.focus();

            // Usar método moderno com fallback
            try {
                await navigator.clipboard.writeText(teachingPlanText);
                showStatus('Conteúdo copiado!', 'success');
            } catch (clipboardError) {
                // Fallback para método antigo se o moderno falhar
                console.log('Método moderno falhou, usando fallback:', clipboardError);
                useFallbackCopyMethod(teachingPlanText);
            }
        } catch (error) {
            console.error('Erro ao copiar:', error);
            showStatus('Erro ao copiar', 'error');
        }
    }

    function useFallbackCopyMethod(text) {
        try {
            // Criar elemento temporário para copiar
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                showStatus('Conteúdo copiado!', 'success');
            } else {
                throw new Error('Falha ao copiar');
            }
        } catch (error) {
            console.error('Erro no método fallback:', error);
            showStatus('Erro ao copiar. Selecione e copie manualmente.', 'error');

            // Opcional: mostrar texto para copiar manualmente
            setTimeout(() => {
                alert('Conteúdo pronto para copiar manualmente:\n\nSelecione e copie o texto abaixo:\n\n' +
                    text.substring(0, 500) + '...');
            }, 1000);
        }
    }

    async function sendToGemini() {
        try {
            showStatus('Enviando para análise...', 'info');
            const promptText = generatePrompt(extractedData);

            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText })
            });

            if (!response.ok) throw new Error('Erro no servidor');

            const data = await response.json();

            if (data.success) {
                openAnalysisResults(data.html_content);
                showStatus('Análise concluída!', 'success');
            } else {
                showStatus('Erro na análise: ' + data.error, 'error');
            }
        } catch (error) {
            showStatus('Erro de conexão', 'error');
            console.error('Erro:', error);
        }
    }

    function openAnalysisResults(htmlContent) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Análise do Plano de Ensino</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .markdown-body { box-sizing: border-box; min-width: 200px; background: white; color: black; max-width: 980px; margin: 0 auto; padding: 45px; }
                @media (max-width: 767px) { .markdown-body { padding: 15px; } }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 style="text-align: center; color: #1B74C5;">Análise do Plano de Ensino</h1>
                <article class="markdown-body">${htmlContent}</article>
            </div>
        </body>
        </html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        chrome.tabs.create({ url: url });
    }

    function generateTeachingPlanText(dados) {
        if (!dados || !dados.textoCompleto) return 'Conteúdo não disponível';
        return `CONTEÚDO COMPLETO - ${dados.dataExtracao}\n\n${dados.textoCompleto}`;
    }

    function generatePrompt(dados) {
        return `Você é um avaliador pedagógico especializado na Metodologia SENAI de Educação Profissional.
Sua tarefa é analisar criticamente um plano de ensino que vou fornecer e verificar se ele está de acordo com os padrões e orientações do SENAI.

Critérios de verificação:

- Competência Geral do Curso
Objetivo: transcrever exatamente como consta no Desenho Curricular, sem adaptações.
Erro comum: criar textos próprios ou resumir. Isso gera desencontro entre documentos.
Exemplo: "Planejar, executar e avaliar processos de manutenção mecânica em sistemas industriais, aplicando normas técnicas, ambientais, de saúde e segurança no trabalho."

- Funções
Objetivo: marcar funções (já cadastradas) relacionadas ao Perfil Profissional.
Marque apenas as funções realmente contempladas na UC.
Se a UC é introdutória, escolha funções mais básicas; se avançada, funções mais complexas.
Exemplo: em uma UC de Soldagem, marcar "Executar processos de união de metais", não funções de inspeção que são tratadas em outra UC.

- Objetivos Gerais da Unidade Curricular
Objetivo: elaborar frases no infinitivo, coerentes com as competências previstas.
Evite descrições vagas (ex.: "aprender sobre soldagem").
Exemplo: "Desenvolver a competência de preparar, ajustar e executar processos de soldagem em juntas metálicas, atendendo especificações técnicas e normas de segurança."

Ambientes Pedagógicos
Objetivo: selecionar as opções disponíveis no SGN (sala de aula, oficina, laboratorio, AVA etc.).
Acrescente, quando necessário, observações sobre adaptações.
Exemplo:
- Sala de aula convencional
- Oficina de Soldagem
- Ambiente Virtual de Aprendizagem (AVA)

- Outros Instrumentos de Avaliação
Objetivo: listar recursos complementares à avaliação prática/observação.
Escreva em lista clara e objetiva.
Exemplo:
- Relatórios técnicos
- Apresentações orales
- Portfólio individual
- Estudo de caso

- Referências Bibliográficas
Básicas: obrigatórias, geralmente 2 a 4 títulos essenciais.
Complementares: sugestões extras (normas ABNT, artigos técnicos, manuais de fabricantes).
Escreva conforme ABNT NBR 6023.
Exemplo (básica): CHIAVERINI, V. Tecnologia da Soldagem. São Paulo: McGraw-Hill, 2017.
Exemplo (complementar): ABNT. NBR 5410: Instalações elétricas de baixa tensão. Rio de Janeiro, 2008.

- Observações
Objetivo: usar esse campo para aspectos adicionais:
Inclusão (alunos com necessidades específicas);
Observações sobre recursos adicionais;
Estratégias diferenciadas.
Exemplo: "Prevê-se adaptação das práticas de soldagem para alunos com restrições motoras, prioritizando atividades de inspeção visual."

- Situações de Aprendizagem (SA)
Aqui é preciso detalhar de forma clara e desafiadora:
Capacidades a serem marcadas: as opções são as que estão no desenho curricular.
Objetos de Conhecimento: escrever em lista clara (conceitos, técnicas, normas).
Capacidades Socioemocionais: marcar da matriz (colaboração, comunicação, resiliência).
Estratégia de Aprendizagem Desafiadora: redigir em formato de problema realista.
Contextualização: descrever o cenário (empresa, cliente, situação simulada).
Desafio: o que o aluno deverá resolver ou produzir.
Resultados esperados: evidências concretas (peça fabricada, relatório técnico, solução proposta).

Exemplo (para UC de Soldagem):
Contextualização: Uma empresa metalúrgica recebeu um pedido de produção de suportes metálicos soldados que devem atender a normas de qualidade.
Desafio: Planejar e executar o processo de soldagem de acordo com as especificações técnicas, garantindo acabamento e resistência mecânica.
Resultados esperados: Peças soldadas de acordo com norma, relatório técnico e autoavaliação do processo.

- Plano de Aula
Cada aula deve estar vinculada a uma SA e registrada de forma objetiva:
Título: "Processos de Soldagem MIG/MAG"
Carga horária: 4h
Capacidades: Preparar, ajustar e executar processo de soldagem MIG/MAG
Conhecimentos relacionados: Normas de segurança, parâmetros de soldagem, simbologia
Estratégias de ensino: Estudo de caso + prática em oficina
SA vinculada: "Produção de suportes metálicos soldados"
Critérios de avaliação: Adequação do cordão, aplicação das normas de segurança, precisão na execução
Instrumentos de avaliação: Lista de verificação, relatório técnico, observação prática
Recursos e ambientes pedagógicos: Máquina de solda MIG, EPI, oficina de soldagem

Resumo prático:
Tudo deve ser escrito em linguagem clara, objetiva e técnica, sempre conectado ao Perfil Profissional e às Situações de Aprendizagem. Evite generalizações, descreva cenários reais e alinhe capacidades, conhecimentos, estratégias e avaliação.

Como responder:
Faça a análise item por item (seguindo a lista acima).
Para cada seção, indique:
- Se está correto
- O que precisa corrigir
- Sugestões de melhoria
Não reescreva o plano inteiro: apenas dê orientações e exemplos práticos de como melhorar.

Segue o Plano de Ensino:
${dados.textoCompleto || 'Não foi possível extrair o conteúdo'}
`;
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
    }

    function hideStatus() {
        status.style.display = 'none';
    }
});