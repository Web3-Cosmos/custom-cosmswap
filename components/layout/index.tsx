import { ReactNode, useEffect } from 'react'
import {
  Row,
  Col,
  Tabs,
  Link,
  Image,
  WalletWidget,
  Grid,
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
    <Col className="w-full min-h-screen bg-stack-1 justify-start items-center p-5">
      <Grid className="w-full grid-cols-3 justify-between items-center">
        <Link href="/">
          <Image className="cursor-pointer" src="/logo/logo-only-icon.svg" />
        </Link>

        <Row className="inline-flex justify-center">
          <Tabs
            currentValue={swapMode}
            values={['SWAP', 'LIMIT ORDER', 'STOP LOSS']}
            onChange={(newTab) => useSwap.setState({ swapMode: newTab })}
          />
        </Row>

        <WalletWidget />
      </Grid>

      <div className="mt-5">
        {props.children}
      </div>
    </Col>
  )
}