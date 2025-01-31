import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js'
import Autocomplete from '../Components/Autocomplete'
import AutocompletedEntry from '../Components/AutocompleteEntry'
import React from 'react'

export const useCustomDraftUtils = () => {
  const replaceText = (
    contentState: ContentState,
    blockKey: string,
    start: number,
    newText: string,
    onEditorStateChange: (editorState: EditorState) => void,
  ) => {
    const block = contentState.getBlockForKey(blockKey)
    const text = block.getText()

    // Replace "<>match_string" with "<selected_text>"
    const newContentState = Modifier.replaceText(
      contentState,
      SelectionState.createEmpty(blockKey).merge({
        anchorOffset: start,
        focusOffset: start + text.length,
      }),
      `<${newText}>`,
    )

    let newEditorState = EditorState.push(
      EditorState.createWithContent(newContentState),
      newContentState,
      'insert-characters',
    )

    newEditorState = EditorState.set(newEditorState, {
      decorator: new CompositeDecorator([
        {
          strategy: autocompleteStrategy,
          component: (props) => (
            <Autocomplete
              {...props}
              onEditorStateChange={onEditorStateChange}
            />
          ),
        },
        { strategy: autocompletedEntryStrategy, component: AutocompletedEntry },
      ]),
    })

    //  Reset selection position to ensure cursor is placed correctly
    const selectionState = newEditorState.getSelection()
    const updatedSelection = selectionState.merge({
      anchorOffset: start + newText.length + 1, // Place cursor after inserted tag
      focusOffset: start + newText.length + 1,
    })

    newEditorState = EditorState.forceSelection(newEditorState, updatedSelection)

    onEditorStateChange(newEditorState)
  }

  // Autocomplete Strategy - detects "<>match_string" without "\n"
  const autocompleteStrategy = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
  ) => {
    const text = contentBlock.getText()
    const regex = /<>([^\n]*)$/g // Matches <> followed by a non-newline substring
    let matchArr

    while ((matchArr = regex.exec(text)) !== null) {
      const start = matchArr.index
      const end = start + matchArr[0].length
      callback(start, end)
    }
  }

  // Strategy for detecting autocompleted entries
  const autocompletedEntryStrategy = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
  ) => {
    const text = contentBlock.getText()
    const regex = /<[^<>]+>/g // Matches already completed entries like <Tag1>
    let matchArr
    while ((matchArr = regex.exec(text)) !== null) {
      callback(matchArr.index, matchArr.index + matchArr[0].length)
    }
  }

  return {
    replaceText,
    autocompleteStrategy,
    autocompletedEntryStrategy,
  }
}
