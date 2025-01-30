import React, { useEffect, useRef, useState } from 'react'
import styles from './AutoComplete.module.css'
import { useCustomDraftUtils } from '../hooks/useCustomDraftUtils'

interface AutocompleteProps {
  children: React.ReactNode
  /**
   * this is the text from the editor, the value that follows the tag
   */
  decoratedText: string
  contentState: Draft.ContentState
  blockKey: string
  start: number
  newText: string
  onEditorStateChange: (editorState: Draft.EditorState) => void
}

// Hardcoded suggestions for autocomplete
const SUGGESTIONS = ['Tag1', 'Tag2', 'Tag3', 'TestValue', 'ExampleItem']
export default function Autocomplete({
  children,
  decoratedText,
  contentState,
  blockKey,
  start,
  newText,
  onEditorStateChange,
}: AutocompleteProps) {
  const { replaceText } = useCustomDraftUtils()
  // need to save the filtered suggestions somewhere
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  //   to show and hide the suggestions
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  // we need to be able to trigger an open and close for the autocomplete dropdown outside the component even if suggestion exists
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const matchString = decoratedText.replace('<>', '')

  // need a function to filter the suggestions
  // this will run everytime matchstring changes
  useEffect(() => {
    if (matchString.length > 0) {
      const filtered = SUGGESTIONS.filter((s) => s.startsWith(matchString))
      setFilteredSuggestions(filtered)
    }
  }, [matchString])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // we are using this to close the suggestion box when clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // function to trigger when a suggestion is selected
  const handleSelect = (suggestion: string) => {
    // we need to put a replacement function here before setting the editor state
    replaceText(contentState, blockKey, start, suggestion, onEditorStateChange)
    setShowSuggestions(false)
  }

  return (
    <span className={styles.autocomplete}>
      {children}
      {/* show suggestions conditionally */}
      {filteredSuggestions.length > 0 && showSuggestions && (
        <div
          className={styles.dropDown}
          ref={dropdownRef}
        >
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className={styles.dropDownItem}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </span>
  )
}
