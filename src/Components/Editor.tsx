import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useRef, useState } from 'react'
import React from 'react'
import styles from './Editor.module.css'

export default function EditorWrapper() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const editor = useRef<Editor | null>(null)
  function focusEditor() {
    if (editor.current) {
      editor.current.focus()
    }
  }

  return (
    <div className={styles.editor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
      />
    </div>
  )
}
