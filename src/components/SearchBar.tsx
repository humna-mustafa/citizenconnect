'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const defaultSuggestions = [
  'How to Get CNIC',
  'Passport Application',
  'Electricity Bill Complaint',
  'Driving License',
  'Birth Certificate',
]

export default function SearchBar({ 
  placeholder = 'Search guides, issues, or categories...', 
  className = '',
  size = 'md'
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        const { data } = await supabase
          .from('guides')
          .select('title')
          .ilike('title', `%${query}%`)
          .eq('is_published', true)
          .limit(5)
        
        if (data && data.length > 0) {
          setFilteredSuggestions(data.map(g => g.title))
        } else {
          setFilteredSuggestions([])
        }
      } else {
        setFilteredSuggestions(defaultSuggestions)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/guides?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
    }
  }

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-5 text-base',
    lg: 'py-4 px-6 text-lg'
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} pl-12 pr-4 bg-background text-black border-2 border-input rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all ${size === 'lg' ? 'shadow-xl' : 'shadow-md'}`}
        />
        <button
          type="button"
          aria-label="Search guides"
          onClick={() => handleSearch(query)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all ${
            size === 'lg' ? 'px-6 py-2.5' : 'px-4 py-2 text-sm'
          }`}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-xl shadow-2xl border border-border overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2">
          <div className="p-2">
            {query.length === 0 && (
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Popular Searches</p>
            )}
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  // Immediately navigate to guides with the selected suggestion
                  setQuery(suggestion)
                  handleSearch(suggestion)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
