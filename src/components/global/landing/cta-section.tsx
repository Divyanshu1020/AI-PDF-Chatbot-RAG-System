'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Users, Clock, Shield } from 'lucide-react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const stats = [
  {
    icon: FileText,
    value: '10K+',
    label: 'Documents Processed'
  },
  {
    icon: Users,
    value: '2K+',
    label: 'Active Users'
  },
  {
    icon: Clock,
    value: '< 2s',
    label: 'Average Response Time'
  },
  {
    icon: Shield,
    value: '99.9%',
    label: 'Uptime Guarantee'
  }
];

export function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm md:text-base text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <br />
            <span className="text-yellow-300">Document Experience?</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who are already chatting with their documents. 
            Upload your first PDF and experience the future of document intelligence.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {isSignedIn ? (
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold" 
                asChild
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 font-semibold" 
                  asChild
                >
                  <Link href="#how-it-works">
                    See Demo
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Free tier available</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}