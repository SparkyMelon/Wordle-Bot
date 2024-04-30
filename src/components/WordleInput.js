import React from 'react';

function WordleInput({ correctLetters, lettersInWord, lettersNotInWord, letterCoverage, onInputChange }) {
  const handleUserInput = (event, i = null, j = null) => {
    const updatedState = {};
    
    // Update state based on input type
    if (i !== null) {
      if (j !== null) {
        const newLettersInWord = [...lettersInWord.map(row => [...row])];
        newLettersInWord[i][j] = event.target.value;
        updatedState.lettersInWord = newLettersInWord;
      } else {
        const newCorrectLetters = [...correctLetters];
        newCorrectLetters[i] = event.target.value;
        updatedState.correctLetters = newCorrectLetters;
      }
    } else {
      const type = event.target.dataset.type;
      if (type == 'lettersNotInWord') {
        updatedState.lettersNotInWord = event.target.value;
      } else if (type == 'letterCoverage') {
        updatedState.letterCoverage = !letterCoverage;
      }
    }

    onInputChange(updatedState);
  };

  return (
    <div className="max-w-[288px]">
      <h2 className="text-2xl font-bold my-4 text-center text-gray-600">Correct Letters</h2>
      <div className="flex space-x-2 justify-center">
        {correctLetters.map((correctLetter, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={correctLetter}
            onChange={(event) => handleUserInput(event, index)}
            data-type="correctLetter"
            className="w-12 h-12 text-4xl border border-gray-300 px-3 text-center pb-1 font-bold uppercase focus:outline-none wordle-green"
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold my-4 text-center text-gray-600">Letters in Word</h2>
      {lettersInWord.map((lettersInWordArray, i) => (
        <div className={`flex space-x-2 justify-center ${
          i === lettersInWord.length - 1 ? '' : 'mb-2'
          }`} 
          key={i}
          >
          {lettersInWordArray.map((letterInWord, j) => (
            <input
            key={`${i}-${j}`}
            type="text"
            maxLength={1}
            value={letterInWord}
            onChange={(event) => handleUserInput(event, i, j)}
            data-type="letterInWord"
            className="w-12 h-12 text-4xl border border-gray-300 px-3 text-center pb-1 font-bold uppercase focus:outline-none wordle-yellow"
          />
          ))}
        </div>
      ))}

      <h2 className="text-2xl font-bold my-4 text-center text-gray-600">Letters not in Word</h2>
      <div className="flex justify-center">
        <input
          value={lettersNotInWord}
          onChange={(event) => handleUserInput(event)}
          data-type="lettersNotInWord"
          className="max-w-full h-12 text-4xl border border-gray-300 px-3 pb-1 font-bold uppercase focus:outline-none wordle-gray wordle-input"
        />
      </div>

      <h2 className="text-2xl font-bold my-4 text-center text-gray-600">Letter Coverage</h2>
      <p className="text-center text-gray-600 mb-4">Encourage the bot to use unused letters for better coverage.</p>
      <div className="flex justify-center items-center">
        <input
          id="letterCoverage"
          className="cursor-pointer h-8 w-16 rounded-full appearance-none bg-[#3a3a3c] checked:bg-[#6ba964] transition duration-200 relative"
          type="checkbox"
          role="switch"
          data-type="letterCoverage"
          checked={letterCoverage}
          onChange={(event) => handleUserInput(event)} />
      </div>
    </div>
  );
}

export default WordleInput;
