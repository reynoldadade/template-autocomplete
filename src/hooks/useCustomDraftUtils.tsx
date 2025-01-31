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
    const regex = /<[^<>]+>/g // Matches already completed entries like <Tag1>
    let matchArr
    while ((matchArr = regex.exec(text)) !== null) {
      callback(matchArr.index, matchArr.index + matchArr[0].length)
    }
  }

  return {
    autocompleteStrategy,
    autocompletedEntryStrategy,
  }
}
