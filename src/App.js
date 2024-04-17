import React, { useState } from 'react';
import './App.css';
import { validWords } from './utils/wordle_words.js';
import Header from './components/Header.js';
import WordleInput from './components/WordleInput.js';
import WordleOutput from './components/WordleOutput.js';

function findBestWords(correctLetters, lettersInWord, lettersNotInWord) {
  const bestWords = [];

  // Test data
  bestWords.push('Here');
  bestWords.push('Are');
  bestWords.push('Some');
  bestWords.push('Test');
  bestWords.push('Words');

  return findBestStartingWordsV2(correctLetters, [...lettersInWord], [...lettersNotInWord]);

  // Check if nothing has been inputted and provide best starting words
  /*if (correctLetters[0] == '' && correctLetters[0] == '' && correctLetters[0] == '' && correctLetters[0] == '' && correctLetters[0] == '' && lettersInWord == '' && lettersNotInWord == '') {
    console.log('STARTING WORDS');
    return findBestStartingWords(correctLetters, [...lettersInWord], [...lettersNotInWord]);
  } else {
    console.log("NOT STARTING WORDS");
  }*/

  return bestWords;
}

function findBestStartingWords(correctLetters, lettersInWord, lettersNotInWord) {
  // Create a map to store letter counts in different positions
  const letterCounts = new Map();
  for (let i = 0; i < 5; i++) {
    letterCounts.set(i, new Map());
  }

  // Count letter occurrences in each position
  for (const word of validWords) {
    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      const positionMap = letterCounts.get(i);
      positionMap.set(letter, (positionMap.get(letter) || 0) + 1);
    }
  }

  // Define a function to score a word based on letter counts
  function scoreWord(word) {
    let score = 0;
    for (let i = 0; i < 5; i++) {
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

  // Use a priority queue to efficiently track top 5 words
  const topWords = new PriorityQueue((a, b) => b.score - a.score); // Prioritize higher scores
  for (const word of validWords) {
    const wordScore = scoreWord(word);

    // Ignore words that contain the same character twice (for optimal coverage on starting word)
    if (new Set(word).size !== 5) continue;

    topWords.enqueue({ word, score: wordScore });
    if (topWords.items.length > 5) {
      topWords.dequeue(); // Remove lowest-scoring word if queue exceeds 5
    }
  }

  // Return the top 5 words from the priority queue
  const bestWords = [];
  while (!topWords.isEmpty()) {
    bestWords.push(topWords.dequeue().word);
  }
  return bestWords.reverse(); // Reverse to get the highest-scoring word first
}

function findBestStartingWordsV2(correctLetters, lettersInWord, lettersNotInWord) {
  // Create a map to store letter counts in different positions
  const letterCounts = new Map();
  for (let i = 0; i < 5; i++) {
    letterCounts.set(i, new Map());
  }

  // TODO: Text & fix the 3 named loops below
  // Modify valid words based on input
  // Correct Letters
  const validWordsAvailable = [];

  validWordsLoop: for (const word of validWords) {
    for (let i = 0; i < 5; i++) {
      if (correctLetters[i] && correctLetters[i] !== word[i]) {
        continue validWordsLoop;
      }
    }

    validWordsAvailable.push(word);
  }

  // Letters In Word
  lettersInWordLoop: for (const word of validWordsAvailable) {
    for (const letterInWord of lettersInWord) {
      if (!word.includes(letterInWord)) {
        validWordsAvailable.remove(word);
        continue lettersInWordLoop;
      }
    }
  }

  // Letters Not In Word
  lettersNotInWordLoop: for (const word of validWordsAvailable) {
    for (const letterNotInWord of lettersNotInWord) {
      if (word.includes(letterNotInWord)) {
        validWordsAvailable.remove(word);
        continue lettersNotInWordLoop;
      }
    }
  }

  // Count letter occurrences in each position
  for (const word of validWords) {
    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      const positionMap = letterCounts.get(i);
      positionMap.set(letter, (positionMap.get(letter) || 0) + 1);
    }
  }

  // Define a function to score a word based on letter counts
  function scoreWord(word) {
    let score = 0;
    for (let i = 0; i < 5; i++) {
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

  // Use a priority queue to efficiently track top 5 words
  const topWords = new PriorityQueue((a, b) => b.score - a.score); // Prioritize higher scores
  for (const word of validWords) {
    const wordScore = scoreWord(word);

    // Ignore words that contain the same character twice (for optimal coverage on starting word)
    if (new Set(word).size !== 5) continue;

    topWords.enqueue({ word, score: wordScore });
    if (topWords.items.length > 5) {
      topWords.dequeue(); // Remove lowest-scoring word if queue exceeds 5
    }
  }

  // Return the top 5 words from the priority queue
  const bestWords = [];
  while (!topWords.isEmpty()) {
    bestWords.push(topWords.dequeue().word);
  }
  return bestWords.reverse(); // Reverse to get the highest-scoring word first
}

function App() {
  const [correctLetters, setCorrectLetters] = useState(Array(5).fill(''));
  const [lettersInWord, setLettersInWord] = useState('');
  const [lettersNotInWord, setLettersNotInWord] = useState('');

  const handleInputChange = (updatedState) => {
    setCorrectLetters(updatedState.correctLetters || correctLetters);

    updatedState.lettersInWord == undefined ? setLettersInWord(lettersInWord) : setLettersInWord(updatedState.lettersInWord)
    updatedState.lettersNotInWord == undefined ? setLettersNotInWord(lettersNotInWord) : setLettersNotInWord(updatedState.lettersNotInWord)
  }

  // Do Worlde code stuff here
  /*console.log('Correct Letters: ' + JSON.stringify(correctLetters));
  console.log('Letters in Word: ' + lettersInWord);
  console.log('Letters not in Word: ' + lettersNotInWord);*/
  //console.log(JSON.stringify(validWords));

  const bestWords = findBestWords(correctLetters, lettersInWord, lettersNotInWord);

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
