document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000';

    const copyBtn = document.getElementById('copyBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const status = document.getElementById('status');

    let extractedData = null;

    extractData();

    copyBtn.addEventListener('click', handleCopy);
    analyzeBtn.addEventListener('click', handleAnalyze);

    async function extractData() {
        try {
            showStatus('Extraindo dados...', 'info');

            const tab = await getCurrentTab();
            if (!isValidTab(tab)) return;

            // Verificar se é um PDF
            if (tab.url.toLowerCase().endsWith('.pdf')) {
                const results = await extractPDFData(tab);
                processExtractionResults([{result: results}]);
            } else {
                // Usar o extrator padrão para HTML
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['extraction-functions.js']
                });

                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => extractAllData()
                });
                
                processExtractionResults(results);
            }
        } catch (error) {
            console.error('Erro na extração automática:', error);
            showStatus('Erro na extração: ' + error.message, 'error');
        }
    }

    async function extractPDFData(tab) {
        try {
            // Primeiro, injetar os scripts do PDF.js
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['pdf.min.js', 'pdf.worker.min.js']
            });
            
            // Depois, injetar e executar o extrator de PDF
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['pdf-extraction-functions.js']
            });
            
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => extractAllData()
            });
            
            return results[0].result;
        } catch (error) {
            console.error('Erro na extração de PDF:', error);
            throw error;
        }
    }

    async function getCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    function isValidTab(tab) {
        if (!tab.url.startsWith('http')) {
            return false;
        }
        return true;
    }

    function processExtractionResults(results) {
        if (results && results[0] && results[0].result) {
            const response = results[0].result;

            if (!response.error) {
                extractedData = response;
                showStatus('Dados extraídos com sucesso!', 'success');
                setTimeout(hideStatus, 2000);
            }
        }
    }

    function handleCopy() {
        if (!extractedData) {
            showStatus('Extraindo dados...', 'info');
            setTimeout(() => {
                if (!extractedData) {
                    showStatus('Não foi possível extrair os dados', 'error');
                } else {
                    copyTeachingPlan();
                }
            }, 1000);
            return;
        }

        copyTeachingPlan();
    }

    function copyTeachingPlan() {
        const teachingPlanText = generateTeachingPlanText(extractedData);

        navigator.clipboard.writeText(teachingPlanText)
            .then(() => showStatus('Plano copiado!', 'success'))
            .catch(err => showStatus('Erro ao copiar', 'error'));
    }

    function handleAnalyze() {
        if (!extractedData) {
            showStatus('Extraindo dados...', 'info');
            setTimeout(() => {
                if (!extractedData) {
                    showStatus('Não foi possível extrair os dados', 'error');
                } else {
                    sendToGemini();
                }
            }, 1000);
            return;
        }

        sendToGemini();
    }

    async function sendToGemini() {
        try {
            showStatus('Enviando para análise...', 'info');

            const promptText = generatePrompt(extractedData);

            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: promptText })
            });

            const data = await response.json();

            if (data.success) {
                openAnalysisResults(data.html_content, data.text_response);
                showStatus('Análise concluída!', 'success');
            } else {
                showStatus('Erro na análise: ' + data.error, 'error');
            }
        } catch (error) {
            showStatus('Erro de conexão com o servidor', 'error');
            console.error('Erro:', error);
        }
    }

    function openAnalysisResults(htmlContent, textContent) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Análise do Plano de Ensino</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    max-width: 980px;
                    margin: 0 auto;
                    padding: 45px;
                    background-color: unset;
                    color: unset;
                }
                .actions {
                    text-align: center;
                    margin: 20px 0;
                }
                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 style="text-align: center; color: #1B74C5;">Análise do Plano de Ensino</h1>
                <article class="markdown-body">
                    ${htmlContent}
                </article>
            </div>
        </body>
        </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        chrome.tabs.create({ url: url });
    }

    function generateTeachingPlanText(dados) {
        let text = `PLANO DE ENSINO EXTRATO\n\n`;

        if (dados.competenciaGeral) text += `COMPETÊNCIA GERAL: ${dados.competenciaGeral}\n\n`;
        if (dados.funcoes) text += `FUNÇÕES/CAPACIDADES:\n${dados.funcoes}\n\n`;
        if (dados.objetivosGerais) text += `OBJETIVOS GERAIS:\n${dados.objetivosGerais}\n\n`;
        if (dados.ambientesPedagogicos) text += `AMBIENTES PEDAGÓGICOS:\n${dados.ambientesPedagogicos}\n\n`;
        if (dados.outrosInstrumentos) text += `OUTROS INSTRUMENTOS DE AVALIAÇÃO:\n${dados.outrosInstrumentos}\n\n`;

        if (dados.referencias) {
            if (dados.referencias.basicas) text += `REFERÊNCIAS BÁSICAS:\n${dados.referencias.basicas}\n\n`;
            if (dados.referencias.complementares) text += `REFERÊNCIAS COMPLEMENTARES:\n${dados.referencias.complementares}\n\n`;
        }

        if (dados.observacoes) text += `OBSERVAÇÕES:\n${dados.observacoes}\n\n`;

        if (dados.situacaoAprendizagem) {
            text += `SITUAÇÃO DE APRENDIZAGEM:\n`;
            if (dados.situacaoAprendizagem.capacidadesTecnicas) text += `CAPACIDADES TÉCNICAS:\n${dados.situacaoAprendizagem.capacidadesTecnicas}\n\n`;
            if (dados.situacaoAprendizagem.objetosConhecimento) text += `OBJETOS DE CONHECIMENTO:\n${dados.situacaoAprendizagem.objetosConhecimento}\n\n`;
            if (dados.situacaoAprendizagem.capacidadesSocioemocionais) text += `CAPACIDADES SOCIOEMOCIONAIS:\n${dados.situacaoAprendizagem.capacidadesSocioemocionais}\n\n`;
            if (dados.situacaoAprendizagem.estrategiaAprendizagem) text += `ESTRATÉGIA DE APRENDIZAGEM: ${dados.situacaoAprendizagem.estrategiaAprendizagem}\n\n`;
            if (dados.situacaoAprendizagem.contextualizacao) text += `CONTEXTUALIZAÇÃO:\n${dados.situacaoAprendizagem.contextualizacao}\n\n`;
            if (dados.situacaoAprendizagem.desafio) text += `DESAFIO:\n${dados.situacaoAprendizagem.desafio}\n\n`;
            if (dados.situacaoAprendizagem.resultadosEsperados) text += `RESULTADOS ESPERADOS:\n${dados.situacaoAprendizagem.resultadosEsperados}\n\n`;
        }

        if (dados.planosAula && dados.planosAula.length > 0) {
            text += `PLANOS DE AULA:\n\n`;
            dados.planosAula.forEach((plano, index) => {
                text += `PLANO ${index + 1}:\n`;
                text += `NOME: ${plano.nome || 'Não informado'}\n`;
                text += `CH ALOCADA: ${plano.chAlocada || 'Não informada'}\n`;
                if (plano.capacidades) text += `CAPACIDADES: ${plano.capacidades}\n`;
                if (plano.conhecimentos) text += `CONHECIMENTOS: ${plano.conhecimentos}\n`;
                if (plano.estrategias) text += `ESTRATÉGIAS: ${plano.estrategias}\n`;
                if (plano.recursos) text += `RECURSOS: ${plano.recursos}\n`;
                if (plano.criterios) text += `CRITÉRIOS: ${plano.criterios}\n`;
                if (plano.instrumentos) text += `INSTRUMENTOS: ${plano.instrumentos}\n`;
                text += '\n';
            });
        }

        return text;
    }

    function generatePrompt(dados) {
        let prompt = `Você é um avaliador pedagógico especializado na Metodologia SENAI de Educação Profissional.
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
`;

        prompt += `DADOS DO PLANO DE ENSINO\n\n`;

        if (dados.competenciaGeral) prompt += `COMPETÊNCIA GERAL: ${dados.competenciaGeral}\n\n`;
        if (dados.funcoes) prompt += `FUNÇÕES/CAPACIDADES:\n${dados.funcoes}\n\n`;
        if (dados.objetivosGerais) prompt += `OBJETIVOS GERAIS:\n${dados.objetivosGerais}\n\n`;
        if (dados.ambientesPedagogicos) prompt += `AMBIENTES PEDAGÓGICOS:\n${dados.ambientesPedagogicos}\n\n`;
        if (dados.outrosInstrumentos) prompt += `OUTROS INSTRUMENTOS DE AVALIAÇÃO:\n${dados.outrosInstrumentos}\n\n`;

        if (dados.referencias) {
            if (dados.referencias.basicas) prompt += `REFERÊNCIAS BÁSICAS:\n${dados.referencias.basicas}\n\n`;
            if (dados.referencias.complementares) prompt += `REFERÊNCIAS COMPLEMENTARES:\n${dados.referencias.complementares}\n\n`;
        }

        if (dados.observacoes) prompt += `OBSERVAÇões:\n${dados.observacoes}\n\n`;

        if (dados.situacaoAprendizagem) {
            prompt += `SITUAÇÃO DE APRENDIZAGEM:\n`;
            if (dados.situacaoAprendizagem.capacidadesTecnicas) prompt += `CAPACIDADES TÉCNICAS:\n${dados.situacaoAprendizagem.capacidadesTecnicas}\n\n`;
            if (dados.situacaoAprendizagem.objetosConhecimento) prompt += `OBJETOS DE CONHECIMENTO:\n${dados.situacaoAprendizagem.objetosConhecimento}\n\n`;
            if (dados.situacaoAprendizagem.capacidadesSocioemocionais) prompt += `CAPACIDADES SOCIOEMOCIONAIS:\n${dados.situacaoAprendizagem.capacidadesSocioemocionais}\n\n`;
            if (dados.situacaoAprendizagem.estrategiaAprendizagem) prompt += `ESTRATÉGIA DE APRENDIZAGEM: ${dados.situacaoAprendizagem.estrategiaAprendizagem}\n\n`;
            if (dados.situacaoAprendizagem.contextualizacao) prompt += `CONTEXTUALIZAÇÃO:\n${dados.situacaoAprendizagem.contextualizacao}\n\n`;
            if (dados.situacaoAprendizagem.desafio) prompt += `DESAFIO:\n${dados.situacaoAprendizagem.desafio}\n\n`;
            if (dados.situacaoAprendizagem.resultadosEsperados) prompt += `RESULTADOS ESPERADOS:\n${dados.situacaoAprendizagem.resultadosEsperados}\n\n`;
        }

        if (dados.planosAula && dados.planosAula.length > 0) {
            prompt += `PLANOS DE AULA:\n\n`;
            dados.planosAula.forEach((plano, index) => {
                prompt += `PLANO ${index + 1}:\n`;
                prompt += `NOME: ${plano.nome || 'Não informado'}\n`;
                prompt += `CH ALOCADA: ${plano.chAlocada || 'Não informada'}\n`;
                if (plano.capacidades) prompt += `CAPACIDADES: ${plano.capacidades}\n`;
                if (plano.conhecimentos) prompt += `CONHECIMENTOS: ${plano.conhecimentos}\n`;
                if (plano.estrategias) prompt += `ESTRATÉGIAS: ${plano.estrategias}\n`;
                if (plano.recursos) prompt += `RECURSOS: ${plano.recursos}\n`;
                if (plano.criterios) prompt += `CRITÉRIOS: ${plano.criterios}\n`;
                if (plano.instrumentos) prompt += `INSTRUMENTOS: ${plano.instrumentos}\n`;
                prompt += '\n';
            });
        }

        return prompt;
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
