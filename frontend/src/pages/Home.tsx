import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-card">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bem-vindo ao ROSiE
          </h1>
          <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
            <p className="text-lg text-foreground leading-relaxed">
              <span className="font-semibold text-primary">ROSiE</span> significa{" "}
              <span className="font-semibold">Reimaginar e Organizar os Saberes Individuais dos Estudantes.</span>
            </p>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Este projeto visa abordar a forma como criamos conteúdos para nossos alunos, trazendo uma abordagem criativa na criação de atividades e desafios individuais dos alunos em relação às capacidades dos cursos do Senai, bem como melhorar a preparação destes alunos para avaliações de desempenho nacionais como o Sistema de Avaliação da Educação Proficional (SAEP).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Ativos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">
              Sistemas em análise
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turmas Cadastradas
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">11</div>
            <p className="text-xs text-muted-foreground">
              Estudantes monitorados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Análises IA
            </CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground">
              Relatórios gerados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance SAEP
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+23%</div>
            <p className="text-xs text-muted-foreground">
              Melhoria média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Análise Inteligente
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Utilize IA para criar conteúdos personalizados para cada estudante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Integração com Gemini AI para análise de competências</li>
              <li>• Geração automática de desafios personalizados</li>
              <li>• Relatórios detalhados de desempenho individual</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Preparação SAEP
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Melhore a preparação dos alunos para avaliações nacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Simulados adaptativos baseados no perfil do aluno</li>
              <li>• Acompanhamento de progresso em tempo real</li>
              <li>• Identificação de áreas que precisam de reforço</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
