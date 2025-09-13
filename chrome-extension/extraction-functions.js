function extractText(selector) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return null;

    const texts = Array.from(elements)
        .map(el => {
            const text = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
                ? el.value.trim()
                : el.textContent.trim();
            return text;
        })
        .filter(text => text.length > 0);

    return texts.length > 0 ? texts.join('\n\n') : null;
}

function extractDisciplinaNome() {
    const strongElement = document.querySelector('.header-route-bar strong');
    if (!strongElement) return null;
    const text = strongElement.textContent.trim();
    const match = text.match(/-\s*(.+)$/);
    return match ? match[1].trim() : text;
}

function extractCodigoUC() {
    const strongElement = document.querySelector('.header-route-bar strong');
    if (!strongElement) return null;
    const text = strongElement.textContent.trim();
    const match = text.match(/^(\d+)\s*-/);
    return match ? match[1].trim() : null;
}

function extractCompetenciaGeral() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:competenciaGeral_editor .ql-editor');
}

function extractFuncoes() {
    const rows = document.querySelectorAll('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:accordionUnidadesCompetencia\\:tabelaUnidadesCompetencia_data tr');
    const funcoes = [];

    rows.forEach(row => {
        const descricaoCell = row.querySelector('td:last-child');
        if (descricaoCell) {
            const texto = descricaoCell.textContent.trim();
            // Remove o "Função X: " do início
            const funcao = texto.replace(/^Função\s*\d+:\s*/i, '').trim();
            if (funcao) {
                funcoes.push(funcao);
            }
        }
    });

    return funcoes.length > 0 ? funcoes.join('\n\n') : null;
}

function extractObjetivosGerais() {
    const labels = document.querySelectorAll('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:accordionUnidadesCompetencia\\:selectObjetivosGerais label');
    const objetivos = [];

    labels.forEach(label => {
        const texto = label.textContent.trim();
        if (texto && !texto.includes('Selecione')) {
            objetivos.push(texto);
        }
    });

    return objetivos.length > 0 ? objetivos.join('\n\n') : null;
}

function extractAmbientesPedagogicos() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:ambientesPedagogicos');
}

function extractOutrosInstrumentos() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:outrosInstrumentos');
}

function extractReferenciasBasicas() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:referenciasBasicas');
}

function extractReferenciasComplementares() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:referenciasBibliograficas');
}

function extractObservacoes() {
    return extractText('#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:observacoes');
}

function extractSituacoesAprendizagem() {
    const situacoes = [];
    const accordionHeaders = document.querySelectorAll('[id*="accordionSituacaoAprendizagem"] [id*="header"]');

    accordionHeaders.forEach(header => {
        const titulo = header.textContent.trim();
        if (titulo && !titulo.includes('Capacidade') && !titulo.includes('Objetos') && !titulo.includes('Socioemocionais')) {
            situacoes.push(titulo);
        }
    });

    return situacoes.length > 0 ? situacoes.join('\n\n') : null;
}

function extractCapacidadesTecnicasSituacao() {
    const rows = document.querySelectorAll('[id*="tabelaFundamentos_data"] tr');
    const capacidades = [];

    rows.forEach(row => {
        const descricaoCell = row.querySelector('td:last-child');
        if (descricaoCell) {
            const texto = descricaoCell.textContent.trim().replace(/^Descrição\s*/i, "- ");
            if (texto) {
                capacidades.push(texto);
            }
        }
    });

    return capacidades.length > 0 ? capacidades.join('\n') : null;
}

function extractObjetosConhecimentoSituacao() {
    const rows = document.querySelectorAll('[id*="tabelaConhecimentos_data"] tr');
    const conhecimentos = [];

    rows.forEach(row => {
        const descricaoCell = row.querySelector('td:last-child');
        if (descricaoCell) {
            const texto = descricaoCell.textContent.trim().replace(/^Descrição\s*/i, "- ");
            if (texto) {
                conhecimentos.push(texto);
            }
        }
    });

    return conhecimentos.length > 0 ? conhecimentos.join('\n\n') : null;
}

