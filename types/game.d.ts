import { TTFEBoard } from "../components/2048Game";
import { SudokuGrid } from "../components/Sudoku";

type GameData = SudokuGrid | TTFEGameData;

interface GamesData {
  name: string;
  data?: GameData;
  won: boolean;
}

interface TTFEGameData {
  ttfeBoard: TTFEBoard;
  ttfeScore: number;
}
