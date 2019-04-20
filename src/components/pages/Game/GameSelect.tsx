import * as React from "react";
import LazyLoad from "react-lazyload";
import {navigate} from "@reach/router";
import SUDOKUS from "src/assets/sudokus-new";
import {connect} from "react-redux";
import {RootState} from "src/ducks";
import {DIFFICULTY} from "src/engine/utility";
import styled from "styled-components";
import SmallSudokuComponent from "../../modules/Sudoku/SudokuSmall";
import {setDifficulty} from "src/ducks/game/choose";
import {newGame} from "src/ducks/game";
import {setSudoku} from "src/ducks/sudoku";

const TabBar = styled.div`
  display: flex;
  border-bottom: none;
  color: white;
  justify-content: center;
`;

const TabItem = styled.div<{
  active: boolean;
}>`
  padding: 10px 10px;
  background: ${p => (p.active ? "white" : "black")};
  color: ${p => (p.active ? "black" : "white")};
  cursor: pointer;
  text-transform: capitalize;
`;

const SudokusContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -10px;
`;

const SudokuContainer = styled.div`
  padding: 10px;
`;

const SudokuSmallPlaceholder: React.StatelessComponent<{size: number}> = ({size}) => (
  <SudokuContainer>
    <div style={{height: size, width: size, background: "grey"}} />
  </SudokuContainer>
);

class GameIndex extends React.Component<{
  difficulty: DIFFICULTY;
  chooseSudoku: (sudoku, solution) => void;
}> {
  constructor(props) {
    super(props);
  }
  render() {
    let {difficulty, chooseSudoku} = this.props;
    const sudokus = SUDOKUS[difficulty];

    const size = 170;

    return (
      <SudokusContainer>
        {sudokus.map(sudoku => {
          return (
            <LazyLoad height={size} key={sudoku.id} placeholder={<SudokuSmallPlaceholder size={size} />}>
              <SudokuContainer>
                <SmallSudokuComponent
                  onClick={() => chooseSudoku(sudoku.sudoku, sudoku.solution)}
                  size={size}
                  id={sudoku.id + 1}
                  sudoku={sudoku.sudoku}
                  darken
                />
              </SudokuContainer>
            </LazyLoad>
          );
        })}
      </SudokusContainer>
    );
  }
}

interface GameSelectProps {
  difficulty: DIFFICULTY;
}

interface GameSelectDispatchProps {
  setDifficulty: typeof setDifficulty;
  setSudoku: typeof setSudoku;
  newGame: typeof newGame;
}

const GameSelect: React.StatelessComponent<GameSelectProps & GameSelectDispatchProps> = ({
  difficulty,
  setDifficulty,
  newGame,
  setSudoku,
}) => {
  const chooseSudoku = (sudoku, solution) => {
    newGame();
    setSudoku(difficulty, sudoku, solution);
    navigate("/");
  };

  return (
    <div>
      <TabBar>
        {[DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD, DIFFICULTY.EVIL].map(d => {
          return (
            <TabItem key={d} active={d === difficulty} onClick={() => setDifficulty(d)}>
              {d}
            </TabItem>
          );
        })}
      </TabBar>
      <GameIndex difficulty={difficulty} chooseSudoku={chooseSudoku} />
    </div>
  );
};

const GameSelectConnected = connect<GameSelectProps, GameSelectDispatchProps>(
  (state: RootState) => {
    return {
      difficulty: state.choose.difficulty,
    };
  },
  {
    setDifficulty,
    newGame,
    setSudoku,
  },
)(GameSelect);

export default GameSelectConnected;