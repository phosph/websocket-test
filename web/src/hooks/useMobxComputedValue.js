import { useState } from 'react'
import useAutorun from './useAutorun'

export const useMobxComputedValue = (callback, initialValue = null) => {
  const [value, setValue] = useState(initialValue)
  useAutorun(() => setValue(callback()))
  return value
}
