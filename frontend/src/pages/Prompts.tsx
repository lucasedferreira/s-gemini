import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// Dados iniciais de exemplo
const initialPrompts = [
    {
        id: 1,
        title: "Analisar Plano de Ensino",
        description:
            "Obter uma análise pedagógica de um plano de ensino, com pontos fortes, fraquezas e sugestões práticas.",
        category: "",
        content: `Você é um avaliador pedagógico especializado na Metodologia SENAI de Educação Profissional.
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
Exemplo: em uma UC de Soldagem, marcar “Executar processos de união de metais”, não funções de inspeção que são tratadas em outra UC.

- Objetivos Gerais da Unidade Curricular
Objetivo: elaborar frases no infinitivo, coerentes com as competências previstas.
Evite descrições vagas (ex.: “aprender sobre soldagem”).
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
- Apresentações orais
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
Exemplo: "Prevê-se adaptação das práticas de soldagem para alunos com restrições motoras, priorizando atividades de inspeção visual."

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

{{INSERIR TEXTO AQUI}}
        `,
        tags: ["Educação", "SGN"],
    },
    {
        id: 2,
        title: "Criar Preparativo para o SAEP",
        description:
            "Gerar um preparativo para o SAEP para um aluno específico, especificando o nível que ele possui e o esperado de cada competência.",
        category: "",
        content: `Você é um assistente especializado em auxiliar estudantes da educação profissional e tecnológica no preparativo para o SAEP (Sistema de Avaliação da Educação Profissional e Tecnológica).

Com base nos níveis de competência informados, produza um plano de preparação personalizado que:
- Destaque os pontos fortes do aluno.
- Identifique lacunas em relação ao nível esperado.
- Sugira atividades, conteúdos e estratégias de estudo direcionadas para reduzir essas lacunas.
- Traga orientações práticas que o aluno consiga aplicar no seu cotidiano de estudos.

Dados do aluno
Nome do estudante: {{NOME DO ESTUDANTE}}
Curso/Área: {{CURSO/UC}}

Competências avaliadas

Competência: {{COMPETÊNCIA}}
Nível esperado pelo SAEP: {{NÍVEL ESPERADO. EX: 60}}
Nível do estudante: {{NÍVEL DO ALUNO. EX: 75}}

Competência: {{COMPETÊNCIA}}
Nível esperado pelo SAEP: {{NÍVEL ESPERADO. EX: 34}}
Nível do estudante: {{NÍVEL DO ALUNO. EX: 68}}

{{REPITA CONFORME NECESSÁRIO}}

Observações do docente

{{OBSERVAÇÕES}}

Pedido à IA

Com base nos dados fornecidos, elabore um plano estruturado de preparação para o SAEP, incluindo:

- Resumo das lacunas por competência.
- Sugestões de estudo e prática específicas para cada competência.
- Estratégias motivacionais e de organização de estudo.
- Recomendações de materiais e atividades que possam ajudar o aluno a atingir o nível esperado.`,
        tags: ["SAEP", "Foco-Estudante", "Material para Estudo"],
    },
    {
        id: 3,
        title: "Criar exercícios teóricos",
        description:
            "Gerar uma lista de exercícios para um aluno específico, determinando o nível que ele possui e o esperado de cada competência.",
        category: "",
        content: `Você é um assistente especializado em criar exercícios teóricos personalizados para estudantes da educação profissional e tecnológica.

Com base nas competências fornecidas, desenvolva exercícios que:
- Estejam adequados ao nível atual do aluno, mas que também o desafiem a se aproximar do nível esperado.
- Variem em formatos (questões abertas, múltipla escolha, situações-problema, estudos de caso, etc.).
- Estimulem raciocínio, compreensão conceitual e aplicação prática.
- Possam ser utilizados tanto em estudo individual quanto em sala de aula.

Dados do aluno
Nome do estudante: {{NOME DO ESTUDANTE}}
Curso/Área: {{CURSO/UC}}

Competências avaliadas

Competência: {{COMPETÊNCIA}}
Nível esperado pelo SAEP: {{NÍVEL ESPERADO. EX: 60}}
Nível do estudante: {{NÍVEL DO ALUNO. EX: 75}}

Competência: {{COMPETÊNCIA}}
Nível esperado pelo SAEP: {{NÍVEL ESPERADO. EX: 34}}
Nível do estudante: {{NÍVEL DO ALUNO. EX: 68}}

{{REPITA CONFORME NECESSÁRIO}}

Observações do docente

{{OBSERVAÇÕES}}

Pedido à IA

Com base nas informações fornecidas, elabore uma lista de exercícios teóricos personalizados para o aluno.
Organize a saída em tópicos por competência, e em cada uma apresente:
- Exercícios básicos para consolidar o nível atual.
- Exercícios intermediários para desenvolver habilidades próximas ao esperado.
- Exercícios desafiadores que ajudem a alcançar o nível esperado.
- Inclua também sugestões de como o aluno pode corrigir e avaliar suas próprias respostas.`,
        tags: ["Lista de Exercícios", "Foco-Estudante", "Material para Estudo"],
    },
];

