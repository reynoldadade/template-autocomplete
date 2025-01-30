import {
  CompositeDecorator,
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
import { useCustomDraftUtils } from '../hooks/useCustomDraftUtils'
import Autocomplete from './Autocomplete'
import AutocompletedEntry from './AutocompleteEntry'

export default function EditorWrapper() {
  const { autocompleteStrategy, autocompletedEntryStrategy } = useCustomDraftUtils()
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(
      new CompositeDecorator([
        {
          strategy: autocompleteStrategy,
          component: (props) => (
            <Autocomplete
              {...props}
              onEditorStateChange={onChange}
            />
          ),
        },
        { strategy: autocompletedEntryStrategy, component: AutocompletedEntry },
      ]),
    ),
  )
  const editor = useRef<Editor | null>(null)

  // create memo for content state

  const contentState = useMemo(() => editorState.getCurrentContent(), [editorState])

  function focusEditor() {
    if (editor.current) {
      editor.current.focus()
    }
  }
  // this function is called when a block style button is clicked
  function toggleBlockType(blockType: Draft.DraftModel.Constants.DraftBlockType) {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }
  // this function is called when an inline style button is clicked
  function toggleInlineStyle(inlineStyle: string) {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
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
    // if (e.key === 'Tab') {
    //   const newEditorState = RichUtils.onTab(e, editorState, 4)
    //   if (newEditorState !== editorState) {
    //     onChange(newEditorState)
    //   }
    //   return null
    // }
    return getDefaultKeyBinding(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) return // Only handle backspace for single cursor position

    const currentContent = editorState.getCurrentContent()
    const blockKey = selection.getStartKey()
    const block = currentContent.getBlockForKey(blockKey)
    const text = block.getText()
    const cursorPosition = selection.getStartOffset()

    // Check if Backspace is pressed at the end of an autocompleted entry
    const match = text.slice(0, cursorPosition).match(/<([^<>]+)>$/)
    if (e.key === 'Backspace' && match) {
      e.preventDefault() // Prevent default character deletion

      // Delete the entire <Tag> entry
      const newContentState = Modifier.replaceText(
        currentContent,
        SelectionState.createEmpty(blockKey).merge({
          anchorOffset: cursorPosition - match[0].length, // Start of the match
          focusOffset: cursorPosition, // End of the match
        }),
        '',
      )

      // Update the editor state
      onChange(
        EditorState.push(
          EditorState.createWithContent(newContentState),
          newContentState,
          'remove-range',
        ),
      )
    }
  }

  function getBlockStyle(block: Draft.ContentBlock) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote'
      default:
        return ''
    }
  }

  return (
    <div
      className="RichEditor-root"
      onKeyDown={handleKeyDown}
    >
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />

      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
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
          placeholder="Write something!"
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          blockStyleFn={getBlockStyle}
        />
      </div>
    </div>
  )
}
