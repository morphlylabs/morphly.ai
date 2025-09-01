'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Cuboid, Sparkles, Play } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';
import Link from 'next/link';
import BackgroundGradient from '@/components/background-gradient';

export default function GradientHero() {
  return (
    <div className="bg-background relative w-full overflow-hidden">
      <BackgroundGradient />

      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-border bg-background/80 inline-flex items-center rounded-full border px-2 py-1 text-sm backdrop-blur-sm">
              <span className="bg-primary mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                AI-Powered
              </span>
              <span className="text-muted-foreground">
                First conversational CAD platform
              </span>
              <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="from-primary/10 via-foreground/85 to-foreground/50 text-balance bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Chat Your Way to <br /> Perfect CAD Models
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg"
          >
            The first AI CAD platform where you can actually chat with your
            models. Create parametric CAD files from text, then refine them
            through natural conversation. No complex software needed—just
            describe, chat, and iterate until your design is perfect.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="https://app.morphly.ai" prefetch={true}>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:shadow-primary/30 group relative overflow-hidden rounded-full px-6 shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Create Your First Model
                  <Sparkles className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="from-primary via-primary/90 to-primary/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="border-border bg-background/50 flex items-center gap-2 rounded-full backdrop-blur-sm"
            >
              <Play className="h-4 w-4" />
              View Examples
            </Button>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: 'spring',
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="border-border/40 bg-background/50 overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm">
              <div className="border-border/40 bg-muted/50 flex h-10 items-center border-b px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-background/50 text-muted-foreground mx-auto flex items-center rounded-md px-3 py-1 text-xs">
                  app.morphly.ai
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/hero.webp"
                  alt="Text-to-CAD Interface Preview"
                  className="w-full"
                  priority
                  width={1000}
                  height={1000}
                />
                <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent opacity-0"></div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="border-border/40 bg-background/80 absolute -right-6 -top-6 h-12 w-12 rounded-lg border p-3 shadow-lg backdrop-blur-md">
              <Cuboid className="text-primary/60 h-full w-full" />
            </div>
            <div className="border-border/40 bg-background/80 absolute -bottom-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-blue-500/60" />
            </div>
            <div className="border-border/40 bg-background/80 absolute -bottom-6 right-12 h-10 w-10 rounded-lg border p-2 shadow-lg backdrop-blur-md">
              <div className="h-full w-full rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