const categories = [
    "Programação",
    "Educação",
    "Design",
    "Negócios",
    "Ciência",
    "Outros",
];

export default function Prompts() {
    const [prompts, setPrompts] = useState(initialPrompts);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [isEditing, setIsEditing] = useState(null);
    const [newPrompt, setNewPrompt] = useState({
        title: "",
        description: "",
        category: "",
        content: "",
        tags: [],
    });
    const [newTag, setNewTag] = useState("");

    const ExpandableContent = ({ content, maxHeight = 100 }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const [needsExpansion, setNeedsExpansion] = useState(false);
        const contentRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (contentRef.current) {
                setNeedsExpansion(contentRef.current.scrollHeight > maxHeight);
            }
        }, [content, maxHeight]);

        return (
            <div className="relative">
                {/* Container principal com overflow hidden */}
                <div
                    ref={contentRef}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                        maxHeight:
                            !isExpanded && needsExpansion
                                ? `${maxHeight}px`
                                : "none",
                    }}
                >
                    {/* Conteúdo real */}
                    <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                </div>

                {/* Overlay de fade out POSICIONADO FORA do container com overflow */}
                {!isExpanded && needsExpansion && (
                    <div
                        className="absolute bottom-6 left-0 right-0 h-8 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to top, hsl(var(--muted)) 0%, transparent 100%)",
                        }}
                    />
                )}

                {/* Botão de expandir/recolher */}
                {needsExpansion && (
                    <div className="mt-2 flex justify-start">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs text-primary hover:underline font-medium flex items-center"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Mostrar menos
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Mostrar mais
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Filtra os prompts com base na pesquisa e categoria
    const filteredPrompts = prompts.filter((prompt) => {
        const matchesSearch =
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesCategory =
            selectedCategory === "Todas" ||
            ("category" in prompt && prompt.category === selectedCategory);

        return matchesSearch && matchesCategory;
    });

    const handleAddPrompt = () => {
        if (!newPrompt.title || !newPrompt.content) {
            alert("Título e conteúdo são obrigatórios!");
            return;
        }

        const newPromptObj = {
            id:
                prompts.length > 0
                    ? Math.max(...prompts.map((p) => p.id)) + 1
                    : 1,
            ...newPrompt,
        };

        setPrompts([...prompts, newPromptObj]);
        setNewPrompt({
            title: "",
            description: "",
            category: "",
            content: "",
            tags: [],
        });
    };

    const handleEditPrompt = (id) => {
        setIsEditing(id);
    };

    const handleSaveEdit = (id) => {
        setIsEditing(null);
        // A edição já é feita diretamente no estado através dos inputs controlados
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
    };

    const handleDeletePrompt = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este prompt?")) {
            setPrompts(prompts.filter((prompt) => prompt.id !== id));
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !newPrompt.tags.includes(newTag.trim())) {
            setNewPrompt({
                ...newPrompt,
                tags: [...newPrompt.tags, newTag.trim()],
            });
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setNewPrompt({
            ...newPrompt,
            tags: newPrompt.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrompt({
            ...newPrompt,
            [name]: value,
        });
    };

    const handleEditInputChange = (id, field, value) => {
        setPrompts(
            prompts.map((prompt) =>
                prompt.id === id ? { ...prompt, [field]: value } : prompt
            )
        );
    };

    const handleEditTag = (id, tagToRemove) => {
        setPrompts(
            prompts.map((prompt) =>
                prompt.id === id
                    ? {
                          ...prompt,
                          tags: prompt.tags.filter(
                              (tag) => tag !== tagToRemove
                          ),
                      }
                    : prompt
            )
        );
    };

    const handleAddEditTag = (id: number, tagText: string) => {
        if (tagText.trim()) {
            setPrompts(
                prompts.map((prompt) =>
                    prompt.id === id && !prompt.tags.includes(tagText.trim())
                        ? {
                              ...prompt,
                              tags: [...prompt.tags, tagText.trim()],
                          }
                        : prompt
                )
            );
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Prompts
                </h1>
                <p className="text-muted-foreground">
                    Lista de prompts para uso com IA generativa
                </p>
            </div>

            {/* Filtros e Busca */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtrar Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por título, descrição, conteúdo ou tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="Todas">
                                    Todas as categorias
                                </option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Adicionar Novo Prompt */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Adicionar Novo Prompt</CardTitle>
                    <CardDescription>
                        Crie um novo prompt para ser usado com IA generativa
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={newPrompt.title}
                                onChange={handleInputChange}
                                placeholder="Título do prompt"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <select
                                id="category"
                                name="category"
                                value={newPrompt.category}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="">
                                    Selecione uma categoria
                                </option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            name="description"
                            value={newPrompt.description}
                            onChange={handleInputChange}
                            placeholder="Breve descrição do propósito deste prompt"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Conteúdo do Prompt *</Label>
                        <Textarea
                            id="content"
                            name="content"
                            value={newPrompt.content}
                            onChange={handleInputChange}
                            placeholder="Escreva aqui o prompt completo..."
                            rows={6}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Adicionar tag"
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), handleAddTag())
                                }
                            />
                            <Button
                                type="button"
                                onClick={handleAddTag}
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {newPrompt.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleAddPrompt} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Prompt
                    </Button>
                </CardContent>
            </Card> */}

            {/* Lista de Prompts */}
            <Card>
                <CardHeader>
                    <CardTitle>Prompts Existentes</CardTitle>
                    <CardDescription>
                        {filteredPrompts.length} prompt(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {filteredPrompts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhum prompt encontrado. Crie um novo prompt
                                para começar.
                            </p>
                        ) : (
                            filteredPrompts.map((prompt) => (
                                <div
                                    key={prompt.id}
                                    className="border rounded-lg p-4 space-y-4"
                                >
                                    {isEditing === prompt.id ? (
                                        // Modo de edição
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`edit-title-${prompt.id}`}
                                                    >
                                                        Título *
                                                    </Label>
                                                    <Input
                                                        id={`edit-title-${prompt.id}`}
                                                        value={prompt.title}
                                                        onChange={(e) =>
                                                            handleEditInputChange(
                                                                prompt.id,
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`edit-category-${prompt.id}`}
                                                    >
                                                        Categoria
                                                    </Label>
                                                    <select
                                                        id={`edit-category-${prompt.id}`}
                                                        value={prompt.category}
                                                        onChange={(e) =>
                                                            handleEditInputChange(
                                                                prompt.id,
                                                                "category",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                    >
                                                        <option value="">
                                                            Selecione uma
                                                            categoria
                                                        </option>
                                                        {categories.map(
                                                            (category) => (
                                                                <option
                                                                    key={
                                                                        category
                                                                    }
                                                                    value={
                                                                        category
                                                                    }
                                                                >
                                                                    {category}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`edit-description-${prompt.id}`}
                                                >
                                                    Descrição
                                                </Label>
                                                <Input
                                                    id={`edit-description-${prompt.id}`}
                                                    value={prompt.description}
                                                    onChange={(e) =>
                                                        handleEditInputChange(
                                                            prompt.id,
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`edit-content-${prompt.id}`}
                                                >
                                                    Conteúdo do Prompt *
                                                </Label>
                                                <Textarea
                                                    id={`edit-content-${prompt.id}`}
                                                    value={prompt.content}
                                                    onChange={(e) =>
                                                        handleEditInputChange(
                                                            prompt.id,
                                                            "content",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={6}
                                                    className="resize-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tags</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Adicionar tag"
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                e.preventDefault();
                                                                const target =
                                                                    e.target as HTMLInputElement;
                                                                handleAddTag();
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            const input = (
                                                                e.currentTarget as HTMLElement
                                                            )
                                                                .previousElementSibling as HTMLInputElement;
                                                            handleAddEditTag(
                                                                prompt.id,
                                                                input.value
                                                            );
                                                            input.value = "";
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {prompt.tags.map(
                                                        (tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="flex items-center gap-1"
                                                            >
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditTag(
                                                                            prompt.id,
                                                                            tag
                                                                        )
                                                                    }
                                                                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    onClick={() =>
                                                        handleSaveEdit(
                                                            prompt.id
                                                        )
                                                    }
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Salvar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleCancelEdit}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        // Modo de visualização
                                        <>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {prompt.title}
                                                    </h3>
                                                    {prompt.category && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1"
                                                        >
                                                            {prompt.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {/* <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditPrompt(
                                                                prompt.id
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeletePrompt(
                                                                prompt.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Excluir
                                                    </Button>
                                                </div> */}
                                            </div>

                                            {prompt.description && (
                                                <p className="text-muted-foreground">
                                                    {prompt.description}
                                                </p>
                                            )}

                                            <div className="bg-muted p-4 rounded-md">
                                                <pre className="whitespace-pre-wrap text-sm">
                                                    <ExpandableContent
                                                        content={prompt.content}
                                                        maxHeight={275}
                                                    />
                                                </pre>
                                            </div>

                                            {prompt.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {prompt.tags.map(
                                                        (tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
