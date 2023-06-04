import { Chess } from 'chess.js';
import { Request, Response } from 'express';
/*
import { ChatGPTAPI } from 'chatgpt';

const key: string = (() => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return process.env.OPENAI_API_KEY;
})();
// Initialize the GPT-4 API with your API key
const gpt4Api = new ChatGPTAPI({
  apiKey: key,
  completionParams: {
    model: 'gpt-4',
    temperature: 0.5,
    top_p: 0.8,
  },
});
*/
interface MoveResult {
  move: string;
  chainOfThought: string;
  promotionPiece?: string;
}


const makeMove = async (currentPosition: string, difficulty: string): Promise<MoveResult> => {
  try {
    // Set GPT-4 API parameters according to the provided difficulty parameter
    const temperature = difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 0.5 : 0.2;

    const inputMessage = `Current chess position (FEN): ${currentPosition}. What is the best move for the AI player and why?`;
    //const response = await gpt4Api.sendMessage(inputMessage);
    const response = {text: "e2e4, I want to win the game."}

    // Extract the best move and the chain-of-thought from the response
    // It depends on the response format of GPT-4, you might need additional parsing
    const bestMove = response.text.split(',')[0]; // assume the best move is the first part of the response text
    // Extract the best move and the chain-of-thought from the response
    // It depends on the response format of GPT-4, you might need additional parsing
    const chainOfThought = response.text.slice(1);

    // Check for pawn promotion
    const promotionRegex = /([a-h][18])([qrbn])/;
    const promotionMatch = bestMove.match(promotionRegex);
    if (promotionMatch) {
      const move = promotionMatch[1]; // the move without promotion piece
      const promotionPiece = promotionMatch[2]; // the promotion piece
      return { move: bestMove, chainOfThought };
    }

    return { move: bestMove, chainOfThought };
  } catch (error) {
    console.error(`Error communicating with GPT-4: ${error}`);
    throw new Error('Error generating AI move');
  }
};

export const getMove = async (req: Request, res: Response): Promise<void> => {
  const currentPosition = req.body.position;
  const difficulty = req.body.difficulty;
  const chess = new Chess(currentPosition);

  try {
    const { move, promotionPiece, chainOfThought } = await makeMove(currentPosition, difficulty);

    const moveResult = chess.move({
      from: move.substring(0, 2),
      to: move.substring(2),
      promotion: promotionPiece,
    });

    // Validate AI move
    if (moveResult === null) {
      console.error("GPT-4 move validation error");
      res.status(500).json({ message: "An error occurred while generating the move" });
      return;
    }

    res.json({ move, chainOfThought });

  } catch (error) {
    res.status(500).json({ message: "An error occurred while generating the move" });
  }
};