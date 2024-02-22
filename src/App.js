import React, { useState, useEffect } from 'react';

function TimerPopup({ remainingTime }) {
  return (
    <div className="popup">
      <h2>Time Remaining: {remainingTime} seconds</h2>
    </div>
  );
}

function App() {
  const [results, setResults] = useState([]);
  const [bet, setBet] = useState({ amount: 0, option: '' });
  const [timer, setTimer] = useState(60);
  const [congratulation, setCongratulation] = useState('');
  const [lossAmount, setLossAmount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          const newResult = Math.random() >= 0.5 ? 'big' : 'small';
          setResults(prevResults => [newResult, ...prevResults.slice(0, 4)]);
          announceResults(newResult);
          setBet({ amount: 0, option: '' }); // Reset bet
          setTimer(60); // Restart the timer
          return 60;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const announceResults = (newResult) => {
    if (bet.amount > 0) {
      if ((newResult === 'big' && bet.option === 'big' && bet.amount >= 50) || 
          (newResult === 'small' && bet.option === 'small' && bet.amount < 50)) {
        setCongratulation('Congratulations! You won.');
        setTimeout(() => {
          setCongratulation('');
        }, 3000); // Hide congratulation message after 3 seconds
      } else {
        setLossAmount(bet.amount);
        setTimeout(() => {
          setLossAmount(0);
        }, 3000); // Hide loss message after 3 seconds
      }
    }
  }

  const handleBet = (option) => {
    if (timer > 5) {
      if (bet.amount > 0) {
        alert('You have already placed a bet.');
      } else {
        const inputBet = parseInt(prompt('Enter your bet amount (greater than 0):'));
        if (!isNaN(inputBet) && inputBet > 0) {
          setBet({ amount: inputBet, option: option });
        } else {
          alert('Invalid bet amount.');
        }
      }
    } else {
      alert('Betting time is over!');
    }
  };

  return (
    <div>
      <h1>Big or Small Betting Game {timer}</h1>
      {timer <= 5 && timer > 0 && <TimerPopup remainingTime={timer} />}
      <div>
        <button onClick={() => handleBet('big')} disabled={timer <= 5}>
          Bet Big
        </button>
        <button onClick={() => handleBet('small')} disabled={timer <= 5}>
          Bet Small
        </button>
      </div>
      <div>
        {bet.amount > 0 && (
          <div>
            <p>Your current bet:</p>
            <p>Option: {bet.option}</p>
            <p>Amount: ${bet.amount}</p>
          </div>
        )}
      </div>
      <h2>Last Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
      {congratulation && <div>{congratulation}</div>}
      {lossAmount > 0 && <div>Sorry! You lost ${lossAmount}.</div>}
    </div>
  );
}

export default App;
