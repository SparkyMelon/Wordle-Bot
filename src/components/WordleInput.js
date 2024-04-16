import React, { useRef } from 'react';

function WordleInput({ correctLetters, lettersInWord, lettersNotInWord, onInputChange }) {
  const inputRefs = useRef(Array(5).fill(null));

  const handleUserInput = (event, index = null) => {
    const updatedState = {};

    // Update state based on input type
    if (index !== null) {
      const newCorrectLetters = [...correctLetters];
      newCorrectLetters[index] = event.target.value;
      updatedState.correctLetters = newCorrectLetters;
    } else {
      const type = event.target.dataset.type;
      if (type === 'lettersInWord') {
        updatedState.lettersInWord = event.target.value;
      } else {
        updatedState.lettersNotInWord = event.target.value;
      }
    }

    onInputChange(updatedState);

    // Handle focusing on next/previous input (for correctLetters only)
    if (event.target.value && index !== null && index < 4) {
      inputRefs.current[index + 1].focus();
    } else if (!event.target.value && index !== null && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div>
      <h2 className="text-2xl my-4 text-center text-gray-600">Correct Letters</h2>
      <div className="flex space-x-2 justify-center">
        {correctLetters.map((correctLetter, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={correctLetter}
            onChange={(event) => handleUserInput(event, index)}
            data-type="correctLetter"
            className={`w-12 h-12 border border-gray-300 px-3 text-center text-xl font-bold uppercase focus:outline-none ${
              correctLetter ? 'wordle-green' : ''
            }`}
          />
        ))}
      </div>
      <h2 className="text-2xl my-4 text-center text-gray-600">Letters in Word</h2>
      <div className="flex justify-center">
        <input
          value={lettersInWord}
          onChange={(event) => handleUserInput(event)}
          data-type="lettersInWord"
          className="h-12 border border-gray-300 px-3 text-xl font-bold uppercase focus:outline-none wordle-yellow wordle-input"
        />
      </div>
      <h2 className="text-2xl my-4 text-center text-gray-600">Letters not in Word</h2>
      <div className="flex justify-center">
        <input
          value={lettersNotInWord}
          onChange={(event) => handleUserInput(event)}
          data-type="lettersNotInWord"
          className="h-12 border border-gray-300 px-3 text-xl font-bold uppercase focus:outline-none wordle-gray wordle-input"
        />
      </div>
    </div>
  );
}

export default WordleInput;
