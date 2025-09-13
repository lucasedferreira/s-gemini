// pdf-extraction-functions.js
// Funções para extrair dados do formato específico do PDF fornecido

function cleanPDFText(text) {
    // Remove múltiplos espaços e quebras de linha excessivas
    return text.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
}

function extractTextFromPDF(pdfContent) {
    return cleanPDFText(pdfContent);
}

function extractDisciplinaNome(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Unidade Curricular')) {
            // A próxima linha deve conter o nome da disciplina
            if (i + 1 < lines.length) {
                return lines[i + 1].trim();
            }
        }
    }

    return null;
}

function extractCodigoUC(pdfContent) {
    // No PDF fornecido, não há um código UC explícito
    // Podemos tentar extrair da linha do curso ou retornar null
    return null;
}

function extractCompetenciaGeral(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let competencia = '';
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Competência Geral do Curso')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].trim() === '' || lines[i].includes('Função')) {
                break;
            }
            competencia += lines[i].trim() + ' ';
        }
    }

    return competencia.trim() || null;
}

function extractFuncoes(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const funcoes = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Função')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].includes('Objetivo Geral')) {
                break;
            }

            if (lines[i].includes('Unidade de Competência')) {
                const funcao = lines[i].replace(/Unidade de Competência \d+:/, '').trim();
                if (funcao) {
                    funcoes.push(funcao);
                }
            }
        }
    }

    return funcoes.length > 0 ? funcoes.join('\n\n') : null;
}

function extractObjetivosGerais(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let objetivo = '';
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Objetivo Geral da Unidade Curricular')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].trim() === '' || lines[i].includes('Situação de Aprendizagem')) {
                break;
            }

            if (lines[i].includes('Objetivo Geral:')) {
                objetivo = lines[i].replace('Objetivo Geral:', '').trim();
            } else {
                objetivo += ' ' + lines[i].trim();
            }
        }
    }

    return objetivo.trim() || null;
}

function extractAmbientesPedagogicos(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const ambientes = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Ambientes Pedagógicos')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].trim() === '' || lines[i].includes('Referências Bibliográficas')) {
                break;
            }

            if (lines[i].includes('-')) {
                const ambiente = lines[i].replace('-', '').trim();
                if (ambiente) {
                    ambientes.push(ambiente);
                }
            }
        }
    }

    return ambientes.length > 0 ? ambientes.join('\n\n') : null;
}

function extractOutrosInstrumentos(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const instrumentos = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Outros Instrumentos de Avaliação')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].trim() === '' || i === lines.length - 1) {
                break;
            }

            if (lines[i].includes('-')) {
                const instrumento = lines[i].replace('-', '').trim();
                if (instrumento) {
                    instrumentos.push(instrumento);
                }
            }
        }
    }

    return instrumentos.length > 0 ? instrumentos.join('\n\n') : null;
}

function extractReferenciasBasicas(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const referencias = [];
    let found = false;
    let inBasica = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Referências Bibliográficas')) {
            found = true;
            continue;
        }

        if (found && lines[i].includes('Básica')) {
            inBasica = true;
            continue;
        }

        if (inBasica) {
            if (lines[i].includes('Complementar')) {
                break;
            }

            if (lines[i].trim() !== '' && !lines[i].includes('Básica')) {
                referencias.push(lines[i].trim());
            }
        }
    }

    return referencias.length > 0 ? referencias.join('\n\n') : null;
}

function extractReferenciasComplementares(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const referencias = [];
    let found = false;
    let inComplementar = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Referências Bibliográficas')) {
            found = true;
            continue;
        }

        if (found && lines[i].includes('Complementar')) {
            inComplementar = true;
            continue;
        }

        if (inComplementar) {
            if (lines[i].includes('Outros Instrumentos')) {
                break;
            }

            if (lines[i].trim() !== '' && !lines[i].includes('Complementar')) {
                referencias.push(lines[i].trim());
            }
        }
    }

    return referencias.length > 0 ? referencias.join('\n\n') : null;
}

function extractObservacoes(pdfContent) {
    // No PDF fornecido, não há seção de observações
    return null;
}

