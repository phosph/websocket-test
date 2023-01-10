import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { Modal } from './Modal'

export const EndGameModal = observer(function EndGameModal() {
  const store = useStore()
  if (store.game && !store.game?.started) {
    return (
      <Modal>
        <p>{'esperando un adversario'}</p>
      </Modal>
    )
  }

  if (store.game?.endOfGame) {
    return (
      <Modal autoclose>
        <p>{store.game.win ? 'you win' : 'you lose'}</p>
      </Modal>
    )
  }

  return null
})
