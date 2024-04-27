function WordleOutput({bestWords}) {
    return (
      <div>
          <h2 className="text-2xl my-4 text-center text-gray-600">Wordle Output</h2>
          <p className="text-gray-600 text-center mb-5">Here are the best words to try in order:</p>
          <div className="flex justify-center">
            <div className="flex flex-col">
              {bestWords.map((bestWord, index) => (
                <span key={index} className="text-gray-600">{index+1}. {bestWord.word} <span className="text-gray-400">({bestWord.score})</span></span>
              ))}
            </div>
          </div>
      </div>
    );
  }
  
  export default WordleOutput;