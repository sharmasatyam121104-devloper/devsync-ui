"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Layers, 
  CheckCircle2, 
  MessageSquare, 
  Bug, 
  Share2, 
  LayoutDashboard,
  ArrowRight,
  Zap,
  Rocket,
  Shield
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10">

      {/* --- Navigation --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5">
              <Layers className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">DevSync</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- Hero Section --- */}
        <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b bg-dot-pattern">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start space-y-8 text-left">
              <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-3 duration-500">
                🚀 Built for Student Developers
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Sync your team, <br />
                <span className="text-primary">ship your projects.</span>
              </h1>

              <p className="text-muted-foreground text-xl max-w-135 leading-relaxed">
                The all-in-one collaboration platform for student teams. Manage tasks, 
                chat with peers, and track issues in one centralized workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 text-md font-semibold group">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold bg-background">
                  View Components
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                      U{i}
                    </div>
                  ))}
                </div>
                <p>Joined by 500+ student teams</p>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <Card className="relative border shadow-2xl overflow-hidden bg-background/50 backdrop-blur">
                <CardHeader className="border-b bg-muted/30 py-3 flex flex-row items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-destructive/50" />
                    <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-3 w-32 bg-muted rounded mx-auto" />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="h-4 w-[40%] bg-primary/20 rounded" />
                    <div className="h-4 w-[90%] bg-muted rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-lg border-2 border-dashed flex items-center justify-center">
                       <Zap className="h-6 w-6 text-muted" />
                    </div>
                    <div className="h-24 rounded-lg bg-primary/10 border border-primary/20" />
                  </div>
                  <div className="h-20 bg-muted rounded-lg w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Focus on Building, Not Managing</h2>
              <p className="text-muted-foreground text-lg">
                DevSync provides the essential tools to manage development cycles without the complexity of enterprise software.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<LayoutDashboard className="h-5 w-5 text-primary" />}
                title="Project Management"
                description="Organize your team's roadmap and sprint cycles with ease."
              />
              <FeatureCard 
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                title="Task Tracking"
                description="Assign tasks and monitor progress through high-visibility boards."
              />
              <FeatureCard 
                icon={<MessageSquare className="h-5 w-5 text-primary" />}
                title="Team Communication"
                description="Real-time chat focused on specific tasks and features."
              />
              <FeatureCard 
                icon={<Bug className="h-5 w-5 text-primary" />}
                title="Issue Tracking"
                description="Identify, label, and resolve bugs before they reach production."
              />
              <FeatureCard 
                icon={<Share2 className="h-5 w-5 text-primary" />}
                title="File Sharing"
                description="Centralize documentation, assets, and project resources."
              />
              <FeatureCard 
                icon={<Rocket className="h-5 w-5 text-primary" />}
                title="Rapid Deployment"
                description="Tools designed to help you launch your MVPs faster."
              />
            </div>
          </div>
        </section>

        {/* --- How it Works Section --- */}
        <section id="how-it-works" className="py-24 border-t">
          <div className="max-w-7xl mx-auto px-6">
             <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Get Started in Minutes</h2>
             <div className="grid md:grid-cols-3 gap-12 relative">
                <Step number="01" title="Create Account" description="Sign up with your student email and set up your personal profile." />
                <Step number="02" title="Invite Team" description="Create a workspace and invite your teammates with a simple link." />
                <Step number="03" title="Start Syncing" description="Create tasks, upload files, and start building your project." />
             </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t bg-background py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">DevSync</span>
            </div>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Designed for student developers who want a clean, professional, and efficient way to collaborate.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Resources</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-primary transition-colors">Components</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Community</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-primary transition-colors">Discord</Link>
              <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DevSync. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Shield className="h-4 w-4" />
            <span>Secure Enterprise SSL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Reusable Sub-components ---

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border shadow-none hover:shadow-lg hover:border-primary/20 transition-all duration-300">
    <CardHeader>
      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
        {icon}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-muted-foreground text-sm leading-relaxed">
      {description}
    </CardContent>
  </Card>
);

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center space-y-4 relative">
    <div className="text-4xl font-black text-primary/10 absolute -top-8 left-1/2 -translate-x-1/2 z-0">
      {number}
    </div>
    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg relative z-10 shadow-lg shadow-primary/20">
      {number.replace('0', '')}
    </div>
    <h3 className="text-xl font-bold relative z-10">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-50 relative z-10">{description}</p>
  </div>
);

export default Home;