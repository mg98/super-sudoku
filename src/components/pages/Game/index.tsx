import * as React from "react";

import {connect} from "react-redux";
import {
  pauseGame,
  continueGame,
  resetGame,
  newGame,
  GameState,
  wonGame,
  hideMenu,
  showMenu,
  selectCell,
} from "src/ducks/game";

import {Sudoku} from "src/components/modules/Sudoku/Sudoku";

import GameTimer from "./GameTimer";
import GameMenu from "./GameMenu";

import {Container} from "src/components/modules/Layout";
import Button from "src/components/modules/Button";
import styled from "styled-components";
import THEME from "src/theme";
import {RootState} from "src/ducks";
import SudokuState from "src/ducks/sudoku/accessor";
import {Cell} from "src/ducks/sudoku/model";
import {emptyGrid, setNumber, clearNumber} from "src/ducks/sudoku";
import key from "keymaster";
import {SUDOKU_NUMBERS, SUDOKU_COORDINATES} from "src/engine/utility";

function PauseButton({pauseGame}) {
  return (
    <Button
      onClick={pauseGame}
      style={{
        float: "right",
        marginBottom: THEME.spacer.x2,
      }}
    >
      {"Pause"}
    </Button>
  );
}

const MAX_WIDTH = 550;

const GameContainer = styled.div`
  display: flex;
  justify-content: center;

  color: white;
  position: relative;
  margin-top: ${THEME.spacer.x3}px;
  margin-bottom: ${THEME.spacer.x3 + 20}px;
  margin-left: auto;
  margin-right: auto;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: 600px) {
    max-width: auto;
    margin-left: ${-THEME.spacer.x2 + THEME.spacer.x4}px;
    margin-right: ${-THEME.spacer.x2 + THEME.spacer.x4}px;
  }
`;

const GridContainer = styled.div`
  position: relative;
  color: black;
  box-shadow: ${THEME.boxShadow};
  background-color: white;
  border-radius: ${THEME.borderRadius}px;
  width: ${MAX_WIDTH}px;
  height: ${MAX_WIDTH}px;
  flex-wrap: wrap;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;

  @media (max-width: 600px) {
    width: calc(100vw - ${THEME.spacer.x5}px);
    height: calc(100vw - ${THEME.spacer.x5}px);
  }
`;

interface GameDispatchProps {
  continueGame: typeof continueGame;
  resetGame: typeof resetGame;
  pauseGame: typeof pauseGame;
  newGame: typeof newGame;
  wonGame: typeof wonGame;
  showMenu: typeof showMenu;
  hideMenu: typeof hideMenu;
  selectCell: typeof selectCell;
}

interface GameStateProps {
  game: GameState;
  sudoku: Cell[];
}

const SHORTCUTS = "SHORTCUTS";

interface GameKeyboardShortcutsStateProps {
  activeCell: Cell;
  sudoku: Cell[];
}

interface GameKeyboardShortcutsDispatchProps {
  showMenu: typeof showMenu;
  hideMenu: typeof hideMenu;
  selectCell: typeof selectCell;
  setNumber: typeof setNumber;
  clearNumber: typeof clearNumber;
}

class GameKeyboardShortcuts extends React.Component<
  GameKeyboardShortcutsStateProps & GameKeyboardShortcutsDispatchProps
> {
  componentDidMount() {
    const getCellByXY = (x, y) => {
      return this.props.sudoku.find(cell => {
        return cell.x === x && cell.y === y;
      });
    };

    const setDefault = () => {
      this.props.selectCell(this.props.sudoku[0]);
    };

    const minCoordinate = SUDOKU_COORDINATES[0];
    const maxCoordinate = SUDOKU_COORDINATES[SUDOKU_COORDINATES.length - 1];

    key("up", SHORTCUTS, () => {
      const currentCell = this.props.activeCell;
      if (currentCell === null) {
        return setDefault();
      }
      const {x, y} = currentCell;
      const newY = Math.max(y - 1, minCoordinate);
      const nextCell = getCellByXY(x, newY);
      this.props.selectCell(nextCell);
      return false;
    });

    key("down", SHORTCUTS, () => {
      const currentCell = this.props.activeCell;
      if (currentCell === null) {
        return setDefault();
      }
      const {x, y} = currentCell;
      const newY = Math.min(y + 1, maxCoordinate);
      const nextCell = getCellByXY(x, newY);
      this.props.selectCell(nextCell);
      return false;
    });

    key("right", SHORTCUTS, () => {
      const currentCell = this.props.activeCell;
      if (currentCell === null) {
        return setDefault();
      }
      const {x, y} = currentCell;
      const newX = Math.min(x + 1, maxCoordinate);
      const nextCell = getCellByXY(newX, y);
      this.props.selectCell(nextCell);
      return false;
    });

    key("left", SHORTCUTS, () => {
      const currentCell = this.props.activeCell;
      if (currentCell === null) {
        return setDefault();
      }
      const {x, y} = currentCell;
      const newX = Math.max(x - 1, minCoordinate);
      const nextCell = getCellByXY(newX, y);
      this.props.selectCell(nextCell);
      return false;
    });

    SUDOKU_NUMBERS.forEach(n => {
      key(String(n), SHORTCUTS, () => {
        this.props.setNumber(this.props.activeCell, n);
      });
    });

    key("backspace", SHORTCUTS, () => {
      this.props.clearNumber(this.props.activeCell);
    });

    key.setScope(SHORTCUTS);
  }

  componentWillUnmount() {
    key.deleteScope(SHORTCUTS);
  }
  render() {
    return null;
  }
}

const ConnectedGameKeyboardShortcuts = connect<GameKeyboardShortcutsStateProps, GameKeyboardShortcutsDispatchProps>(
  (state: RootState) => ({
    sudoku: state.sudoku,
    activeCell: state.game.activeCell,
  }),
  {
    setNumber,
    clearNumber,
    selectCell,
    hideMenu,
    showMenu,
  },
)(GameKeyboardShortcuts);

class Game extends React.Component<GameStateProps & GameDispatchProps> {
  componentWillReceiveProps(props) {
    const state = new SudokuState();
    const wasSolved = state.isSolved(this.props.sudoku);
    const isSolved = state.isSolved(props.sudoku);
    if (isSolved && !wasSolved) {
      this.props.wonGame();
    }
  }

  render() {
    const {game, pauseGame} = this.props;
    return (
      <Container>
        <ConnectedGameKeyboardShortcuts />
        <GameContainer>
          <div>
            <div>
              <GameMenu />
              <GameTimer startTime={game.startTime} stopTime={game.stopTime} offsetTime={game.offsetTime} />
              <PauseButton pauseGame={pauseGame} />
            </div>
            <GridContainer>
              <Sudoku
                shouldShowMenu={this.props.game.showMenu}
                sudoku={this.props.sudoku}
                showMenu={this.props.showMenu}
                hideMenu={this.props.hideMenu}
                selectCell={this.props.selectCell}
                showHints={game.showHints && game.running}
                activeCell={game.activeCell}
              />
            </GridContainer>
          </div>
        </GameContainer>
      </Container>
    );
  }
}

export default connect(
  (state: RootState) => {
    const sudoku = state.game.running ? state.sudoku : emptyGrid;
    return {
      game: state.game,
      sudoku,
    };
  },
  {
    continueGame,
    pauseGame,
    resetGame,
    wonGame,
    showMenu,
    selectCell,
    hideMenu,
  },
)(Game);