function extractSituacoesAprendizagem(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let situacao = '';
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Situação de Aprendizagem:')) {
            found = true;
            situacao = lines[i].replace('Situação de Aprendizagem:', '').trim();
            break;
        }
    }

    return situacao || null;
}

function extractCapacidadesTecnicasSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const capacidades = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Capacidades Básicas / Capacidades Técnicas')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].includes('Objetos de Conhecimento')) {
                break;
            }

            if (lines[i].includes('-')) {
                const capacidade = lines[i].replace('-', '').trim();
                if (capacidade) {
                    capacidades.push('- ' + capacidade);
                }
            }
        }
    }

    return capacidades.length > 0 ? capacidades.join('\n') : null;
}

function extractObjetosConhecimentoSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const conhecimentos = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Objetos de Conhecimento')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].includes('Capacidades Socioemocionais')) {
                break;
            }

            if (lines[i].includes('-')) {
                const conhecimento = lines[i].replace('-', '').trim();
                if (conhecimento) {
                    conhecimentos.push('- ' + conhecimento);
                }
            }
        }
    }

    return conhecimentos.length > 0 ? conhecimentos.join('\n') : null;
}

function extractCapacidadesSocioemocionaisSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const capacidades = [];
    let found = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Capacidades Socioemocionais')) {
            found = true;
            continue;
        }

        if (found) {
            if (lines[i].includes('Estratégia de Aprendizagem Desafiadora')) {
                break;
            }

            if (lines[i].includes('-')) {
                const capacidade = lines[i].replace('-', '').trim();
                if (capacidade) {
                    capacidades.push('- ' + capacidade);
                }
            }
        }
    }

    return capacidades.length > 0 ? capacidades.join('\n') : null;
}

function extractContextualizacaoSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let contextualizacao = '';
    let found = false;
    let collecting = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Contextualização')) {
            found = true;
            collecting = true;
            continue;
        }

        if (found && collecting) {
            if (lines[i].includes('Desafio') || lines[i].includes('Estratégia de Aprendizagem Desafiadora')) {
                break;
            }

            if (lines[i].trim() !== '' && !lines[i].includes('Contextualização')) {
                contextualizacao += lines[i].trim() + ' ';
            }
        }
    }

    return contextualizacao.trim() || null;
}

function extractDesafioSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let desafio = '';
    let found = false;
    let collecting = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Desafio')) {
            found = true;
            collecting = true;
            continue;
        }

        if (found && collecting) {
            if (lines[i].includes('Resultados Esperados')) {
                break;
            }

            if (lines[i].trim() !== '' && !lines[i].includes('Desafio')) {
                desafio += lines[i].trim() + ' ';
            }
        }
    }

    return desafio.trim() || null;
}

function extractResultadosEsperadosSituacao(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    let resultados = '';
    let found = false;
    let collecting = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Resultados Esperados')) {
            found = true;
            collecting = true;
            continue;
        }

        if (found && collecting) {
            if (lines[i].includes('Plano Aula:') || lines[i].includes('FM NP')) {
                break;
            }

            if (lines[i].trim() !== '' && !lines[i].includes('Resultados Esperados')) {
                resultados += lines[i].trim() + ' ';
            }
        }
    }

    return resultados.trim() || null;
}

