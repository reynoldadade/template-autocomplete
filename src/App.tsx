import React from 'react'

import './App.css'
import EditorWrapper from './Components/Editor'

function App() {
  return (
    <div className="App">
      <header className="PageHeader">Rich Text Editor</header>
      <div className="App-main">
        <div className="App-sidebar"></div>
        <EditorWrapper />
      </div>
    </div>
  )
}

export default App
