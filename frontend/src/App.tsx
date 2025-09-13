import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import AnaliseAluno from "./pages/AnaliseAluno";
import Prompts from "./pages/Prompts";
import Gemini from "./pages/Gemini";
import Cursos from "./pages/Cursos";
import Turmas from "./pages/Turmas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analise-aluno" element={<AnaliseAluno />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/configuracoes/gemini" element={<Gemini />} />
            <Route path="/configuracoes/cursos" element={<Cursos />} />
            <Route path="/configuracoes/turmas" element={<Turmas />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
