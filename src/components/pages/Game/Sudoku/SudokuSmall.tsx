import React from "react";
import {SimpleSudoku} from "src/engine/utility";
import styled, { css } from "styled-components";

const SudokuSmallContainer = styled.div`
  user-select: none;
`;

const SudokuSmall = styled.div`
  position: relative;
  background-color: white;
  color: black;
  cursor: default;
`;

const SudokuSmallDarken = styled.div`
  position: absolute;
  background: black;
  height: 100%;
  width: 100%;
  opacity: 0.2;
  z-index: 9;

  &:hover {
    opacity: 0;
  }
`;

const SudokuSmallTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  opacity: 0.8;
  font-size: 42px;
  font-weight: bold;
  position: absolute;
  height: 100%;
  z-index: 4;
  width: 100%;
  top: 0;
  left: 0;
`;

const GridLineX = styled.div<{
  top: number;
  width: number;
  makeBold: boolean;
}>`
  position: absolute;
  left: 0;
  width: ${props => props.width}%;
  top: ${props => props.top}%;
  transform: translateY(-50%);
  height: 1px;
  background: #eeeeee;
  ${props =>
    props.makeBold &&
    css`
      background: #aaaaaa;
      height: 1px;
      z-index: 1;
    `};
`;

const GridLineY = styled.div<{
  left: number;
  height: number;
  makeBold: boolean;
}>`
  position: absolute;
  top: 0;
  height: ${props => props.height}%;
  left: ${props => props.left}%;
  background: #eeeeee;
  width: 1px;
  transform: translateX(-50%);
  ${props =>
    props.makeBold &&
    css`
      background: #aaaaaa;
      width: 1px;
    `};
`;

const SmallSudokuGrid: React.StatelessComponent<{width: number, height: number, hideLeftRight?: boolean}> = ({width, height, hideLeftRight = false}) => {
  return (
    <div>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        const hide = [0, 9].includes(i);
        if (hideLeftRight && hide) {
          return null;
        }
        const makeBold = [3, 6].includes(i);
        return <GridLineX makeBold={makeBold} key={i} width={width} top={(i * height) / 9} />;
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        const hide = [0, 9].includes(i);
        if (hideLeftRight && hide) {
          return null;
        }
        const makeBold = [3, 6].includes(i);
        return <GridLineY makeBold={makeBold} key={i} height={height} left={(i * height) / 9} />;
      })}
    </div>
  );
}

export default class SmallSudokuComponent extends React.PureComponent<{
  sudoku: SimpleSudoku;
  id: number;
  darken?: boolean;
  size?: number;
  onClick?: () => void;
}> {
  render() {
    const {sudoku, id, onClick, size = 150} = this.props;
    const containerHeight = size;
    const containerWidth = size;
    const height = 100;
    const width = 100;
    const fontSize = size / 16;

    const xSection = height / 9;
    const ySection = width / 9;

    return (
      <SudokuSmallContainer onClick={onClick}>
        <SudokuSmall
          style={{
            height: containerHeight,
            width: containerWidth,
            fontSize,
            lineHeight: 1,
          }}
          >
          <SudokuSmallTitle style={{fontSize: size / 3}}>{id}</SudokuSmallTitle>
          <SmallSudokuGrid width={width} height={height} hideLeftRight />
          {sudoku.map((row, y) => {
            return (
              <div key={y}>
                {row.map((n, x) => {
                  return n !== 0 ? (
                    <div
                      key={x}
                      style={{
                        position: "absolute",
                        left: xSection * (x + 0.5) + "%",
                        top: ySection * (y + 0.5) + "%",
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {n}
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
          {this.props.darken ? <SudokuSmallDarken /> : null}
        </SudokuSmall>
      </SudokuSmallContainer>
    );
  }
}