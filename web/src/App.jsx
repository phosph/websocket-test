import './App.css'
import { Board } from './components/Board.jsx'
import { EndGameModal } from './components/EndGameModal.jsx'
import StoreProvider from './store'

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <Board />
        <EndGameModal />
      </StoreProvider>
    </div>
  )
}

export default App
