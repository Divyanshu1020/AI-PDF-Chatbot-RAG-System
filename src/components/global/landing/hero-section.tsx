'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative max-w-8xl h-[100vh] mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center justify-center">
    

      <div className="max-w-8xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-muted mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">
              Powered by Advanced AI Technology
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold  mb-6"
          >
            Chat with Your PDF Documents
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Upload your PDF files and have intelligent conversations with an AI assistant 
            that understands your content. Get instant answers, summaries, and insights 
            from your documents.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {isSignedIn ? (
              <Button size="lg" className=" text-lg px-8 py-4" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className=" text-lg px-8 py-4">
                  Try with Your PDF
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
            )}
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </motion.div>


        </div>
      </div>
    </section>
  );
}