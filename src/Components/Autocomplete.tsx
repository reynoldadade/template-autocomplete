import React, { useState } from 'react'
import styles from './AutoComplete.module.css'

interface AutocompleteProps {
  children: React.ReactNode
}
export default function Autocomplete({ children }: AutocompleteProps) {
  // need to save the filtered suggestions somewhere
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  return (
    <span className={styles.autocomplete}>
      {children}
      {/* show suggestions conditionally */}
      <div className={styles.dropDown}>
        {filteredSuggestions.map((suggestion) => (
          <div
            key={suggestion}
            className={styles.dropDownItem}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </span>
  )
}
