import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Upload, FileSpreadsheet, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cursosDisponiveis = [
  "Técnico em Desenvolvimento de Sistemas 2024",
  "Técnico em Redes de Computadores 2024",
  "Técnico em Informática para Internet 2024"
];

const turmasCadastradas = [
  {
    id: "91870",
    nome: "91870 - T DESI 2024 1 V1",
    curso: "Técnico em Desenvolvimento de Sistemas 2024",
    arquivo: "91870 - T DESI 2024 1 V1.xlsx"
  },
  {
    id: "91873", 
    nome: "91873 - T DESS 2024 1 V2",
    curso: "Técnico em Desenvolvimento de Sistemas 2024",
    arquivo: "91873 - T DESS 2024 1 V2.xlsx"
  },
  {
    id: "91872",
    nome: "91872 - T DESS 2024 1 V1", 
    curso: "Técnico em Desenvolvimento de Sistemas 2024",
    arquivo: "91872 - T DESS 2024 1 V1.xlsx"
  }
];

export default function Turmas() {
  const [nomeTurma, setNomeTurma] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const { toast } = useToast();

  const handleAdicionarTurma = () => {
    if (!nomeTurma.trim() || !cursoSelecionado) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da turma e selecione um curso.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: `Turma "${nomeTurma}" cadastrada com sucesso!`,
    });
    setNomeTurma("");
    setCursoSelecionado("");
  };

  const handleUploadAlunos = () => {
    toast({
      title: "Upload",
      description: "Funcionalidade de upload de planilha será implementada.",
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template",
      description: "Download do modelo de planilha iniciado.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Turmas
        </h1>
        <p className="text-muted-foreground">
          Cadastre turmas e importe listas de alunos via Excel ou CSV
        </p>
      </div>

      {/* Class Creation */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Cadastrar Nova Turma</CardTitle>
          <CardDescription className="text-muted-foreground">
            Adicione uma nova turma ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome-turma">Nome da Turma</Label>
              <Input
                id="nome-turma"
                placeholder="Ex: 91874 - T DESI 2024 1 V3"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursosDisponiveis.map((curso) => (
                    <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAdicionarTurma}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-primary"
          >
            Cadastrar Turma
          </Button>
        </CardContent>
      </Card>

      {/* Students Upload */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Importar Lista de Alunos</CardTitle>
          <CardDescription className="text-muted-foreground">
            Faça upload de planilhas Excel (.xlsx) ou CSV com os dados dos estudantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Enviar planilha de alunos</p>
              <p className="text-sm text-muted-foreground mb-4">
                Formatos aceitos: .xlsx, .xls, .csv
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={handleUploadAlunos}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                </Button>
                <Button 
                  onClick={handleDownloadTemplate}
                  variant="ghost"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Baixar Modelo
                </Button>
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2">Formato da Planilha</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A planilha deve conter as seguintes colunas:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <span className="bg-primary/10 px-2 py-1 rounded text-primary">Nome</span>
                <span className="bg-primary/10 px-2 py-1 rounded text-primary">Email</span>
                <span className="bg-primary/10 px-2 py-1 rounded text-primary">Matrícula</span>
                <span className="bg-primary/10 px-2 py-1 rounded text-primary">Data Nascimento</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registered Classes */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Turmas Cadastradas</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista de turmas ativas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turmasCadastradas.map((turma) => (
              <div key={turma.id} className="border border-border rounded-lg p-4 bg-accent/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{turma.nome}</h4>
                    <p className="text-sm text-muted-foreground">{turma.curso}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileSpreadsheet className="h-4 w-4" />
                      {turma.arquivo}
                    </span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                      <ExternalLink className="h-4 w-4" />
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
