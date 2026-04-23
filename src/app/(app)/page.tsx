"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/message.json";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 min-h-screen relative z-10 cyber-grid">
        <section className="text-center mb-12 md:mb-16 space-y-6 max-w-4xl">
          <div className="inline-block cyber-chamfer-sm border border-accent bg-background/80 px-4 py-1.5 mb-6 font-mono text-xs font-bold text-accent uppercase tracking-widest shadow-neon transition-colors cursor-default hover:bg-accent hover:text-background">
            <span className="mr-2">{">"}</span>
            System Initiated: Quite App
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-widest text-foreground mb-4 cyber-glitch text-shadow-neon" data-text="DIVE INTO THE WORLD OF ANONYMOUS FEEDBACK">
            Dive into the World of <br className="hidden md:block"/> Anonymous Feedback
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl font-mono text-muted-foreground uppercase tracking-wider">
            <span className="text-secondary mr-2">{">"}</span>
            Quite App - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl relative"
        >
          <CarouselContent>
            {messages.map((message, idx) => (
              <CarouselItem key={idx}>
                <div className="p-1">
                  <Card className="hover:shadow-neon transition-all duration-300" variant="holographic">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-accent/20">
                      <h3 className="font-heading font-bold uppercase text-lg text-accent tracking-wide">{message.title}</h3>
                      <Mail className="w-5 h-5 text-accent" />
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col items-start">
                      <p className="text-foreground text-lg mb-6 font-mono text-left w-full">
                        "{message.content}"
                      </p>
                      <p className="text-xs text-secondary text-right w-full font-mono uppercase tracking-widest">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="cyber-chamfer-sm border-accent text-accent bg-background hover:bg-accent hover:text-background shadow-neon-sm -left-3 md:-left-12 h-8 w-8 md:h-10 md:w-10 rounded-none" />
          <CarouselNext className="cyber-chamfer-sm border-accent text-accent bg-background hover:bg-accent hover:text-background shadow-neon-sm -right-3 md:-right-12 h-8 w-8 md:h-10 md:w-10 rounded-none" />
        </Carousel>
      </main>

      <footer className="text-center p-6 border-t border-border bg-background/50 font-mono text-muted-foreground text-xs uppercase tracking-widest relative z-10">
        © 2026 QUITE_APP_NET // ALL_RIGHTS_RESERVED
      </footer>
    </>
  );
}
