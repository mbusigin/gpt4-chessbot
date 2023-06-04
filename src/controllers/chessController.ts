import { Chess } from 'chess.js';
import { Request, Response } from 'express';
import { ChatGPTAPI } from 'chatgpt';

// Initialize the GPT-4 API with your API key
const gpt4Api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    model: 'gpt-4',
    temperature: 0.5,
    top_p: 0.8,
  },
});

const makeMove = async (currentPosition: string): Promise<string> => {
  try {
    const inputMessage = `Current chess position (FEN): ${currentPosition}. What is the best move for the AI player and why?`;
    const response = await gpt4Api.sendMessage(inputMessage);

    // Extract the best move and the chain-of-thought from the response
    // It depends on the response format of GPT-4, you might need additional parsing
    const bestMove = response.text.split(',')[0]; // assume the best move is the first part of the response text

    // Check for pawn promotion
    const promotionRegex = /([a-h][18])([qrbn])/;
    const promotionMatch = bestMove.match(promotionRegex);
    if (promotionMatch) {
      const move = promotionMatch[1]; // the move without promotion piece
      const promotionPiece = promotionMatch[2]; // the promotion piece
      return { move, promotionPiece };
    }

    return { move: bestMove };
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
    const move = await makeMove(currentPosition, difficulty); // Pass the difficulty level to makeMove function

    // ...
  } catch (error) {
    res.status(500).json({ message: "An error occurred while generating the move" });
  }
};
export const getMove = async (req: Request, res: Response): Promise<void> => {
  const currentPosition = req.body.position;
  const chess = new Chess(currentPosition);

  try {
    const { move, promotionPiece } = await makeMove(currentPosition);

    const moveResult = chess.move(move, { promotion: promotionPiece });

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
