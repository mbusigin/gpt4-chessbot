import express from 'express';
import { getMove } from '../controllers/chessController';

const router = express.Router();

// Route for getting the move suggested by GPT-4 based on the current position
router.post('/move', getMove);

export default router;
