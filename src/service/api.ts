import axios from 'axios'

export interface MuseWord {
  word: string
  score: number
}

export default function fetchDataMuseWords(word: string) {
  return axios.get<MuseWord[]>('https://api.datamuse.com/sug', {
    params: {
      s: word,
    },
  })
}
