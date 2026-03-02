import { Component, ErrorInfo, ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AdminFab } from "@/components/AdminFab";
import ScrollToTop from "@/components/ScrollToTop";

import Home from "@/pages/Home";
import About from "@/pages/About";
import EventsPage from "@/pages/EventsPage";
import Contact from "@/pages/Contact";
import MUN from "@/pages/MUN";
import Magazine from "@/pages/Magazine";
import AdminDashboard from "@/pages/AdminDashboard";
import AuthPage from "@/pages/AuthPage";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border-2 border-red-500 rounded-lg p-8">
            <h1 className="font-display text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="font-body text-ink/70 mb-4">
              The application encountered an error. Please check the browser console for details.
            </p>
            {this.state.error && (
              <pre className="bg-red-50 p-4 rounded text-sm overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-ink text-cream rounded hover:bg-gold hover:text-ink transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex flex-col">
        <ScrollToTop />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/events" component={EventsPage} />
          <Route path="/mun" component={MUN} />
          <Route path="/magazine" component={Magazine} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/login" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <AdminFab />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
