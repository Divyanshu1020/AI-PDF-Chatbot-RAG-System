'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Upload, 
  MessageSquare, 
  Brain, 
  Search, 
  FileText, 
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Easy PDF Upload',
    description: 'Simply drag and drop your PDF files. We support documents up to 50MB with instant processing.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI understands your document context and provides intelligent, accurate responses.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description: 'Chat naturally with your documents. Ask questions, request summaries, or explore key concepts.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find specific information instantly with semantic search across your entire document.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: FileText,
    title: 'Multi-Format Support',
    description: 'Works with various PDF types including research papers, reports, manuals, and books.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get responses in seconds with our optimized vector search and generation pipeline.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your documents are encrypted and processed securely. We never store your content.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description: 'Access your document conversations from any device with our responsive web interface.',
    color: 'from-indigo-500 to-indigo-600'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold  mb-4">
            Powerful Features for Document Intelligence
          </h2>
          <p className="md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of document interaction with our advanced AI-powered platform
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full bg-muted backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 " />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-6"
          id='how-it-works'
        >
          <Card className="h-full bg-muted backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="">
            <h3 className="text-2xl font-bold text-center mb-12">
              From Upload to Insights in Seconds
            </h3>
            </CardHeader>
            
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 " />
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">Upload Document</h4>
                <p className="text-muted-foreground">Drop your PDF and watch as we process it instantly</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 " />
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">AI Processing</h4>
                <p className="text-muted-foreground">Advanced AI analyzes and understands your content</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 " />
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">Start Chatting</h4>
                <p className="text-muted-foreground">Ask questions and get intelligent answers instantly</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}