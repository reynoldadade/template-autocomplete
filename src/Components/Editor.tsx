import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useRef, useState } from 'react'
import React from 'react'

import BlockStyleControls from './BlockStyleControls'
import InlineStyleControl from './InlineStyleControls'
import InlineStyleControls from './InlineStyleControls'

export default function EditorWrapper() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const editor = useRef<Editor | null>(null)
  function focusEditor() {
    if (editor.current) {
      editor.current.focus()
    }
  }
  // this function is called when a block style button is clicked
  function toggleBlockType(blockType: Draft.DraftModel.Constants.DraftBlockType) {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }
  // this is to handle the change event of the editor its cleaner than calling setState directly
  function onChange(editorState: EditorState) {
    setEditorState(editorState)
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />

      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
      />
    </div>
  )
}
