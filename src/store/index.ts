import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing

interface EditorStore {
  highlightIndex: number
  setHighlightIndex: (index: number) => void
  SUGGESTIONS: string[]
  filteredSuggestions: string[]
  setFilteredSuggestions: (suggestions: string[]) => void
}

const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (set) => ({
        highlightIndex: -1,
        SUGGESTIONS: [
          'Apple',
          'Apricot',
          'Avocado',
          'Almond',
          'Anchovy',
          'Aspen',
          'Arrow',
          'Astronaut',
          'Ambition',
          'Adventure',
          'Analysis',
          'Allegory',
          'Antique',
          'Automobile',
          'Anagram',
          'Abundant',
          'Adept',
          'Amicable',
          'Astonish',
          'Artistic',
          'Aromatherapy',
          'Accordion',
          'Amphibian',
          'Asparagus',
          'Azalea',
          'Axiom',
          'Alchemy',
          'Aneurysm',
          'Aquatic',
          'Archaic',
          'Assortment',
          'Atmosphere',
          'Aviator',
        ],
        setHighlightIndex: (index) => set({ highlightIndex: index }),
        filteredSuggestions: [],
        setFilteredSuggestions: (suggestions) => set({ filteredSuggestions: suggestions }),
      }),
      {
        name: 'note-storage',
      },
    ),
  ),
)

export default useEditorStore
