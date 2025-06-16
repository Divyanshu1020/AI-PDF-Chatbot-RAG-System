'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  Database, 
  MessageCircle, 
  ArrowDown,
  CheckCircle 
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Upload Your PDF',
    description: 'Drag and drop your PDF document or select it from your device. We support files up to 50MB.',
    icon: Upload,
    details: ['Secure file upload', 'Multiple format support', 'Instant processing'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Document Processing',
    description: 'Our AI extracts text, analyzes structure, and breaks down your document into semantic chunks.',
    icon: FileText,
    details: ['Text extraction', 'Layout analysis', 'Content segmentation'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Vector Embedding',
    description: 'Content is converted into high-dimensional vectors using Cohere embeddings for semantic search.',
    icon: Database,
    details: ['Cohere embeddings', 'Pinecone storage', 'Semantic indexing'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    title: 'Intelligent Chat',
    description: 'Ask questions in natural language and get accurate answers based on your document content.',
    icon: MessageCircle,
    details: ['Natural language queries', 'Context-aware responses', 'Gemini AI generation'],
    color: 'from-orange-500 to-orange-600'
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            How It 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our advanced RAG system processes your documents through a sophisticated 
            pipeline to enable intelligent conversations.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 transform -translate-x-1/2"></div>

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-bold text-lg mb-4">
                      {step.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-center lg:justify-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="w-80 h-80 border-0 shadow-xl overflow-hidden">
                      <CardContent className="p-0 h-full">
                        <div className={`h-full bg-gradient-to-br ${step.color} flex items-center justify-center relative overflow-hidden`}>
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                          </div>
                          
                          {/* Icon */}
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                          >
                            <step.icon className="h-24 w-24 text-white" />
                          </motion.div>

                          {/* Floating elements */}
                          <motion.div
                            animate={{ 
                              y: [0, -10, 0],
                              rotate: [0, 5, 0]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"
                          />
                          <motion.div
                            animate={{ 
                              y: [0, 15, 0],
                              rotate: [0, -8, 0]
                            }}
                            transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: 1
                            }}
                            className="absolute bottom-12 left-8 w-6 h-6 bg-white/15 rounded-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Document Experience?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of users who are already having intelligent conversations with their PDFs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Get Started Now
              <ArrowDown className="ml-2 h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}