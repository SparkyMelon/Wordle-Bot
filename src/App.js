import React, { useState } from 'react';
import './App.css';
import { validWords } from './utils/wordle_words.js';
import Header from './components/Header.js';
import WordleInput from './components/WordleInput.js';
import WordleOutput from './components/WordleOutput.js';

function App() {
  const [correctLetters, setCorrectLetters] = useState(Array(5).fill(''));
  const [lettersInWord, setLettersInWord] = useState('');
  const [lettersNotInWord, setLettersNotInWord] = useState('');

  const handleInputChange = (updatedState) => {
    setCorrectLetters(updatedState.correctLetters || correctLetters);
    setLettersInWord(updatedState.lettersInWord || lettersInWord);
    setLettersNotInWord(updatedState.lettersNotInWord || lettersNotInWord);
  }

  // Do Worlde code stuff here
  console.log('Correct Letters: ' + JSON.stringify(correctLetters));
  console.log('Letters in Word: ' + lettersInWord);
  console.log('Letters not in Word: ' + lettersNotInWord);
  console.log(JSON.stringify(validWords));

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
            <WordleOutput />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
