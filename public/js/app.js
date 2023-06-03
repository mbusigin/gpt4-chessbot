// Import the necessary cm-chessboard npm package
import { Chessboard } from 'cm-chessboard';
import Chess from 'chess.js';
const chess = new Chess();


// Initialize the cm-chessboard
const config = {
  position: 'start',
  sprite: {
    url: './path/to/cm-chessboard-sprite.svg',
  },
  responsive: true,
  animationDuration: 300,
};

const chessboard = new Chessboard(document.querySelector('.chessboard-container'), config);

const sendPositionAndGetMove = async (currentPosition) => {
  try {
    const response = await fetch('/api/chess/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position: currentPosition }),
    });

    if (response.ok) {
      const data = await response.json();
      const aiMove = data.move;
      const chainOfThought = data.chainOfThought;
  
      chessboard.move(aiMove);
  
      // Update the chain-of-thought display
      document.getElementById('chain-of-thought').innerText = chainOfThought;
    } else {
      // Handle error in fetching move and chain-of-thought
    }
  } catch (error) {
    console.error('Error while fetching AI move:', error);
  }
};

// Example of how to handle user moves and update the cm-chessboard
chessboard.setOnMove(async (from, to) => {
  const userMove = { from, to };
  const moveResult = chess.move(userMove);

  // Validate user move
  if (moveResult === null) {
    console.log('Invalid move');
    return;
  }

  const currentPosition = chess.fen();
  const aiMove = await sendPositionAndGetMove(currentPosition);
  if (aiMove) {
    chessboard.move(aiMove);
  }
});


const sideSelection = document.getElementById('side-selection');
const aiDifficulty = document.getElementById('ai-difficulty');

sideSelection.addEventListener('change', (event) => {
  // Update the chessboard and game flow based on the selected side
  // E.g., set the orientation and start the AI move if the user selects black
});

aiDifficulty.addEventListener('change', (event) => {
  // Modify the GPT-4 API requests based on the selected AI difficulty, such as
  // adjusting the temperature or response time
});

const newGameButton = document.getElementById('new-game-btn');

newGameButton.addEventListener('click', () => {
  // Reset the internal chess instance
  chess.reset();

  // Reset the cm-chessboard to the initial position
  chessboard.setPosition('start');
  
  // Reset the chain-of-thought display
  document.getElementById('chain-of-thought').innerText = '';

  // Update any other necessary UI elements (e.g., game status and turn indicator)
});