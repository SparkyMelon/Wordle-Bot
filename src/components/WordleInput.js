import React, { useState, useRef } from 'react';

function WordleInput() {
    const [letters, setLetters] = useState(Array(5).fill(''));
    const inputRefs = useRef(Array(5).fill(null));

    const handleChange = (index, event) => {
        const newLetters = [...letters];
        newLetters[index] = event.target.value;
        setLetters(newLetters);

        // Focus on the next or previous input
        if (event.target.value && index < 4) {
            inputRefs.current[index + 1].focus();
          } else if (!event.target.value && index > 0) {
            inputRefs.current[index - 1].focus();
          }
      };

    return (
        <div>
            <h2 className="text-2xl my-4 text-center text-gray-600">Correct Letters</h2>
            <div className="flex space-x-2 justify-center">
                {letters.map((letter, index) => (
                    <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={letter}
                    onChange={(event) => handleChange(index, event)}
                    className={`w-12 h-12 border border-gray-300 px-3 text-center text-xl font-bold uppercase focus:outline-none ${
                        letter ? 'wordle-green' : ''
                    }`}
                    />
                ))}
            </div>
        </div>
    );
  }
  
  export default WordleInput;