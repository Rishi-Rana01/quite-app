'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MessageSquare, Terminal, EyeOff, Zap, Lock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 relative">
      {/* Cyberpunk background elements */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none -z-10"></div>
      
      {/* Header Section */}
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-secondary drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
          ABOUT QUITE-APP
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate protocol for secure, anonymous communication. Designed for the modern cyber-landscape.
        </p>
      </div>

      <div className="grid gap-12 md:gap-24">
        
        {/* What is it? & Why use it? */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 border-l-4 border-primary pl-6 py-2">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-primary">What is it?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Quite App is a high-tech platform that allows users to receive anonymous messages from anyone, anywhere. By sharing a unique generated link, your identity remains secure while opening a channel for honest, unfiltered communication.
            </p>
          </div>
          <div className="space-y-4 border-l-4 border-secondary pl-6 py-2">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-secondary">Why use it?</h2>
            <p className="text-muted-foreground leading-relaxed">
              In an era of hyper-visibility, anonymity is a luxury. Quite App provides a safe harbor for constructive criticism, secret confessions, and open dialogue without the fear of judgment or repercussions. It's fast, free, and built with privacy at its core.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-center mb-8 drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background/60 backdrop-blur-sm border-primary/30 cyber-chamfer shadow-neon-sm hover:shadow-neon transition-all duration-300">
              <CardHeader className="pb-2">
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="uppercase tracking-wider">Absolute Anonymity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Senders remain completely untraceable. Only the recipient can view the incoming data streams.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background/60 backdrop-blur-sm border-secondary/30 cyber-chamfer shadow-[0_0_10px_rgba(255,0,255,0.2)] hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300">
              <CardHeader className="pb-2">
                <Zap className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="uppercase tracking-wider">AI Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Utilize our advanced AI algorithms to generate suggested messages and smart replies instantly.</p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-accent/30 cyber-chamfer shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300">
              <CardHeader className="pb-2">
                <Terminal className="w-8 h-8 text-accent mb-2" />
                <CardTitle className="uppercase tracking-wider">Real-Time Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage your incoming communications via a sleek, cyberpunk-inspired command center.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Use Cases & How to Use */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Use Cases */}
          <div className="bg-card/30 p-8 rounded-lg border border-border  ">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <MessageSquare className="text-primary" />
              Primary Use Cases
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▶</span>
                <span><strong>Honest Feedback:</strong> Gather constructive, unbiased opinions from peers or employees.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▶</span>
                <span><strong>Q&A Sessions:</strong> Allow audiences to ask questions freely without stage fright.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▶</span>
                <span><strong>Secret Confessions:</strong> A digital drop-box for thoughts, secrets, and untold stories.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▶</span>
                <span><strong>Social Fun:</strong> Share your link on social media and see what your friends really think.</span>
              </li>
            </ul>
          </div>

          {/* How to Use */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <Lock className="text-secondary" />
              Operational Protocol
            </h3>
            
            <div className="relative pl-8 border-l border-primary/30 space-y-8">
              <div className="relative">
                <div className="absolute -left-[41px] bg-background border border-primary text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-neon-sm">1</div>
                <h4 className="font-bold text-lg text-foreground">Initialize Account</h4>
                <p className="text-muted-foreground text-sm mt-1">Sign up to claim your unique identifier and generate your personal message board.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] bg-background border border-secondary text-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(255,0,255,0.4)]">2</div>
                <h4 className="font-bold text-lg text-foreground">Distribute Link</h4>
                <p className="text-muted-foreground text-sm mt-1">Copy your custom profile link from the dashboard and share it across your networks.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] bg-background border border-accent text-accent w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(0,255,255,0.4)]">3</div>
                <h4 className="font-bold text-lg text-foreground">Receive Data</h4>
                <p className="text-muted-foreground text-sm mt-1">Watch as anonymous messages populate your dashboard in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Setup */}
        <section className="text-center bg-linear-to-b from-primary/10 to-transparent p-12 rounded-xl border border-primary/20 cyber-chamfer relative overflow-hidden">
          <EyeOff className="w-16 h-16 text-primary/50 absolute -top-4 -right-4 rotate-12" />
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">System Setup</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            There is no complex configuration required. Our systems are pre-calibrated for immediate deployment. 
          </p>
          <div className="inline-flex items-center gap-2 bg-black/50 border border-primary/50 px-6 py-3 rounded-md text-primary font-mono text-sm shadow-neon-sm">
            <span className="animate-pulse">_&gt;</span>
            <span>status: ready for new user initialization</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
