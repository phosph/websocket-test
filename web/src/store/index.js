import { createContext, useContext, useState } from 'react'
import Store from './Store'

export const StoreContext = createContext(null)

/** @returns {Store} */
export const useStore = () => {
  const store = useContext(StoreContext)
  if (store === null) {
    throw new Error('useStore must be used in StoreContext children')
  }
  return store
}

const StoreProvider = ({ children }) => {
  const [store] = useState(() => new Store())

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default StoreProvider
