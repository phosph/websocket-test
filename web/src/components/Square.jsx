import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useSquareState } from '../hooks/useSquareState'

const SquareEl = styled.div`
  outline: 1px solid;
  cursor: pointer;

  &:not(.inactive):not(.selected):hover {
    background-color: #7fffd42f;
  }
  &:not(.inactive):active {
    background-color: #7fffd48f !important;
  }

  &.inactive {
    background-color: #0001;
    cursor: not-allowed;
  }

  &.selected {
    background-color: #7fffd4;
    pointer-events: none;
  }
  &.selected.adversary {
    background-color: #ff7f7f;
  }
`

export const Square = styled(
  observer(function Square({ index, className: pClassName }) {
    const square = useSquareState(index)

    const className = [
      pClassName,
      (square?.inactive || !square) && 'inactive',
      square?.selected && 'selected',
      square?.adversary && 'adversary',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <SquareEl
        data-i={index}
        className={className}
        onClick={square?.selectSquare}
      ></SquareEl>
    )
  }),
)``
