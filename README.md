# 🌐 Bem-vindo ao ROSiE

> **ROSiE** significa **Reimaginar** e **Organizar** os **Saberes** **Individuais** dos **Estudantes**

**ROSiE** nasceu para enfrentar um problema real: como criar, centralizar e personalizar conteúdos pedagógicos que realmente façam os estudantes reterem conhecimento — reduzindo reprovações, evasão e retrabalho. Aproveitamos as capacidades do ecossistema Gemini (Chat, Gems, NotebookLM, etc.) para construir um fluxo que transforma planos de ensino em atividades, avaliações e relatórios orientados ao estudante, com ênfase em acessibilidade, custo zero e replicabilidade.

---

# Desafios enfrentados pelos docentes

* **Falta de tempo para planejar aulas detalhadas** <br>
  Preparar planos de aula ricos, com atividades práticas criativas e recursos alinhados ao conteúdo demanda horas que muitas vezes não existem.

* **Personalização em escala** <br>
  Adaptar mesmo conteúdo para diferentes níveis, estilos de aprendizagem e turmas heterogêneas é trabalhoso e pouco viável manualmente.

* **Baixo engajamento em sala** <br>
  Dificuldade em criar atividades interativas e dinâmicas que mantenham estudantes envolvidos e promovam aprendizado ativo.

* **Organização e reaproveitamento de recursos** <br>
  Recursos (tutoriais, prompts, avaliações) ficam espalhados; falta um repositório fácil de consultar e compartilhar.

* **Avaliação formativa e feedback rápido** <br>
  Gerar instrumentos de avaliação, analisar resultados e transformar isso em planos de recuperação é processo lento.

* **Replicabilidade e custo** <br>
  Soluções que exigem softwares pagos ou configurações complexas não são viáveis para ampla difusão entre docentes.

ROSiE foi projetado para atacar diretamente esses pontos, entregando automação quando possível e caminhos simples para garantir replicabilidade.

---

# Funcionalidades principais

## 1. Personalização com IA — "Aluno no centro"

* **Análise de competências**: a partir de um plano de ensino ou histórico de desempenho, ROSiE identifica competências-chave e lacunas por estudante.
* **Perfis de aprendizagem**: agrupa comportamentos e dificuldades para sugerir caminhos de estudo personalizados.

## 2. Planejamento de aula otimizado

* **Geração automática de planos de aula**: transforma um conteúdo em sequência de aulas com objetivos, recursos, métodos e instrumentos de avaliação.
* **Sugestões práticas**: atividades laboratoriais, estudos de caso, projetos por módulo, listas de exercícios e roteiros para simulações.
* **Organização de recursos**: coleta e sugere links, vídeos, artigos e bibliografias relacionadas para cada aula.

## 3. Extensão Chrome — extração de plano de ensino e análise com Gemini

* **Extração automática de planos do SGN (SENAI)**: coleta campos chave do plano.
* **Análise do plano por IA**: os dados extraídos do plano de ensino são enviados ao Gemini, junto a um prompt especificando como deve ser descrito e formatado cada informação. Então uma análise é gerada e apresentado possíveis correções e melhorias no plano.

## 4. Biblioteca colaborativa de prompts e templates

* **Coleção de prompts otimizados** para uso direto no Gemini (planejamento, mediação, avaliação).
* **Guias passo-a-passo** para replicação por outros docentes (copiar/colar, ajustar parâmetros, interpretar respostas).
* **Compartilhamento** interno para equipes (salvar templates e melhores práticas).

## 5. Simulados adaptativos e preparação SAEP

* **Simulados calibrados** ao perfil do estudante, com feedback e caminhos de estudo sugeridos.
* **Relatórios comparativos** (aluno vs. competên­cia esperada).

## 6. Painéis, métricas e priorização

* **Métricas por competência**: quais tópicos merecem prioridade para cada turma e para cada estudante.
* **Análise de impacto**: estimativa de quanto tempo/recursos focar em determinados tópicos para maximizar retenção.

## 7. Prompts utilizados na criação do ROSiE

* **Arquivo com todos os prompts documentados**: veja [neste documento](https://github.com/lucasedferreira/s-gemini/blob/master/docs/prompts.md) os prompts utilizados durante o desenvolvimento das automações no ROSiE, desde análise do plano de ensino até geração de conteúdos específicos para cada estudante.

## 8. Custo

* **Modo manual**: repositório de prompts e workflow para uso com a versão gratuita do Gemini.
* **Modo automatizado**: integração do backend com API do Gemini por meio da API Key fornecida de forma gratuita.

---

# Conclusão — Por que usar ROSiE?

O ROSiE fornece soluções com uso exclusivo do Gemini, de forma gratuita e acessível:

1. **Planejamento de Aula Otimizado** — fluxos e prompts que geram planos detalhados, atividades práticas e adaptação por níveis, prontos para colar no Gemini gratuito.
2. **Mediação de Aula Dinâmica** — templates para gerar jogos, debates, roteiros de simulação e respostas rápidas em sala, todos otimizados para uso no Gemini gratuito.
3. **Acessibilidade e replicabilidade** — biblioteca de prompts, exemplos e tutoriais passo-a-passo para qualquer docente do SENAI replicar.
4. **Custo Zero** — modo principal do projeto foi pensado para operar usando API Key gratuita do Gemini.
5. **Biblioteca de prompts** — instruções e templates de prompts para uso direto com a interface do Gemini.

---

# Como rodar localmente & Tecnologias utilizadas


1. Clonar
```bash
git clone https://github.com/lucasedferreira/s-gemini.git
cd s-gemini
```

2. Backend
```bash
cd backend
python -m venv venv

# Linux / Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# adicione GEMINI_API_KEY no .env

python app.py
```

3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

4. Extensão Chrome

Abra chrome://extensions/ → Modo desenvolvedor → Carregar sem compactação → selecione chrome-extension/


**Tecnologias utilizadas**

* Frontend: **React**, **TailwindCSS**, **Node.js (v22)**
* Extensão: **JavaScript ES6+**, **HTML5/CSS3**, **Chrome Extension API**
* Backend: **Python 3.8+**, **Flask**, **Flask-CORS**, **python-dotenv**
* IA: **Google Gemini** (fluxos projetados para uso com a **versão gratuita**)
* Formatos: **Markdown / HTML** para exportação de análises e relatórios

---

# Estrutura

* Dentro do repositório há:

  * `docs/prompts.md` — biblioteca de prompts prontos para uso no Gemini gratuito.
  * `chrome-extension/` — extensão S-GemiNi para extrair planos do SGN e gerar prompt automaticamente (funciona em modo manual sem backend).
  * `backend/` e `frontend/` — versões para automação e interface rica.

---

# Créditos

Desenvolvido para o Hackathon Docente - Gemini (SENAI) por
- Bruno Jose da Silva Batista
- Lucas Eduardo Batista Ferreira
- Bruno Musskopf
- Thais Caroline Vieira
- Vitor Fabiano Pruss

