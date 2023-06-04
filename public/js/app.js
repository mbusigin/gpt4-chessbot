// Import the necessary cm-chessboard npm package
import { Chessboard } from 'cm-chessboard';
import { Chess } from 'chess.js';
const chess = new Chess();


// Initialize the cm-chessboard
const config = {
  // position: 'start',
  sprite: {
    url: '/node_modules/cm-chessboard/assets/pieces/standard.svg',
  },
  responsive: true,
  animationDuration: 300,
  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
};
const chessboard = new Chessboard(document.querySelector('.chessboard-container'), config);

const sendPositionAndGetMove = async (currentPosition, difficulty) => { // Line 19: Add the 'difficulty' parameter
  try {
    const response = await fetch('/api/chess/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position: currentPosition, difficulty: difficulty }), // Line 26: After
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

// New inputHandler function
function inputHandler(event) {
  const from = event.squareFrom;
  const to = event.squareTo;
  const userMove = { from, to };

  const moveResult = chess.move(userMove);

  // Validate user move
  if (moveResult === null) {
    console.log('Invalid move');
    return;
  }

  const currentPosition = chess.fen();
  sendPositionAndGetMove(currentPosition, aiDifficulty.value)
    .then((aiMove) => {
      chessboard.move(aiMove);
      updateTurnIndicatorAndGameStatus();
    })
    .catch((error) => {
      console.error('Error while fetching AI move:', error);
    });
}

// Enable move input on the chessboard
chessboard.enableMoveInput(inputHandler, 'white');


// // Example of how to handle user moves and update the cm-chessboard
// chessboard.setOnMove(async (from, to) => {
//   const userMove = { from, to };
//   const moveResult = chess.move(userMove);

//   // Validate user move
//   if (moveResult === null) {
//     console.log('Invalid move');
//     return;
//   }

//   handleUserPawnPromotion(moveResult);

//   const currentPosition = chess.fen();
//   const aiMove = await sendPositionAndGetMove(currentPosition);
//   if (aiMove) {
//     chessboard.move(aiMove);
//   }

//   updateTurnIndicatorAndGameStatus();
// });

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
  chessboard.setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  // Reset the chain-of-thought display
  document.getElementById('chain-of-thought').innerText = '';

  // Update any other necessary UI elements (e.g., game status and turn indicator)
});

sideSelection.addEventListener('change', (event) => {
  const selectedSide = event.target.value;

  // Update the chessboard orientation
  chessboard.setOrientation(selectedSide);

  // Reset the game state and update the UI elements
  resetGame();

  if (selectedSide === 'black') {
    // If the user chooses to play as black, start the AI move for white
    sendPositionAndGetMove(chess.fen(), aiDifficulty.value);
  }
});


aiDifficulty.addEventListener('change', (event) => {
  const selectedDifficulty = event.target.value;
  updateAIDifficulty(selectedDifficulty);
});

const updateAIDifficulty = (selectedDifficulty) => {
  // TODO: Update the GPT-4 API configuration based on the selected AI difficulty
  // Since GPT-4 API is not available yet, replace it with the actual API configuration when it's ready
  // Just an example, this can change based on the actual GPT-4 API documentation
  const temperature = selectedDifficulty === 'easy' ? 0.8 : selectedDifficulty === 'medium' ? 0.5 : 0.2;

  // gpt4Api.setCompletionParams({
  //   ...gpt4Api.getCompletionParams(),
  //   temperature,
  // });
};

const updateTurnIndicatorAndGameStatus = () => {
  const turnIndicator = document.getElementById('turn-indicator');
  const gameStatus = document.getElementById('game-status');
  const turn = chess.turn() === 'w' ? "White" : "Black";
  const gameStatusText = chess.in_checkmate() ? 'Checkmate'
    : chess.in_stalemate() ? 'Stalemate'
      : chess.in_draw() ? 'Draw'
        : chess.in_check() ? 'Check'
          : '';

  turnIndicator.innerText = `${turn}'s turn`;
  gameStatus.innerText = gameStatusText;
};

const handleUserPawnPromotion = (moveResult) => {
  if (moveResult.flags.includes('p')) {
    // Pawn promotion occurred
    const promotionPiece = prompt('Choose a promotion piece (q/r/b/n):').toLowerCase();
    if (['q', 'r', 'b', 'n'].includes(promotionPiece)) {
      chess.undo(); // Undo the promotion move
      const move = { from: moveResult.from, to: moveResult.to, promotion: promotionPiece };
      chess.move(move); // Redo the move with the selected promotion piece
      // Update the chessboard with the new promotion piece
      chessboard.setPosition(chess.fen(), false);
    } else {
      // Invalid promotion piece selection; revert the move and notify the user
      chess.undo();
      chessboard.setPosition(chess.fen(), false);
      alert('Invalid promotion piece selected; please try the move again.');
    }
  }
};


const resetGame = () => {
  // Reset the internal chess instance
  chess.reset();

  // Reset the cm-chessboard to the initial position
  chessboard.setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  // Reset the chain-of-thought display
  document.getElementById('chain-of-thought').innerText = '';

  // Update any other necessary UI elements (e.g., game status and turn indicator)
};

const onSideSelectionChange = (selectElement) => {
  const selectedSide = selectElement.value;

  // Update the chessboard orientation
  chessboard.setOrientation(selectedSide);

  // Reset the game state and update the UI elements
  resetGame();

  if (selectedSide === 'black') {
    // If the user chooses to play as black, start the AI move for white
    sendPositionAndGetMove(chess.fen(), aiDifficulty.value);
  }
};
