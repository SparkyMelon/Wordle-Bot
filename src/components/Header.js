function Header() {
  return (
    <div>
        <h1 className="text-4xl text-center font-bold text-gray-800">Wordle Bot</h1>
        <p className="mt-4 text-center text-gray-600">
            Stuck on Wordle? This bot's your hero! Feed it your colored letter clues (green for correct spot, yellow for right letter wrong place), and it'll analyze the possibilities, hatching the optimal next guess to crack the daily wordle in the fewest tries.
        </p>
    </div>
  );
}

export default Header;
