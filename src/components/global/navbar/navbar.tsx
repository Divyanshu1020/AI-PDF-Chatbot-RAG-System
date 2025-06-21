"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={` fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? " backdrop-blur-md shadow-lg border-b border-white/20"
          : "bg-transparent border-b"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  items-center h-16 gap-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            // whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center cursor-pointer ">
              <span className="text-xl font-bold">Doc<span className="text-primary">Chat</span>{" "}AI</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-primary"
            >
              How it Works
            </Link>
            <Link
              href="#tech-stack"
              className="transition-colors hover:text-primary"
            >
              Technology
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" asChild>
                      <a
                        href="https://github.com/Divyanshu1020/AI-PDF-Chatbot-RAG-System"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github />
                      </a>
                    </Button>
                    <ModeToggle />

                    {!pathname.startsWith("/dashboard") && (
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" asChild>
                      <a
                        href="https://github.com/Divyanshu1020/AI-PDF-Chatbot-RAG-System"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github />
                      </a>
                    </Button>
                    <ModeToggle />
                    <SignInButton mode="modal">
                      <Button variant="ghost">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="">Sign Up</Button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>



          {/* Mobile menu button with Sheet */}
          <div className="md:hidden ml-auto">
          <ModeToggle />       
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 pb-2 text-left">
                  <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 p-6 pt-2">
                  <SheetClose asChild>
                    <Link
                      href="#features"
                      className="text-foreground hover:text-primary transition-colors py-2 text-sm font-medium"
                    >
                      Features
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="#how-it-works"
                      className="text-foreground hover:text-primary transition-colors py-2 text-sm font-medium"
                    >
                      How it Works
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="#tech-stack"
                      className="text-foreground hover:text-primary transition-colors py-2 text-sm font-medium"
                    >
                      Technology
                    </Link>
                  </SheetClose>

                  {isLoaded && (
                    <div className="border-t border-border pt-4 mt-4">
                      {isSignedIn ? (
                        <div className="flex flex-col space-y-4">
                        
                          <a href="https://github.com/Divyanshu1020/AI-PDF-Chatbot-RAG-System" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
                            <span className="text-sm font-medium">Github</span>
                            <Github />
                          </a>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Account</span>
                            <UserButton afterSignOutUrl="/" />
                          </div>

                          {!pathname.startsWith("/dashboard") && <Button variant="outline" asChild className="w-full mt-auto">
                            <Link href="/dashboard">Dashboard</Link>
                          </Button>}


                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          <SignInButton mode="modal">
                            <Button variant="outline" className="w-full bg-muted">
                              Sign In
                            </Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button className="w-full ">
                              Sign Up
                            </Button>
                          </SignUpButton>
                        </div>
                      )}
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
