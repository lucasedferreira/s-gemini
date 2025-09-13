import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Upload, FileText, BarChart3, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const materiaisCurso = [
  "Adaptação SC - CT Desenvolvimento de Sistemas Presencial.pdf"
];

export default function Cursos() {
  const [nomeCurso, setNomeCurso] = useState("");
  const { toast } = useToast();

  const handleAdicionarCurso = () => {
    if (!nomeCurso.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do curso.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: `Curso "${nomeCurso}" adicionado com sucesso!`,
    });
    setNomeCurso("");
  };

  const handleUploadMateriais = () => {
    toast({
      title: "Upload",
      description: "Funcionalidade de upload será implementada com integração de arquivos.",
    });
  };

  const handleGerarGraficoRadar = () => {
    toast({
      title: "Gráfico Gerado",
      description: "Análise de competências processada com base nos materiais do curso.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Cursos
        </h1>
        <p className="text-muted-foreground">
          Configure cursos e seus materiais para análise de competências
        </p>
      </div>

      {/* Course Creation */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Adicionar Novo Curso</CardTitle>
          <CardDescription className="text-muted-foreground">
            Registre um novo curso no sistema ROSiE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome-curso">Nome do Curso</Label>
            <div className="flex gap-3">
              <Input
                id="nome-curso"
                placeholder="Ex: Técnico em Desenvolvimento de Sistemas"
                value={nomeCurso}
                onChange={(e) => setNomeCurso(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAdicionarCurso}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-primary"
              >
                Adicionar Curso
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Upload */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Materiais do Curso</CardTitle>
          <CardDescription className="text-muted-foreground">
            Adicione PDFs e documentos relacionados ao curso para análise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="materiais">Adicionar Materiais</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Clique para enviar arquivos PDF</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Ou arraste e solte os arquivos aqui
                </p>
                <Button 
                  onClick={handleUploadMateriais}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </div>
            </div>

            <Separator />

            {/* Uploaded Materials */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Materiais Adicionados</h4>
              <div className="space-y-2">
                {materiaisCurso.map((material, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-accent/30">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="flex-1 text-foreground">{material}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Generation */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Gerar Gráfico Radar
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Análise visual de competências por curso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              O gráfico de radar gerado compila os materiais acima adicionados, permitindo visualizar, 
              por curso, quais habilidades são mais relevantes com base no conteúdo e na carga horária 
              propostos. Servem de base para a geração dos conteúdos individuais dos alunos.
            </p>
          </div>

          <Button 
            onClick={handleGerarGraficoRadar}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-primary"
            size="lg"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Gerar Análise de Competências
          </Button>

          {/* Sample Competencies Display */}
          <div className="mt-6 p-6 border border-primary/20 rounded-lg bg-primary/5">
            <h4 className="font-medium text-foreground mb-4">Competências Identificadas (Exemplo)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">90%</div>
                <div className="text-sm text-muted-foreground">Lógica de Programação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Banco de Dados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">80%</div>
                <div className="text-sm text-muted-foreground">Interface de Usuário</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">75%</div>
                <div className="text-sm text-muted-foreground">Arquitetura de Software</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">70%</div>
                <div className="text-sm text-muted-foreground">Testes e Qualidade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">65%</div>
                <div className="text-sm text-muted-foreground">Gestão de Projetos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
