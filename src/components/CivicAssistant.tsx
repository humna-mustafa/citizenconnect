'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function CivicAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your CitizenConnect AI Assistant. How can I help you today? You can ask me about passport renewal, blood donation, or how to report local issues.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const response = generateResponse(userMessage.content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('passport')) {
      return "To renew your passport, you can visit the nearest Passport Office. You'll need your original CNIC and old passport. You can also apply online via the DGIP website for renewal if your passport is expired."
    }
    if (lowerQuery.includes('cnic') || lowerQuery.includes('nadra')) {
      return "For CNIC services, visit any NADRA Mega Center. For renewal, bring your old CNIC. For new applications, you'll need a birth certificate and a parent's CNIC."
    }
    if (lowerQuery.includes('blood') || lowerQuery.includes('donor')) {
      return "You can find blood donors in the 'Blood Bank' section of our app. You can filter by city and blood group to find available donors near you."
    }
    if (lowerQuery.includes('report') || lowerQuery.includes('issue') || lowerQuery.includes('pothole')) {
      return "To report a local issue like a pothole or garbage, go to the 'Report Issue' section (coming soon with map integration!). You can upload a photo and location."
    }
    if (lowerQuery.includes('donate') || lowerQuery.includes('money')) {
      return "You can donate to verified causes in the 'Donations' section. We support medical, educational, and relief campaigns."
    }
    
    return "I'm not sure about that specific detail yet, but I'm learning! You can try searching in the 'Guides' section for more detailed step-by-step procedures."
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={classNames(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl text-white transition-all duration-300",
          isOpen ? "scale-0 opacity-0" : "bg-gradient-to-r from-emerald-600 to-teal-600 scale-100 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Civic Assistant</h3>
                  <p className="text-emerald-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={classNames(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={classNames(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={classNames(
                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-emerald-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.content}
                    <div className={classNames(
                      "text-[10px] mt-1 opacity-70",
                      msg.role === 'user' ? "text-emerald-100" : "text-slate-400"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 max-w-[85%]"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-600/20"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
