import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FlowsPage from "./pages/FlowsPage";
import StepsPage from "./pages/StepsPage";
import FlowDetailPage from "./pages/FlowDetailPage";
import SearchPage from "./pages/SearchPage";
import ConfigPage from "./pages/ConfigPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/flows" element={<FlowsPage />} />
          <Route path="/etapas" element={<StepsPage />} />
          <Route path="/flow/:flowId" element={<FlowDetailPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
