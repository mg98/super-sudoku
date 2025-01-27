import SUDOKUS from "src/sudoku-game/sudokus";
import {GameState, GameStateMachine} from "src/state/game";
import {SudokuState} from "src/state/sudoku";
import {ApplicationState} from "src/state/application";

const STORAGE_KEY = "super_sudoku_1_3_use_this_file_if_you_want_to_cheat";

interface StoredState {
  active: number;
  application: ApplicationState | undefined;
  sudokus: {
    [key: number]: {game: GameState; sudoku: SudokuState};
  };
}

const loadFromLocalStorage = (): StoredState => {
  const empty = {
    active: -1,
    sudokus: {},
    application: undefined,
  };
  if (typeof localStorage === "undefined") {
    return empty;
  }
  const text = localStorage.getItem(STORAGE_KEY);
  if (text !== null) {
    try {
      // TODO: add validation
      const result = JSON.parse(text) as StoredState;
      return result;
    } catch (e) {
      // delete entry but save it as corrupted, so one might be able to restore it
      console.error("File corrupted: will delete and save as corrupted.");
      localStorage.setItem(STORAGE_KEY + "_corrupted_" + new Date().toISOString(), text);
      localStorage.removeItem(STORAGE_KEY);
      return empty;
    }
  }
  return empty;
};

// TODO: this is problematic with multiple open windows, as the .active gets overwritten.
// We should have a tab based storage for that stuff as well, so a reload does not open the other sudoku.
export const saveToLocalStorage = (application: ApplicationState, game: GameState, sudoku: SudokuState) => {
  const cached = loadFromLocalStorage();
  cached.active = game.sudokuId;
  cached.application = application;
  cached.sudokus[game.sudokuId] = {game, sudoku};
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.error("LocalStorage is not supported! No Saving possible.", e);
  }
};

export const getState = () => {
  const cached = loadFromLocalStorage();
  return cached;
};

export default SUDOKUS;
