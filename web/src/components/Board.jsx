import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useStore } from '../store'
import { Square } from './Square.jsx'
import styled from 'styled-components'

const StargGameButton = styled.button`
  border: none;
  padding: 0.5rem;
  border-radius: 8px;

  &[disabled] {
    cursor: not-allowed;
  }
`

const BoardEl = styled.section`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(7, 1fr);
  min-width: 70px;
  min-height: 70px;
  max-width: 800px;
  max-height: 800px;
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  padding-left: 2rem;
  padding-top: 2rem;
  counter-reset: row column;

  ${Square} {
    :nth-child(7n + 1) {
      position: relative;
    }
    :nth-child(7n + 1)::before {
      counter-increment: row;
      content: counter(row);
      position: absolute;
      left: -0.75rem;
      top: 50%;
      transform: translateY(-50%);
    }
    :nth-child(-n + 7) {
      position: relative;
    }
    :nth-child(-n + 7)::after {
      counter-increment: column;
      content: counter(column, lower-alpha);
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translate(-50%, -100%);
    }
  }
`

export const Board = observer(() => {
  const store = useStore()

  const squares = useMemo(() => {
    const list = []

    for (let index = 0; index < 49; index++) {
      list.push(<Square key={`square-${index}`} index={index} />)
    }

    return list
  }, [])

  return (
    <>
      <StargGameButton
        type="button"
        onClick={() => store.startGame()}
        disabled={!!store.game?._started && !store.game?.endOfGame}
      >
        Start new Game
      </StargGameButton>
      <section
        className="turn-indicator"
        data-turn={store.game?.lockUi ? 'adversary' : 'self'}
      >
        <p className="your-turn-indicator">your turn</p>
        <p className="adversary-turn-indicator">adversary turn</p>
      </section>
      <BoardEl className="board">{squares}</BoardEl>
    </>
  )
})
