# Extensão Chrome S-GemiNi

## 📋 Descrição

Extensão para Chrome que extrai automaticamente dados de planos de ensino do sistema SENAI e envia para análise via API Gemini. Transforma planos de ensino em análises pedagógicas especializadas com IA.

## 🚀 Funcionalidades

- ✅ Extração automática de dados do SGN
- ✅ Copiar plano de ensino formatado
- ✅ Análise pedagógica com Gemini AI
- ✅ Interface amigável e intuitiva
- ✅ Exportação de resultados em HTML

## 🛠️ Tecnologias Utilizadas

- **JavaScript ES6+** - Lógica da extensão
- **HTML5/CSS3** - Interface do popup
- **Chrome Extension API** - Integração com navegador
- **Google Gemini AI** - Análise pedagógica

## 📦 Instalação

### Instalação Desenvolvimento

1. **Clone o repositório**
```bash
git clone https://github.com/lukas-senai/s-gemini-extension.git
cd s-gemini-extension
```

2. **Acesse o Chrome**
- Abra `chrome://extensions/`
- Ative o "Modo do desenvolvedor"
- Clique em "Carregar sem compactação"
- Selecione a pasta da extensão

### Estrutura de Arquivos
```
chrome-extension/
├── manifest.json          # Configuração da extensão
├── popup.html            # Interface principal
├── popup.js             # Lógica do popup
├── background.js         # Script de fundo
├── extraction-functions.js # Funções de extração
├── icons/               # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── prompt.txt           # Prompt para Gemini
```

## ⚙️ Configuração

### Backend Required
A extensão requer que o backend Flask esteja rodando em `http://localhost:5000`

### Permissões
- `activeTab` - Acessar aba atual
- `scripting` - Executar scripts nas páginas

## 🎯 Como Usar

1. **Acesse o SGN**
   - Navegue até um plano de ensino

2. **Clique na Extensão**
   - Clique no ícone S-GemiNi na barra de extensões

3. **Extraia Dados**
   - A extensão detecta automaticamente a página
   - Os dados são extraídos em segundos

4. **Escolha Ação**
   - **Copiar**: Copia o plano formatado para clipboard
   - **Analisar**: Envia para análise com Gemini AI

5. **Visualize Resultados**
   - Uma nova aba abre com a análise completa
   - Resultados formatados em HTML

## 🔧 Funções de Extração

### Dados Extraídos
- Nome da disciplina e código UC
- Competência geral
- Funções/capacidades
- Objetivos gerais
- Ambientes pedagógicos
- Instrumentos de avaliação
- Referências bibliográficas
- Situações de aprendizagem
- Planos de aula

### Seletores Utilizados
A extensão usa seletores CSS específicos do SGN para extrair dados de:
- Formulários de plano de ensino
- Tabelas de competências
- Accordions de situações de aprendizagem

## 🚨 Solução de Problemas

**Extensão não funciona**
- Verifique se está em uma página do SGN
- Confirme que o backend está rodando
- Recarregue a página do SGN

**Dados não extraídos**
- A estrutura do SGN pode ter mudado
- Verifique o console para erros (F12)

**Erro de conexão**
- Confirme que o backend está em `http://localhost:5000`
- Verifique se há bloqueios de CORS

## 📊 Fluxo de Dados

1. **Extração**: Dados são coletados do DOM do SGN
2. **Formatação**: Dados são organizados em estrutura JSON
3. **Envio**: Enviados para backend Flask via HTTP POST
4. **Processamento**: Backend chama API Gemini
5. **Resposta**: Resultados formatados em HTML/Markdown
6. **Exibição**: Nova aba com análise completa

## 🔒 Segurança

- A extensão só acessa páginas HTTP/HTTPS
- Dados processados localmente primeiro
- API Key fica no backend, não na extensão

## 📝 Licença

Desenvolvido para Hackathon Docente - Gemini SENAI.

---

## 🚀 Como Executar o Projeto Completo

### 1. Backend
Verifique como baixar e rodar o backend [neste link](https://github.com/lukas-senai/s-gemini-server)

### 2. Extensão Chrome
- Abra `chrome://extensions/`
- Ative "Modo desenvolvedor"
- Carregue a pasta da extensão
- Acesse o SGN e use a extensão

### 3. Verificação
- Backend rodando na porta 5000
- Extensão carregada no Chrome
- Acesso ao SGN disponível

