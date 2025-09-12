import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, Download } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

// Mock data for the radar chart
const competenciasData = [
  { competencia: "Lógica de Programação", requerido: 90, aluno: 75 },
  { competencia: "Banco de Dados", requerido: 85, aluno: 80 },
  { competencia: "Interface de Usuário", requerido: 80, aluno: 70 },
  { competencia: "Arquitetura de Software", requerido: 75, aluno: 60 },
  { competencia: "Testes e Qualidade", requerido: 70, aluno: 65 },
  { competencia: "Gestão de Projetos", requerido: 65, aluno: 55 },
];

const cursos = ["Técnico em Desenvolvimento de Sistemas 2024"];
const turmas = [
  "91870 - T DESI 2024 1 V1",
  "91873 - T DESS 2024 1 V2", 
  "91872 - T DESS 2024 1 V1"
];
const alunos = [
  "Arthur de Lima Silveira",
  "Bruno Davi Dutka",
  "Cauã Pavarin Portolan",
  "Eduardo Ramos Pereira",
  "Estevão Uber Góes",
  "Felipe de Lima Pereira",
  "Felipe Simoes Machado",
  "Guilherme Antunes Torres",
  "Isaque Klehm",
  "João Vitor Manoel Prudêncio",
  "Katleen Moreira Silva"
];

const tiposDesafio = [
  "Situação de Aprendizagem",
  "Preparativo SAEP",
  "Exercícios teóricos"
];

const desafiosGerados = [
  {
    descricao: "Desenvolvimento de Sistema Web com React",
    detalhes: "Criar uma aplicação web completa utilizando React e integração com API REST",
    arquivo: "desafio_react_sistema.pdf"
  },
  {
    descricao: "Modelagem de Banco de Dados Relacional",
    detalhes: "Desenvolver um modelo ER para sistema de gestão escolar",
    arquivo: "desafio_bd_modelagem.pdf"
  },
  {
    descricao: "Simulado SAEP - Lógica de Programação",
    detalhes: "Exercícios preparatórios para avaliação nacional focados em algoritmos",
    arquivo: "simulado_saep_logica.pdf"
  }
];

export default function AnaliseAluno() {
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedAluno, setSelectedAluno] = useState("");
  const [tipoDesafio, setTipoDesafio] = useState("");
  const [detalhesDesafio, setDetalhesDesafio] = useState("");

  const handleGerarDesafio = () => {
    if (!tipoDesafio || !detalhesDesafio.trim()) {
      alert("Por favor, selecione o tipo de desafio e adicione detalhes.");
      return;
    }
    
    alert("Desafio gerado com sucesso! (Implementação completa via integração Gemini AI)");
    setTipoDesafio("");
    setDetalhesDesafio("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Aluno</h1>
        <p className="text-muted-foreground">
          Analise o desempenho individual dos estudantes e gere desafios personalizados
        </p>
      </div>

      {/* Selectors */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Seleção de Aluno</CardTitle>
          <CardDescription className="text-muted-foreground">
            Escolha o curso, turma e aluno para análise detalhada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Cursos</Label>
              <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turma">Turmas</Label>
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aluno">Estudantes</Label>
              <Select value={selectedAluno} onValueChange={setSelectedAluno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estudante" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno} value={aluno}>{aluno}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Gráfico de Competências</CardTitle>
          <CardDescription className="text-muted-foreground">
            Comparação entre competências requeridas do curso e o desempenho atual do aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competenciasData}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis 
                  dataKey="competencia" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  className="text-xs"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <Radar
                  name="Competências Requeridas"
                  dataKey="requerido"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name={selectedAluno || "Aluno Selecionado"}
                  dataKey="aluno"
                  stroke="hsl(var(--primary-glow))"
                  fill="hsl(var(--primary-glow))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Legend 
                  wrapperStyle={{ color: "hsl(var(--foreground))" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Creation */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Criar Desafios
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Gere desafios personalizados baseados no perfil do aluno selecionado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-desafio">Selecione o tipo de desafio que gostaria propor ao aluno</Label>
              <Select value={tipoDesafio} onValueChange={setTipoDesafio}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo de desafio" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDesafio.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalhes-desafio">Escreva aqui mais detalhes sobre como gostaria de gerar este desafio</Label>
              <Textarea
                id="detalhes-desafio"
                placeholder="Descreva os objetivos, tópicos específicos, nível de dificuldade, ou qualquer requisito especial para o desafio..."
                value={detalhesDesafio}
                onChange={(e) => setDetalhesDesafio(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={handleGerarDesafio}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-primary"
              size="lg"
            >
              <Brain className="h-4 w-4 mr-2" />
              Gerar Desafio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Challenges */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Desafios Gerados
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista de desafios criados para os alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {desafiosGerados.map((desafio, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-accent/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <h4 className="font-medium text-foreground">{desafio.descricao}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{desafio.detalhes}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Arquivo: {desafio.arquivo}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
