import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import SoloCount from "@/pages/SoloCount";
import QuickCount from "@/pages/QuickCount";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/room/:code/solo" component={SoloCount} />
      <Route path="/room/:code/count" component={QuickCount} />
      <Route path="/room/:code" component={SoloCount} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
