/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styles from './Autocomplete.module.css'
import clsx from 'clsx'
import useEditorStore from '../store'
import fetchDataMuseWords, { MuseWord } from '../service/api'
import debounce from 'lodash/debounce'

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
  replaceText: (
    contentState: Draft.ContentState,
    blockKey: string,
    start: number,
    newText: string,
    onEditorStateChange: (editorState: Draft.EditorState) => void,
    onSuggestionsShowing: (isShowing: boolean) => void,
  ) => void
}
const Autocomplete = forwardRef(
  (
    {
      children,
      decoratedText,
      contentState,
      blockKey,
      start,
      onEditorStateChange,
      onSuggestionsShowing,
      replaceText,
    }: AutocompleteProps,
    ref,
  ) => {
    // use zustand store to get the suggestions
    const {
      highlightIndex,
      setHighlightIndex,
      SUGGESTIONS,
      setFilteredSuggestions,
      filteredSuggestions,
    } = useEditorStore()

    // we need to be able to trigger an open and close for the autocomplete dropdown outside the component even if suggestion exists
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
    // const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
    const matchString = decoratedText.replace('<>', '')

    const debouncedAutoCompleteSuggestions = useCallback(
      debounce(getAutocompleteSuggestions, 500),
      [],
    )

    // need a function to filter the suggestions
    // this will run everytime matchstring changes
    useEffect(() => {
      if (matchString.length > 0) {
        debouncedAutoCompleteSuggestions(matchString)
        setHighlightIndex(0)
      }
    }, [matchString, SUGGESTIONS, setFilteredSuggestions, setHighlightIndex])

    async function getAutocompleteSuggestions(matchString: string) {
      try {
        const response = await fetchDataMuseWords(matchString)
        const data = response.data
        console.log('data', data)
        const words = data.map((item: MuseWord) => item.word)
        setFilteredSuggestions(words.length > 0 ? words : [matchString])
      } catch (error) {
        console.log('error', error)
      }
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        // we are using this to close the suggestion box when clicked outside
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowSuggestions(false)
          setFilteredSuggestions([])
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // cleanup
        document.removeEventListener('mousedown', handleClickOutside)
        setFilteredSuggestions([])
      }
    }, [setFilteredSuggestions])
    //
    useEffect(() => {
      onSuggestionsShowing(showSuggestions && filteredSuggestions.length > 0)

      return () => {
        onSuggestionsShowing(false)
      }
    }, [showSuggestions, filteredSuggestions, onSuggestionsShowing])

    //expose these functions to the parent component
    useImperativeHandle(ref, () => ({
      handleSelect: handleSelect,
    }))
    // function to trigger when a suggestion is selected
    const handleSelect = (suggestion: string) => {
      console.log('suggestion', suggestion)
      if (!contentState || !blockKey) return // in case it does not exist
      // we need to put a replacement function here before setting the editor state
      replaceText(
        contentState,
        blockKey,
        start,
        suggestion,
        onEditorStateChange,
        onSuggestionsShowing,
      )
      console.log('after replacetext')

      // setShowSuggestions(false)
      // setFilteredSuggestions([])
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
  },
)

export default Autocomplete
