import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
  getDefaultKeyBinding,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useMemo, useRef, useState } from 'react'
import React from 'react'
import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'
import clsx from 'clsx'
import useStrategies from '../hooks/useStrategies'
import Autocomplete from './Autocomplete'
import AutocompletedEntry from './AutocompleteEntry'
import useEditorStore from '../store'

export default function EditorWrapper() {
  /* refs */
  // expose some refs from the child components
  const autocompleteRef = useRef<{
    handleSelect: (suggestion: string) => void
  } | null>(null)
  // ref for the editor
  const editor = useRef<Editor | null>(null)

  /***  refs end here */

  const { autocompleteStrategy, autocompletedEntryStrategy } = useStrategies()
  const [isSuggestionsShowing, setIsSuggestionShowing] = useState<boolean>(false)
  const { highlightIndex, setHighlightIndex, filteredSuggestions } = useEditorStore()
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(createCompositeDecorator(onChange)),
  )

  // create memo for content state

  const contentState = useMemo(() => editorState.getCurrentContent(), [editorState])

  // autocomplete results showing
  function onSuggestionsShowing(isShowing: boolean) {
    setIsSuggestionShowing(isShowing)
  }
  //  function to focus the editor
  function focusEditor() {
    if (editor.current) {
      editor.current.focus()
    }
  }

  // this is to handle the change event of the editor its cleaner than calling setState directly
  function onChange(editorState: EditorState) {
    setEditorState(editorState)
  }
  // handle keyboard commands
  function handleKeyCommand(command: string) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  function mapKeyToEditorCommand(e: React.KeyboardEvent) {
    if (isSuggestionsShowing) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightIndex((highlightIndex + 1) % filteredSuggestions.length)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()

        setHighlightIndex(
          (highlightIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length,
        )
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        if (highlightIndex >= 0 && highlightIndex < filteredSuggestions.length) {
          e.preventDefault()
          e.stopPropagation()
          const suggestion = filteredSuggestions[highlightIndex]

          autocompleteRef.current?.handleSelect(suggestion)
          return 'handled'
        }
      }
    }
    return getDefaultKeyBinding(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) return // Only handle backspace for single cursor position

    const currentContent = editorState.getCurrentContent()
    const blockKey = selection.getStartKey()
    const block = currentContent.getBlockForKey(blockKey)

    const cursorPosition = selection.getStartOffset()

    if (e.key === 'Backspace') {
      e.preventDefault() // Prevent default character deletion
      const entityKey = block.getEntityAt(cursorPosition - 1)
      if (entityKey) {
        const entity = currentContent.getEntity(entityKey)
        if (entity.getType() === 'AUTOCOMPLETE') {
          // Find the range of the entity
          let entityStart = cursorPosition - 1
          while (entityStart > 0 && block.getEntityAt(entityStart - 1) === entityKey) {
            entityStart--
          }
          const newContentState = Modifier.replaceText(
            currentContent,
            SelectionState.createEmpty(blockKey).merge({
              anchorOffset: entityStart, // Start of entity
              focusOffset: cursorPosition, // End of entity
            }),
            '',
          )

          // reset decorator after deletion
          let newEditorState = EditorState.push(
            EditorState.createWithContent(newContentState),
            newContentState,
            'remove-range',
          )

          // reset strategy after deletion

          newEditorState = EditorState.set(newEditorState, {
            decorator: createCompositeDecorator(onChange),
          })

          onChange(newEditorState)
        }
      }
    }
  }

  const replaceText = (
    contentState: ContentState,
    blockKey: string,
    start: number,
    newText: string,
    onEditorStateChange: (editorState: EditorState) => void,
  ) => {
    // is replace function running
    const block = contentState.getBlockForKey(blockKey)
    const text = block.getText()
    //  Create an entity for AUTOCOMPLETE styling
    const contentStateWithEntity = contentState.createEntity('AUTOCOMPLETE', 'MUTABLE')
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    // Replace "<>match_string" with "selected_text"
    const newContentState = Modifier.replaceText(
      contentState,
      SelectionState.createEmpty(blockKey).merge({
        anchorOffset: start,
        focusOffset: start + text.length,
      }),
      `${newText}`,
      undefined,
      entityKey,
    )

    let newEditorState = EditorState.push(
      EditorState.createWithContent(newContentState),
      newContentState,
      'insert-characters',
    )

    newEditorState = EditorState.set(newEditorState, {
      decorator: createCompositeDecorator(onEditorStateChange),
    })

    //  Reset selection position to ensure cursor is placed correctly
    const selectionState = newEditorState.getSelection()
    const updatedSelection = selectionState.merge({
      anchorOffset: start + newText.length, // Place cursor after inserted tag
      focusOffset: start + newText.length,
    })

    newEditorState = EditorState.forceSelection(newEditorState, updatedSelection)

    onEditorStateChange(newEditorState)
  }

  function getBlockStyle(block: Draft.ContentBlock) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote'
      default:
        return ''
    }
  }

  // createCompositeDecorator
  function createCompositeDecorator(onEditorStateChange: (editorState: EditorState) => void) {
    return new CompositeDecorator([
      {
        strategy: autocompleteStrategy,
        component: (props) => (
          <Autocomplete
            {...props}
            onEditorStateChange={onEditorStateChange}
            onSuggestionsShowing={onSuggestionsShowing}
            replaceText={replaceText}
            ref={autocompleteRef}
          />
        ),
      },
      { strategy: autocompletedEntryStrategy, component: AutocompletedEntry },
    ])
  }

  return (
    <div
      className="RichEditor-root"
      onKeyDown={handleKeyDown}
    >
      <div className="RichEditor-toolBar">
        <div className="RichEditor-controlWrapper">
          <BlockStyleControls
            editorState={editorState}
            onChange={onChange}
          />

          <InlineStyleControls
            editorState={editorState}
            onChange={onChange}
          />
        </div>
      </div>
      <div
        onClick={focusEditor}
        className={clsx(
          'RichEditor-editor',
          !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled'
            ? 'RichEditor-hidePlaceholder'
            : '',
        )}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Start creating!"
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          blockStyleFn={getBlockStyle}
        />
      </div>
    </div>
  )
}
