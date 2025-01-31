import React, { useEffect, useRef, useState } from 'react'
import styles from './Autocomplete.module.css'
import { useCustomDraftUtils } from '../hooks/useCustomDraftUtils'
import clsx from 'clsx'

interface AutocompleteProps {
  children: React.ReactNode
  /**
   * this is the text from the editor, the value that follows the tag
   */
  decoratedText: string
  contentState: Draft.ContentState
  blockKey: string
  start: number
  onEditorStateChange: (editorState: Draft.EditorState) => void
  onSuggestionsShowing: (isShowing: boolean) => void
}

// Hardcoded suggestions for autocomplete
const SUGGESTIONS = ['Tag1', 'Tag2', 'Tag3', 'TestValue', 'ExampleItem']
export default function Autocomplete({
  children,
  decoratedText,
  contentState,
  blockKey,
  start,
  onEditorStateChange,
  onSuggestionsShowing,
}: AutocompleteProps) {
  const { replaceText } = useCustomDraftUtils()
  // need to save the filtered suggestions somewhere
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  //   to show and hide the suggestions
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  // we need to be able to trigger an open and close for the autocomplete dropdown outside the component even if suggestion exists
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  // to highlight the suggestion
  const [highlightIndex, setHighlightIndex] = useState<number>(0)

  const matchString = decoratedText.replace('<>', '')

  // need a function to filter the suggestions
  // this will run everytime matchstring changes
  useEffect(() => {
    if (matchString.length > 0) {
      const filtered = SUGGESTIONS.filter((s) =>
        s.toLocaleLowerCase().startsWith(matchString.toLowerCase()),
      )
      setFilteredSuggestions(filtered.length > 0 ? filtered : [matchString])
      setHighlightIndex(0)
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
  //
  useEffect(() => {
    onSuggestionsShowing(showSuggestions && filteredSuggestions.length > 0)

    return () => {
      onSuggestionsShowing(false)
    }
  }, [showSuggestions, filteredSuggestions])

  // function to trigger when a suggestion is selected
  const handleSelect = (suggestion: string) => {
    // we need to put a replacement function here before setting the editor state
    replaceText(
      contentState,
      blockKey,
      start,
      suggestion,
      onEditorStateChange,
      onSuggestionsShowing,
    )
    setShowSuggestions(false)
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    console.log(e.key)
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev + 1) % filteredSuggestions.length)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex(
        (prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length,
      )
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleSelect(filteredSuggestions[highlightIndex])
    }
  }

  return (
    <span
      className={styles.autocomplete}
      onKeyDown={handleKeyDown}
    >
      {children}
      {/* show suggestions conditionally */}
      {filteredSuggestions.length > 0 && showSuggestions && (
        <div
          className={styles.dropDown}
          ref={dropdownRef}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={clsx(
                styles.dropDownItem,
                index === highlightIndex ? styles.highlight : styles.noHighlight,
              )}
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
