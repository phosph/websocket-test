import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

const ModalContainer = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0004;
  z-index: 10;
  visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  min-width: 600px;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`

export function Modal({ children, open = true, onClose, autoclose = false }) {
  const [_open, _setOpen] = useState(false)

  useEffect(() => _setOpen(open), [open])

  useEffect(() => {
    if (autoclose) {
      const controller = new AbortController()
      document.body.addEventListener(
        'keydown',
        (event) => event.key === 'Escape' && _setOpen(false),
        { passive: true, signal: controller.signal },
      )
      return () => controller.abort()
    }
  }, [autoclose])

  const onClickBase = useCallback(
    (event) => {
      console.log(event, autoclose)
      if (autoclose) _setOpen(false)
      onClose?.()
    },
    [autoclose, onClose],
  )

  return (
    <ModalContainer $open={_open} onClick={onClickBase}>
      <ModalContent onClick={(event) => event.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalContainer>
  )
}
