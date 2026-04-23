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
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
        <section className="text-center mb-8 md:mb-12 space-y-6 max-w-4xl">
          <div className="inline-block rounded-full bg-zinc-200 dark:bg-zinc-800 px-3 py-1 mb-4 text-sm font-medium text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700">
            Welcome to Quite App
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 pb-2">
            Dive into the World of <br className="hidden md:block"/> Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
            Quite App - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl shadow-xl rounded-xl"
        >
          <CarouselContent>
            {messages.map((message, idx) => (
              <CarouselItem key={idx}>
                <div className="p-1">
                  <Card className="hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{message.title}</h3>
                      <Mail className="w-5 h-5 text-zinc-500" />
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col items-start">
                      <p className="text-zinc-700 dark:text-zinc-300 text-lg mb-4 font-medium italic text-left w-full">
                        "{message.content}"
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right w-full font-medium">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="flex bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50 -left-3 md:-left-12 h-8 w-8 md:h-10 md:w-10" />
          <CarouselNext className="flex bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50 -right-3 md:-right-12 h-8 w-8 md:h-10 md:w-10" />
        </Carousel>
      </main>

      <footer className="text-center p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-medium tracking-wide">
        © 2026 Quite App. All rights reserved.
      </footer>
    </>
  );
}