function extractTodosPlanosAula(pdfContent) {
    const text = extractTextFromPDF(pdfContent);
    const lines = text.split('\n');
    const planos = [];
    let currentPlano = null;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Plano Aula:')) {
            // Se já temos um plano em andamento, adicioná-lo à lista
            if (currentPlano) {
                planos.push(currentPlano);
            }

            // Iniciar um novo plano
            currentPlano = {
                titulo: lines[i].replace('Plano Aula:', '').trim(),
                cargaHoraria: '',
                criteriosAvaliacao: '',
                instrumentoAvaliacao: '',
                recursosPedagogicos: ''
            };

            // Procurar a carga horária
            const chIndex = lines[i].indexOf('CH alocada:');
            if (chIndex !== -1) {
                currentPlano.cargaHoraria = lines[i].substring(chIndex + 'CH alocada:'.length).trim();
            }

            continue;
        }

        if (currentPlano) {
            if (lines[i].includes('Capacidades a serem trabalhadas')) {
                // Pular esta linha, não é necessária para os dados que queremos
                continue;
            }

            if (lines[i].includes('Conhecimentos Relacionados')) {
                // Pular esta linha
                continue;
            }

            if (lines[i].includes('Estratégias de Ensino')) {
                // Pular esta linha
                continue;
            }

            if (lines[i].includes('Recursos e Ambientes Pedagógicos')) {
                if (i + 1 < lines.length) {
                    currentPlano.recursosPedagogicos = lines[i + 1].trim();
                }
                continue;
            }

            if (lines[i].includes('Critérios de Avaliação')) {
                if (i + 1 < lines.length) {
                    currentPlano.criteriosAvaliacao = lines[i + 1].trim();
                }
                continue;
            }

            if (lines[i].includes('Instrumentos de Avaliação da Aprendizagem')) {
                if (i + 1 < lines.length) {
                    currentPlano.instrumentoAvaliacao = lines[i + 1].trim();
                }
                continue;
            }

            // Se encontramos um novo plano ou o final da seção, finalizar o plano atual
            if (lines[i].includes('Ambientes Pedagógicos') ||
                (i + 1 < lines.length && lines[i + 1].includes('Plano Aula:'))) {
                planos.push(currentPlano);
                currentPlano = null;
            }
        }
    }

    // Adicionar o último plano, se houver
    if (currentPlano) {
        planos.push(currentPlano);
    }

    return planos.length > 0 ? planos : null;
}

function extractAllDataFromPDF(pdfContent) {
    try {
        const dados = {
            disciplina: extractDisciplinaNome(pdfContent),
            codigoUC: extractCodigoUC(pdfContent),
            competenciaGeral: extractCompetenciaGeral(pdfContent),
            funcoes: extractFuncoes(pdfContent),
            objetivosGerais: extractObjetivosGerais(pdfContent),
            ambientesPedagogicos: extractAmbientesPedagogicos(pdfContent),
            outrosInstrumentos: extractOutrosInstrumentos(pdfContent),
            referenciasBasicas: extractReferenciasBasicas(pdfContent),
            referenciasComplementares: extractReferenciasComplementares(pdfContent),
            observacoes: extractObservacoes(pdfContent),
            situacoesAprendizagem: extractSituacoesAprendizagem(pdfContent),
            dataExtracao: new Date().toLocaleString('pt-BR')
        };

        dados.planosAula = extractTodosPlanosAula(pdfContent);

        const capacidadesTecnicas = extractCapacidadesTecnicasSituacao(pdfContent);
        const objetosConhecimento = extractObjetosConhecimentoSituacao(pdfContent);
        const capacidadesSocioemocionais = extractCapacidadesSocioemocionaisSituacao(pdfContent);
        const contextualizacao = extractContextualizacaoSituacao(pdfContent);
        const desafio = extractDesafioSituacao(pdfContent);
        const resultados = extractResultadosEsperadosSituacao(pdfContent);

        if (capacidadesTecnicas) dados.capacidadesTecnicas = capacidadesTecnicas;
        if (objetosConhecimento) dados.objetosConhecimento = objetosConhecimento;
        if (capacidadesSocioemocionais) dados.capacidadesSocioemocionais = capacidadesSocioemocionais;
        if (contextualizacao) dados.contextualizacao = contextualizacao;
        if (desafio) dados.desafio = desafio;
        if (resultados) dados.resultadosEsperados = resultados;

        return dados;
    } catch (error) {
        console.error('Erro ao extrair dados do PDF:', error);
        return null;
    }
}

// Exportar funções para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractAllDataFromPDF,
        extractDisciplinaNome,
        extractCodigoUC,
        extractCompetenciaGeral,
        extractFuncoes,
        extractObjetivosGerais,
        extractAmbientesPedagogicos,
        extractOutrosInstrumentos,
        extractReferenciasBasicas,
        extractReferenciasComplementares,
        extractObservacoes,
        extractSituacoesAprendizagem,
        extractCapacidadesTecnicasSituacao,
        extractObjetosConhecimentoSituacao,
        extractCapacidadesSocioemocionaisSituacao,
        extractContextualizacaoSituacao,
        extractDesafioSituacao,
        extractResultadosEsperadosSituacao,
        extractTodosPlanosAula
    };
}
