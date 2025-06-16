'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion' ;
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RAG AI
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How it Works
            </Link>
            <Link href="#tech-stack" className="text-gray-700 hover:text-blue-600 transition-colors">
              Technology
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <SignInButton mode="modal">
                      <Button variant="ghost">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link 
                href="#tech-stack" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Technology
              </Link>
              
              {isLoaded && (
                <div className="border-t border-gray-200 pt-4 px-4">
                  {isSignedIn ? (
                    <div className="flex items-center justify-between">
                      <Button variant="outline" asChild className="flex-1 mr-2">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <UserButton />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}