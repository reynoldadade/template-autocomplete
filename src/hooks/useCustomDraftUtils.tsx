import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js'

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

  return {
    replaceText,
  }
}
