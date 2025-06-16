'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const technologies = [
  {
    name: 'Langchain',
    description: 'Orchestrates the entire RAG pipeline with powerful chain-of-thought reasoning',
    features: ['Document Loading', 'Text Splitting', 'Chain Management', 'Memory Integration'],
    color: 'from-green-500 to-green-600',
    logo: '🦜'
  },
  {
    name: 'Pinecone',
    description: 'High-performance vector database for lightning-fast similarity search',
    features: ['Vector Storage', 'Semantic Search', 'Real-time Updates', 'Scalable Infrastructure'],
    color: 'from-blue-500 to-blue-600',
    logo: '🌲'
  },
  {
    name: 'Gemini API',
    description: 'Google\'s advanced AI model for intelligent text generation and reasoning',
    features: ['Advanced Reasoning', 'Context Understanding', 'Multi-modal Support', 'High Accuracy'],
    color: 'from-purple-500 to-purple-600',
    logo: '✨'
  },
  {
    name: 'Cohere',
    description: 'State-of-the-art embedding model for understanding document semantics',
    features: ['Text Embeddings', 'Semantic Understanding', 'Multilingual Support', 'Fine-tuned Models'],
    color: 'from-orange-500 to-orange-600',
    logo: '🧠'
  }
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powered by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cutting-Edge Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We leverage the best AI tools and frameworks to deliver unparalleled document intelligence
          </p>
        </motion.div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {tech.logo}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{tech.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{tech.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {tech.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="secondary" 
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How Our Tech Stack Works Together
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🦜
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Langchain</h4>
              <p className="text-sm text-gray-600">Orchestrates the entire RAG pipeline</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🧠
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cohere</h4>
              <p className="text-sm text-gray-600">Converts text to semantic embeddings</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🌲
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pinecone</h4>
              <p className="text-sm text-gray-600">Stores and searches vector embeddings</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ✨
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Gemini API</h4>
              <p className="text-sm text-gray-600">Generates intelligent responses</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              This powerful combination ensures your documents are processed with the highest accuracy, 
              stored efficiently, and queried with lightning speed to deliver the most relevant answers.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}