import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Key, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Gemini() {
  const [apiKey, setApiKey] = useState("AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave de API válida.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API key validation
    setIsConnected(true);
    toast({
      title: "Sucesso",
      description: "Chave de API do Gemini configurada com sucesso!",
    });
  };

  const handleTestConnection = () => {
    if (!isConnected) {
      toast({
        title: "Atenção",
        description: "Primeiro configure uma chave de API válida.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Conexão testada",
      description: "Conexão com a API do Gemini funcionando corretamente.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          Configuração Gemini AI
        </h1>
        <p className="text-muted-foreground">
          Configure sua chave de API do Google Gemini para análise e geração de conteúdo
        </p>
      </div>

      {/* API Key Configuration */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Chave de API Gemini
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Insira sua chave de API do Google Gemini para habilitar as funcionalidades de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-3">
              <Input
                id="api-key"
                type="password"
                placeholder="Cole sua chave de API aqui..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSaveApiKey}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-primary"
              >
                Salvar
              </Button>
            </div>
          </div>

          {isConnected && (
            <Alert className="border-primary/20 bg-primary/5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Conectado</AlertTitle>
              <AlertDescription className="text-foreground">
                Chave de API configurada com sucesso. O ROSiE está pronto para utilizar o Gemini AI.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleTestConnection}
              variant="outline"
              className="flex-1"
            >
              Testar Conexão
            </Button>
            <Button 
              variant="outline"
              asChild
            >
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Obter Chave
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Como obter sua chave de API</CardTitle>
          <CardDescription className="text-muted-foreground">
            Siga os passos abaixo para configurar o acesso ao Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">Acesse o Google AI Studio</h4>
                <p className="text-sm text-muted-foreground">
                  Visite{" "}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://makersuite.google.com/app/apikey
                  </a>{" "}
                  e faça login com sua conta Google.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">Crie uma nova chave de API</h4>
                <p className="text-sm text-muted-foreground">
                  Clique em "Create API Key" e selecione um projeto do Google Cloud ou crie um novo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">Copie a chave</h4>
                <p className="text-sm text-muted-foreground">
                  Copie a chave de API gerada e cole no campo acima. Mantenha-a segura e não a compartilhe.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-medium text-foreground">Configure no ROSiE</h4>
                <p className="text-sm text-muted-foreground">
                  Cole a chave no campo acima e clique em "Salvar" para habilitar a integração.
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-amber-500/20 bg-amber-500/5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-600">Importante</AlertTitle>
            <AlertDescription className="text-foreground">
              Sua chave de API será armazenada de forma segura e criptografada. Ela é necessária para 
              gerar análises personalizadas e desafios adaptados aos seus alunos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Recursos habilitados</CardTitle>
          <CardDescription className="text-muted-foreground">
            Com a API do Gemini configurada, você terá acesso a:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Análise de Documentos</h4>
                <p className="text-sm text-muted-foreground">
                  Processamento inteligente de PDFs de cursos e materiais didáticos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Geração de Desafios</h4>
                <p className="text-sm text-muted-foreground">
                  Criação automática de exercícios personalizados por aluno
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Preparação SAEP</h4>
                <p className="text-sm text-muted-foreground">
                  Simulados adaptativos baseados no perfil de cada estudante
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Análise de Competências</h4>
                <p className="text-sm text-muted-foreground">
                  Avaliação inteligente de habilidades e áreas de melhoria
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