function extractCapacidadesSocioemocionaisSituacao() {
    const rows = document.querySelectorAll('[id*="tabelaCapacidades_data"] tr');
    const capacidades = [];

    rows.forEach(row => {
        const descricaoCell = row.querySelector('td:last-child');
        if (descricaoCell) {
            const texto = descricaoCell.textContent.trim().replace(/^Descrição\s*/i, "- ");
            if (texto) {
                capacidades.push(texto);
            }
        }
    });

    return capacidades.length > 0 ? capacidades.join('\n\n') : null;
}

function extractContextualizacaoSituacao() {
    return extractText('[id*="contextualizacao"]');
}

function extractDesafioSituacao() {
    return extractText('[id*="desafio"]');
}

function extractResultadosEsperadosSituacao() {
    return extractText('[id*="resultados"]');
}

function extractTodosPlanosAula() {
    const planos = [];
    const accordionHeaders = document.querySelectorAll('[id*="accordionPlanoAula"] [id*="header"]');

    accordionHeaders.forEach((header, index) => {
        const titulo = header.textContent.trim();
        if (titulo) {
            const detalhes = extractDetalhesPlanoAula(index);
            planos.push({
                titulo: titulo,
                cargaHoraria: detalhes.cargaHoraria,
                criteriosAvaliacao: detalhes.criteriosAvaliacao,
                instrumentoAvaliacao: detalhes.instrumentoAvaliacao,
                recursosPedagogicos: detalhes.recursosPedagogicos
            });
        }
    });

    return planos.length > 0 ? planos : null;
}

function extractDetalhesPlanoAula(indice) {
    const seletorBase = `#tabViewDiarioClasse\\:formAbaPlanoEnsino\\:accordionPlanoAula\\:${indice}\\:j_idt390`;

    return {
        titulo: extractText(`${seletorBase} [id*="titulo"]`),
        cargaHoraria: extractText(`${seletorBase} [id*="chPlanejada"]`),
        criteriosAvaliacao: extractText(`${seletorBase} [id*="criteriosAvaliacao"]`),
        instrumentoAvaliacao: extractText(`${seletorBase} [id*="instrumentoAvaliacao"]`),
        recursosPedagogicos: extractText(`${seletorBase} [id*="recursosPedagogicos"]`)
    };
}

function extractAllData() {
    try {
        const dados = {
            disciplina: extractDisciplinaNome(),
            codigoUC: extractCodigoUC(),
            competenciaGeral: extractCompetenciaGeral(),
            funcoes: extractFuncoes(),
            objetivosGerais: extractObjetivosGerais(),
            ambientesPedagogicos: extractAmbientesPedagogicos(),
            outrosInstrumentos: extractOutrosInstrumentos(),
            referenciasBasicas: extractReferenciasBasicas(),
            referenciasComplementares: extractReferenciasComplementares(),
            observacoes: extractObservacoes(),
            situacoesAprendizagem: extractSituacoesAprendizagem(),
            dataExtracao: new Date().toLocaleString('pt-BR')
        };

        dados.planosAula = extractTodosPlanosAula();

        const capacidadesTecnicas = extractCapacidadesTecnicasSituacao();
        const objetosConhecimento = extractObjetosConhecimentoSituacao();
        const capacidadesSocioemocionais = extractCapacidadesSocioemocionaisSituacao();
        const contextualizacao = extractContextualizacaoSituacao();
        const desafio = extractDesafioSituacao();
        const resultados = extractResultadosEsperadosSituacao();

        if (capacidadesTecnicas) dados.capacidadesTecnicasSituacao = capacidadesTecnicas;
        if (objetosConhecimento) dados.objetosConhecimentoSituacao = objetosConhecimento;
        if (capacidadesSocioemocionais) dados.capacidadesSocioemocionaisSituacao = capacidadesSocioemocionais;
        if (contextualizacao) dados.contextualizacaoSituacao = contextualizacao;
        if (desafio) dados.desafioSituacao = desafio;
        if (resultados) dados.resultadosEsperadosSituacao = resultados;

        return dados;

    } catch (error) {
        console.error('Erro na extração:', error);
        return { error: error.message };
    }
}
