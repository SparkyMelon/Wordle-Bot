import './App.css';
import Header from './components/Header.js';
import WordleInput from './components/WordleInput.js';
import WordleOutput from './components/WordleOutput.js';

function App() {
  return (
    <div className="bg-gray-100 h-screen">
      <div className="container mx-auto py-8 px-10 max-w-screen-lg">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
          <div className="w-full">
            <WordleInput />
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
