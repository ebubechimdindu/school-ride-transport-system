
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/auth/StudentLogin";
import StudentRegister from "./pages/auth/StudentRegister";
import DriverLogin from "./pages/auth/DriverLogin";
import DriverRegister from "./pages/auth/DriverRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/student/login" element={<StudentLogin />} />
          <Route path="/auth/student/register" element={<StudentRegister />} />
          <Route path="/auth/driver/login" element={<DriverLogin />} />
          <Route path="/auth/driver/register" element={<DriverRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
