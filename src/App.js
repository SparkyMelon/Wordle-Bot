import React, { useState } from 'react';
import './App.css';
import { validWords } from './utils/wordle_words.js';
import Header from './components/Header.js';
import WordleInput from './components/WordleInput.js';
import WordleOutput from './components/WordleOutput.js';

const WORDLE_LENGTH = 5;
const RESULT_LENGTH = 10;

function findBestWords(correctLetters, lettersInWord, lettersNotInWord) {
  // Remove letter from 'lettersNotInWord' if the letter is in 'lettersInWord' to deal with Wordles way of saying there's only 1 of the letter
  // TODO: This means that there is only 1 of this letter in the word
  for (let i = 0; i < lettersNotInWord.length; i++) {
    if (lettersInWord.includes(lettersNotInWord[i])) {
      lettersNotInWord.splice(i--, 1);
    }
  }

  // Remove words based on input
  // Correct letters
  const validWordsAvailable = [];

  validWordsLoop: for (const word of validWords) {
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      if (correctLetters[i] && correctLetters[i] !== word[i]) {
        continue validWordsLoop;
      }
    }

    validWordsAvailable.push(word);
  }

  // Letters in word
  lettersInWordLoop: for (let i = 0; i < validWordsAvailable.length; i++) {
    for (const letterInWord of lettersInWord) {
      if (!validWordsAvailable[i].includes(letterInWord)) {
        validWordsAvailable.splice(i--, 1);
        continue lettersInWordLoop;
      }
    }
  }

  // Letters not in word
  lettersNotInWordLoop: for (let i = 0; i < validWordsAvailable.length; i++) {
    for (const letterNotInWord of lettersNotInWord) {
      if (validWordsAvailable[i].includes(letterNotInWord)) {
        validWordsAvailable.splice(i--, 1);
        continue lettersNotInWordLoop;
      }
    }
  }

  // Create a map to store letter counts in different positions
  const letterCounts = new Map();
  for (let i = 0; i < WORDLE_LENGTH; i++) {
    letterCounts.set(i, new Map());
  }console.log(letterCounts);

  // Count letter occurrences in each position
  for (const word of validWordsAvailable) {
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      const letter = word[i];
      const positionMap = letterCounts.get(i);
      positionMap.set(letter, (positionMap.get(letter) || 0) + 1);
    }
  }

  // Define a function to score a word based on letter counts
  function scoreWord(word) {
    let score = 0;
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      const letter = word[i];
      const positionMap = letterCounts.get(i);
      score += positionMap.get(letter) || 0;
    }
    return score;
  }

  // Define a custom priority queue class for efficient top-k retrieval
  class PriorityQueue {
    constructor(comparator) {
      this.items = [];
      this.comparator = comparator;
    }

    enqueue(item) {
      this.items.push(item);
      this.heapifyUp();
    }

    dequeue() {
      const item = this.items.shift();
      this.heapifyDown();
      return item;
    }

    peek() {
      return this.items[0];
    }

    isEmpty() {
      return this.items.length === 0;
    }

    heapifyUp() {
      let currentIndex = this.items.length - 1;
      while (currentIndex > 0) {
        const parentIndex = Math.floor((currentIndex - 1) / 2);
        if (this.comparator(this.items[currentIndex], this.items[parentIndex]) > 0) {
          [this.items[currentIndex], this.items[parentIndex]] = [this.items[parentIndex], this.items[currentIndex]];
          currentIndex = parentIndex;
        } else {
          break;
        }
      }
    }

    heapifyDown() {
      let currentIndex = 0;
      const length = this.items.length;
      let leftChildIndex, rightChildIndex;
      while (currentIndex < length) {
        leftChildIndex = 2 * currentIndex + 1;
        rightChildIndex = leftChildIndex + 1;
        if (leftChildIndex >= length) break; // No children

        let swapIndex = currentIndex;
        if (this.comparator(this.items[leftChildIndex], this.items[swapIndex]) > 0) {
          swapIndex = leftChildIndex;
        }
        if (rightChildIndex < length && this.comparator(this.items[rightChildIndex], this.items[swapIndex]) > 0) {
          swapIndex = rightChildIndex;
        }
        if (swapIndex !== currentIndex) {
          [this.items[currentIndex], this.items[swapIndex]] = [this.items[swapIndex], this.items[currentIndex]];
          currentIndex = swapIndex;
        } else {
          break;
        }
      }
    }
  }

  // Use a priority queue to efficiently track top words
  const topWords = new PriorityQueue((a, b) => b.score - a.score); // Prioritize higher scores
  for (const word of validWordsAvailable) {
    const wordScore = scoreWord(word);

    // Ignore words that contain the same character twice at the start (for optimal coverage on starting word)
    let emptyCorrectLetters = true;
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      if (correctLetters[i]) {
        emptyCorrectLetters = false;
        break;
      }
    }
    if (emptyCorrectLetters && lettersInWord.length == 0 && lettersNotInWord.length == 0) {
      if (new Set(word).size !== WORDLE_LENGTH) continue;
    }

    topWords.enqueue({ word, score: wordScore });
    if (topWords.items.length > RESULT_LENGTH) {
      topWords.dequeue(); // Remove lowest-scoring word if queue exceeds limit
    }
  }

  // Return the top words from the priority queue
  const bestWords = [];
  while (!topWords.isEmpty()) {
    // bestWords.push(topWords.dequeue().word);
    bestWords.push(topWords.peek().word + ' (' + topWords.dequeue().score + ')');
  }
  return bestWords.reverse(); // Reverse to get the highest-scoring word first
}

function App() {
  const [correctLetters, setCorrectLetters] = useState(Array(WORDLE_LENGTH).fill(''));
  const [lettersInWord, setLettersInWord] = useState('');
  const [lettersNotInWord, setLettersNotInWord] = useState('');

  const handleInputChange = (updatedState) => {
    setCorrectLetters(updatedState.correctLetters || correctLetters);

    updatedState.lettersInWord == undefined ? setLettersInWord(lettersInWord) : setLettersInWord(updatedState.lettersInWord)
    updatedState.lettersNotInWord == undefined ? setLettersNotInWord(lettersNotInWord) : setLettersNotInWord(updatedState.lettersNotInWord)
  }

  const bestWords = findBestWords(correctLetters, [...lettersInWord], [...lettersNotInWord]);

  return (
    <div className="bg-gray-100 h-screen">
      <div className="container mx-auto py-8 px-10 max-w-screen-lg">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
          <div className="w-full">
            <WordleInput
              correctLetters={correctLetters}
              lettersInWord={lettersInWord}
              lettersNotInWord={lettersNotInWord}
              onInputChange={handleInputChange} />
          </div>
          <div className="w-full mt-4 md:mt-0">
            <WordleOutput
              bestWords={bestWords} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
