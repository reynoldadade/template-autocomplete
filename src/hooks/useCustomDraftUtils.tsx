import { ContentBlock, ContentState, EditorState, Modifier, SelectionState } from 'draft-js'

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

    onEditorStateChange(
      EditorState.push(
        EditorState.createWithContent(newContentState),
        newContentState,
        'insert-characters',
      ),
    )
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

  return {
    replaceText,
  }
}
