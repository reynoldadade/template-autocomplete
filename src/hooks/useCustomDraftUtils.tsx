import { ContentBlock } from 'draft-js'

export const useCustomDraftUtils = () => {
  // expose some refs from the child components

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

    // Match words (without including <>)
    const regex = /\b[A-Za-z0-9_]+\b/g
    let matchArr

    while ((matchArr = regex.exec(text)) !== null) {
      const start = matchArr.index
      const end = start + matchArr[0].length

      // Check if the word has the AUTOCOMPLETE inline style
      const hasAutocompleteStyle = contentBlock
        .getInlineStyleAt(start) // Get inline styles at word start
        .has('AUTOCOMPLETE') // Check if AUTOCOMPLETE exists

      if (hasAutocompleteStyle) {
        callback(start, end) // ✅ Highlight only if style is applied
      }
    }
  }

  return {
    autocompleteStrategy,
    autocompletedEntryStrategy,
  }
}
