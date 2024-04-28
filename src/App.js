import React, { useState, useEffect } from 'react';
import './App.css';
import { validWords } from './utils/wordle_words.js';
import { validWordsV2 } from './utils/wordle_words_v2.js';
import Header from './components/Header.js';
import WordleInput from './components/WordleInput.js';
import WordleOutput from './components/WordleOutput.js';

const WORDLE_LENGTH = 5;
const RESULT_LENGTH = 10;
const BONUS_MODIFIER_FOR_UNUSED_LETTER = 2;

function findBestWords(correctLetters, lettersInWord, lettersNotInWord, letterCoverage) {
  // Get a list of all unsued letters to be used in coverage check
  // Do not need to worry about lettersNotInWord as words with these letters will not be in the result
  const allLetters = new Set('abcdefghijklmnopqrstuvwxyz');
  let usedLetters = new Set();
  for (const correctLetter of correctLetters) {
    if (correctLetter) {
      usedLetters.add(correctLetter);
    }
  }
  for (const lettersInWordArray of lettersInWord) {
    for (const letterInWord of lettersInWordArray) {
      if (letterInWord) {
        usedLetters.add(letterInWord);
      }
    }
  }
  const unusedLetters = Array.from(allLetters).filter(letter => !usedLetters.has(letter));

  // Remove letter from 'lettersNotInWord' if the letter is in 'lettersInWord' to deal with Wordles way of saying there's only 1 of the letter
  for (let i = 0; i < lettersNotInWord.length; i++) {
    for (const lettersInWordArray of lettersInWord) {
      if (lettersInWordArray.includes(lettersNotInWord[i])) {
        lettersNotInWord.splice(i--, 1);
      }
    }
  }

  // Remove words based on input
  // Correct letters
  let validWordsAvailable = [];

  validWordsLoop: for (const word of validWordsV2) {
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      if (correctLetters[i] && correctLetters[i] !== word[i]) {
        continue validWordsLoop;
      }
    }

    validWordsAvailable.push(word);
  }

  validWordsLoop: for (let i = 0; i < validWordsAvailable.length; i++) {
    // Letters not in word
    for (const letterNotInWord of lettersNotInWord) {
      if (validWordsAvailable[i].includes(letterNotInWord)) {
        validWordsAvailable.splice(i--, 1);
        continue validWordsLoop;
      }
    }

    // Letters in word
    for (const lettersInWordArray of lettersInWord) {
      for (let j = 0; j < lettersInWordArray.length; j++) {
        if (lettersInWordArray[j] != '') {
          if (!validWordsAvailable[i].includes(lettersInWordArray[j]) ||
          validWordsAvailable[i][j] == lettersInWordArray[j]) {
            validWordsAvailable.splice(i--, 1);
            continue validWordsLoop;
          }
        }
      }
    }
  }

  // Create a map to store letter counts in different positions
  const letterCounts = new Map();
  for (let i = 0; i < WORDLE_LENGTH; i++) {
    letterCounts.set(i, new Map());
  }

  // Count letter occurrences in each position
  for (const word of validWordsAvailable) {
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      const letter = word[i];
      const positionMap = letterCounts.get(i);
      positionMap.set(letter, (positionMap.get(letter) || 0) + 1);
    }
  }

  // Define a function to score a word based on letter counts
  function scoreWord(word, letterCoverage, unusedLetters) {
    let score = 0;
    let letters = [];
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      const letter = word[i];

      if (letterCoverage && letters.includes(word[i])) continue;

      const positionMap = letterCounts.get(i);
      let letterScore = positionMap.get(letter) || 0;

      if (letterCoverage && unusedLetters.includes(letter)) {
        letterScore *= BONUS_MODIFIER_FOR_UNUSED_LETTER;
      }

      score += letterScore;
      letters.push(letter);
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
    const wordScore = scoreWord(word, letterCoverage, unusedLetters);

    // Ignore words that contain the same character twice at the start (for optimal coverage on starting word)
    let emptyCorrectLetters = true;
    for (let i = 0; i < WORDLE_LENGTH; i++) {
      if (correctLetters[i]) {
        emptyCorrectLetters = false;
        break;
      }
    }

    let emptyLettersInWord = true;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < WORDLE_LENGTH; j++) {
        if (lettersInWord[i][j]) {
          emptyLettersInWord = false;
          break;
        }
      }
    }

    if (emptyCorrectLetters && emptyLettersInWord && lettersNotInWord.length == 0) {
      if (new Set(word).size !== WORDLE_LENGTH) continue;
    }

    topWords.enqueue({ word, score: wordScore });
    if (topWords.items.length > RESULT_LENGTH) {
      topWords.dequeue(); // Remove lowest-scoring word if queue exceeds limit
    }
  }console.log(topWords.items.length);

  // Return the top words from the priority queue
  const bestWords = [];
  while (!topWords.isEmpty()) {
    // bestWords.push(topWords.dequeue().word);
    //bestWords.push(topWords.peek().word + ' (' + topWords.dequeue().score + ')');
    bestWords.push({
      word: topWords.peek().word,
      score: topWords.dequeue().score
    });
  }

  return {
    bestWords: bestWords.reverse(),
    count: validWordsAvailable.length
  };

  return bestWords.reverse(); // Reverse to get the highest-scoring word first
}

function App() {
  const [correctLetters, setCorrectLetters] = useState(Array(WORDLE_LENGTH).fill(''));
  const [lettersInWord, setLettersInWord] = useState(Array(5).fill(Array(WORDLE_LENGTH).fill('')));
  const [lettersNotInWord, setLettersNotInWord] = useState('');
  const [letterCoverage, setLetterCoverage] = useState(true);
  const [bestWords, setBestWords] = useState(Array(10).fill(''));
  const [bestWordsCount, setBestWordsCount] = useState(0);

  const handleInputChange = (updatedState) => {
    setCorrectLetters(updatedState.correctLetters || correctLetters);
    setLettersInWord(updatedState.lettersInWord || lettersInWord);
    updatedState.lettersNotInWord == undefined ? setLettersNotInWord(lettersNotInWord) : setLettersNotInWord(updatedState.lettersNotInWord);
    updatedState.letterCoverage == undefined ? setLetterCoverage(letterCoverage) : setLetterCoverage(updatedState.letterCoverage);
  }

  //const bestWords = findBestWords(correctLetters, [...lettersInWord.map(row => [...row])], [...lettersNotInWord], letterCoverage);
  useEffect(() => {
    const fetchBestWords = async () => {
      try {
        const results = await findBestWords(correctLetters, [...lettersInWord.map(row => [...row])], [...lettersNotInWord], letterCoverage);
        setBestWords(results.bestWords);
        setBestWordsCount(results.count);
      } catch (error) {
        console.error("Error fetching best words:", error);
      }
    };

    fetchBestWords();
  }, [correctLetters, lettersInWord, lettersNotInWord, letterCoverage]);

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
              letterCoverage={letterCoverage}
              onInputChange={handleInputChange} />
          </div>
          <div className="w-full mt-4 md:mt-0">
            <WordleOutput
              bestWords={bestWords}
              bestWordsCount={bestWordsCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
