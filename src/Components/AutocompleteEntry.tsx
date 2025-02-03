import React from 'react'
import styles from './AutocompleteEntry.module.css'
interface AutocompletedEntryProps {
  children: React.ReactNode
}
// Custom Decorator for rendering non-editable "autocompleted entries"
export default function AutocompletedEntry({ children }: AutocompletedEntryProps) {
  return <span className={styles.entry}>{children}</span>
}
