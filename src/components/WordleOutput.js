function WordleOutput({bestWords}) {
    return (
      <div>
          <h2 className="text-2xl my-4 text-center text-gray-600">Wordle Output</h2>
          <p className="text-gray-600 text-center mb-5">Here are the top 5 best words to try in order:</p>
          {bestWords.map((bestWord, index) => (
            <span key={index} className="block text-center text-gray-600">{index+1}. {bestWord}</span>
          ))}
      </div>
    );
  }
  
  export default WordleOutput;