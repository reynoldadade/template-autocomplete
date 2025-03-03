import { ContentBlock, ContentState } from 'draft-js'

const useStrategies = () => {
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
    contentState: ContentState,
  ) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && contentState.getEntity(entityKey).getType() === 'AUTOCOMPLETE'
    }, callback)
  }

  return {
    autocompleteStrategy,
    autocompletedEntryStrategy,
  }
}

export default useStrategies
