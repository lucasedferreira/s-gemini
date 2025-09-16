// pdf-extraction-functions.js - VERSÃO MELHORADA PARA PLANOS SENAI

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

async function extractTextFromPDF(pdfUrl) {
    try {
        const pdfjsLib = await loadPDFJS();
        
        const response = await fetch(pdfUrl, {
            credentials: 'include',
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        
        return fullText;
    } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
        return null;
    }
}

function extractCompetenciaGeral(text) {
    const regex = /Competência Geral do Curso([\s\S]*?)(?=Função|Objetivo|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractFuncoes(text) {
    const regex = /Função\s*\d+:\s*([^\n\r]+)/gi;
    const matches = text.match(regex);
    if (!matches) return null;
    
    return matches.map(f => f.replace(/Função\s*\d+:\s*/i, '').trim())
                  .filter(f => f.length > 0)
                  .join('\n\n');
}

function extractObjetivosGerais(text) {
    const regex = /Objetivo Geral da Unidade Curricular([\s\S]*?)(?=Situação de Aprendizagem|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractAmbientesPedagogicos(text) {
    const regex = /Ambientes Pedagógicos([\s\S]*?)(?=Referências Bibliográficas|Outros Instrumentos|Observações|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractOutrosInstrumentos(text) {
    const regex = /Outros Instrumentos de Avaliação([\s\S]*?)(?=Referências Bibliográficas|Observações|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractReferenciasBibliograficas(text) {
    const regex = /Referências Bibliográficas([\s\S]*?)(?=Outros Instrumentos|Observações|$)/i;
    const match = text.match(regex);
    if (!match) return null;
    
    const refText = match[1];
    const basicaMatch = refText.match(/Básica([\s\S]*?)(?=Complementar|$)/i);
    const complementarMatch = refText.match(/Complementar([\s\S]*?)(?=Básica|$)/i);
    
    return {
        basicas: basicaMatch ? basicaMatch[1].trim().replace(/\s+/g, ' ') : null,
        complementares: complementarMatch ? complementarMatch[1].trim().replace(/\s+/g, ' ') : null
    };
}

function extractObservacoes(text) {
    const regex = /Observações([\s\S]*?)(?=FM NP|Plano de Aula|$)/i;
    const match = text.match(regex);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractSituacaoAprendizagem(text) {
    const regex = /Situação de Aprendizagem:([\s\S]*?)(?=Plano Aula:|Ambientes Pedagógicos|$)/i;
    const match = text.match(regex);
    if (!match) return null;
    
    const situacaoText = match[1];
    
    // Capacidades Técnicas
    const capacidadesRegex = /Capacidades Básicas\s*\/\s*Capacidades Técnicas([\s\S]*?)(?=Objetos de Conhecimento|Capacidades Socioemocionais|$)/i;
    const capacidadesMatch = situacaoText.match(capacidadesRegex);
    
    // Objetos de Conhecimento
    const objetosRegex = /Objetos de Conhecimento([\s\S]*?)(?=Capacidades Socioemocionais|Estratégia de Aprendizagem|$)/i;
    const objetosMatch = situacaoText.match(objetosRegex);
    
    // Capacidades Socioemocionais
    const socioemocionaisRegex = /Capacidades Socioemocionais([\s\S]*?)(?=Estratégia de Aprendizagem|Contextualização|$)/i;
    const socioemocionaisMatch = situacaoText.match(socioemocionaisRegex);
    
    // Estratégia de Aprendizagem
    const estrategiaRegex = /Estratégia de Aprendizagem Desafiadora([\s\S]*?)(?=Contextualização|$)/i;
    const estrategiaMatch = situacaoText.match(estrategiaRegex);
    
    // Contextualização
    const contextualizacaoRegex = /Contextualização([\s\S]*?)(?=Desafio|$)/i;
    const contextualizacaoMatch = situacaoText.match(contextualizacaoRegex);
    
    // Desafio
    const desafioRegex = /Desafio([\s\S]*?)(?=Resultados Esperados|$)/i;
    const desafioMatch = situacaoText.match(desafioRegex);
    
    // Resultados Esperados
    const resultadosRegex = /Resultados Esperados([\s\S]*?)(?=Plano Aula:|$)/i;
    const resultadosMatch = situacaoText.match(resultadosRegex);
    
    return {
        capacidadesTecnicas: capacidadesMatch ? capacidadesMatch[1].trim().replace(/\s+/g, ' ') : null,
        objetosConhecimento: objetosMatch ? objetosMatch[1].trim().replace(/\s+/g, ' ') : null,
        capacidadesSocioemocionais: socioemocionaisMatch ? socioemocionaisMatch[1].trim().replace(/\s+/g, ' ') : null,
        estrategiaAprendizagem: extractEstrategiaAprendizagem(estrategiaMatch ? estrategiaMatch[0] : ''),
        contextualizacao: contextualizacaoMatch ? contextualizacaoMatch[1].trim().replace(/\s+/g, ' ') : null,
        desafio: desafioMatch ? desafioMatch[1].trim().replace(/\s+/g, ' ') : null,
        resultadosEsperados: resultadosMatch ? resultadosMatch[1].trim().replace(/\s+/g, ' ') : null
    };
}

function extractEstrategiaAprendizagem(text) {
    const estrategias = {
        'Situação-Problema': /\(X\) Situação-Problema|Situação-Problema\s*\(X\)/i,
        'Estudo de Caso': /\(X\) Estudo de Caso|Estudo de Caso\s*\(X\)/i,
        'Projeto': /\(X\) Projeto|Projeto\s*\(X\)/i,
        'Pesquisa Aplicada': /\(X\) Pesquisa Aplicada|Pesquisa Aplicada\s*\(X\)/i
    };
    
    for (const [estrategia, regex] of Object.entries(estrategias)) {
        if (regex.test(text)) {
            return estrategia;
        }
    }
    
    return null;
}

function extractPlanosAula(text) {
    const regex = /Plano Aula:\s*([^\n]+)\s*CH alocada:\s*([\d:]+)([\s\S]*?)(?=Plano Aula:|Ambientes Pedagógicos|$)/gi;
    const plans = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const planText = match[0];
        
        const nome = match[1].trim();
        const chAlocada = match[2].trim();
        
        // Capacidades
        const capacidadesRegex = /Capacidades a serem trabalhadas([\s\S]*?)(?=Conhecimentos Relacionados|Estratégias de Ensino|$)/i;
        const capacidadesMatch = planText.match(capacidadesRegex);
        
        // Conhecimentos
        const conhecimentosRegex = /Conhecimentos Relacionados([\s\S]*?)(?=Estratégias de Ensino|Recursos e Ambientes Pedagógicos|$)/i;
        const conhecimentosMatch = planText.match(conhecimentosRegex);
        
        // Estratégias
        const estrategiasRegex = /Estratégias de Ensino([\s\S]*?)(?=Recursos e Ambientes Pedagógicos|Critérios de Avaliação|$)/i;
        const estrategiasMatch = planText.match(estrategiasRegex);
        
        // Recursos
        const recursosRegex = /Recursos e Ambientes Pedagógicos([\s\S]*?)(?=Critérios de Avaliação|Instrumentos de Avaliação|$)/i;
        const recursosMatch = planText.match(recursosRegex);
        
        // Critérios
        const criteriosRegex = /Critérios de Avaliação\s*\(como vou avaliar\)([\s\S]*?)(?=Instrumentos de Avaliação|$)/i;
        const criteriosMatch = planText.match(criteriosRegex);
        
        // Instrumentos
        const instrumentosRegex = /Instrumentos de Avaliação da Aprendizagem([\s\S]*?)(?=Plano Aula:|$)/i;
        const instrumentosMatch = planText.match(instrumentosRegex);
        
        plans.push({
            nome: nome,
            chAlocada: chAlocada,
            capacidades: capacidadesMatch ? capacidadesMatch[1].trim().replace(/\s+/g, ' ') : null,
            conhecimentos: conhecimentosMatch ? conhecimentosMatch[1].trim().replace(/\s+/g, ' ') : null,
            estrategias: estrategiasMatch ? estrategiasMatch[1].trim().replace(/\s+/g, ' ') : null,
            recursos: recursosMatch ? recursosMatch[1].trim().replace(/\s+/g, ' ') : null,
            criterios: criteriosMatch ? criteriosMatch[1].trim().replace(/\s+/g, ' ') : null,
            instrumentos: instrumentosMatch ? instrumentosMatch[1].trim().replace(/\s+/g, ' ') : null
        });
    }
    
    return plans.length > 0 ? plans : null;
}

// Função principal para extrair todos os dados
async function extractAllData() {
    try {
        console.log('Iniciando extração de dados do PDF...');
        
        // Verificar se estamos em uma página PDF
        if (window.location.href.toLowerCase().endsWith('.pdf')) {
            const pdfText = await extractTextFromPDF(window.location.href);
            
            if (!pdfText) {
                throw new Error('Não foi possível extrair texto do PDF');
            }
            
            return processPDFText(pdfText);
        } else {
            // Fallback para texto da página
            return processPDFText(document.body.textContent);
        }
        
    } catch (error) {
        console.error('Erro na extração completa:', error);
        return { 
            error: error.message,
            dataExtracao: new Date().toLocaleString('pt-BR')
        };
    }
}

function processPDFText(text) {
    const data = {
        competenciaGeral: extractCompetenciaGeral(text),
        funcoes: extractFuncoes(text),
        objetivosGerais: extractObjetivosGerais(text),
        ambientesPedagogicos: extractAmbientesPedagogicos(text),
        outrosInstrumentos: extractOutrosInstrumentos(text),
        referencias: extractReferenciasBibliograficas(text),
        observacoes: extractObservacoes(text),
        situacaoAprendizagem: extractSituacaoAprendizagem(text),
        planosAula: extractPlanosAula(text),
        dataExtracao: new Date().toLocaleString('pt-BR'),
        textoCompleto: text.substring(0, 1000) + '...' // Parte do texto para debug
    };
    
    return data;
}
