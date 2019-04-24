import configureStore from "./configureStore";
import {getState} from "src/sudoku-game/persistence";

const savedState = getState();
const currentSudoku = savedState.sudokus[savedState.active];
const initialState = currentSudoku ? currentSudoku : {};
const store = configureStore(initialState);
export default store;
