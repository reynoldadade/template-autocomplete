import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

interface EditorStore {
  suggestions: string[]
  highlightIndex: number
  showSuggestions: boolean
  setSuggestions: (newSuggestions: string[]) => void
  setHighlightIndex: (index: number) => void
  setShowSuggestions: (show: boolean) => void
}

const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (set) => ({
        suggestions: [],
        highlightIndex: -1,
        showSuggestions: false,
        setSuggestions: (newSuggestions) => set({ suggestions: newSuggestions }),
        setHighlightIndex: (index) => set({ highlightIndex: index }),
        setShowSuggestions: (show) => set({ showSuggestions: show }),
      }),
      {
        name: 'note-storage',
      },
    ),
  ),
)

export default useEditorStore
