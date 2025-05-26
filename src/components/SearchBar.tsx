"use client";
import React, { useState, useRef, ChangeEvent, FocusEvent } from 'react'
import { CiSearch } from 'react-icons/ci'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search Posts...", onSearch }) => {
  const [input, setInput] = useState<string>("")
  const [active, setActive] = useState<boolean>(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setActive(Boolean(value.trim()))

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value.trim())
      } else {
        onSearch("")
        setActive(false)
      }
    }, 300)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setActive(false)
  }

  return (
    <div>
      <div className="flex items-center w-full p-4 bg-background rounded-2xl">
        <CiSearch className="text-gray-800 text-xl" />
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          onBlur={handleBlur}
          className="ml-3 w-full text-gray-800 placeholder:text-gray-800 outline-none text-sm md:text-base"
        />
    </div>
    </div>
  )
}

export default SearchBar
