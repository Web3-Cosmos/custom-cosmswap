import { ReactNode, useEffect } from 'react'
import {
  Row,
  Col,
  Tabs,
} from '@/components'
import { useSwap } from '@/hooks/application/swap/useSwap'

export default function Layout(props: {
  children?: ReactNode
}) {

  const swapMode = useSwap(s => s.swapMode)

  useEffect(() => {
    document?.documentElement.classList.remove('dark', 'light')
    document?.documentElement.classList.add('dark')
  }, [])

  return (
    <Col className="w-full min-h-screen bg-stack-1 justify-start items-center py-5">
      <Tabs
        currentValue={swapMode}
        values={['SWAP', 'LIMIT ORDER', 'STOP LOSS']}
        onChange={(newTab) => useSwap.setState({ swapMode: newTab })}
      />

      <div className="mt-5">
        {props.children}
      </div>
    </Col>
  )
}