import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Row, Col, Tabs, Link, Image, WalletWidget, Grid } from '@/components'
import { useSwap } from '@/hooks/application/swap/useSwap'

export default function Layout(props: { children?: ReactNode }) {
  const swapMode = useSwap((s) => s.swapMode)

  const router = useRouter()

  useEffect(() => {
    document?.documentElement.classList.remove('dark', 'light')
    document?.documentElement.classList.add('dark')

    switch (router.pathname) {
      case '/limit-order':
        useSwap.setState({ swapMode: 'LIMIT ORDER' })
        break
      case '/stop-loss':
        useSwap.setState({ swapMode: 'STOP LOSS' })
        break
      case '/transfer':
        useSwap.setState({ swapMode: 'TRANSFER' })
        break
      case '/liquidity':
        useSwap.setState({ swapMode: 'LIQUIDITY' })
        break
    }
  }, [router.pathname])

  return (
    <Col className="w-full min-h-screen bg-stack-1 justify-start items-center py-5">
      <Row className="w-full flex flex-row items-center fixed inset-x-0 top-0 p-5 bg-stack-1 z-50 border-b border-stack-2">
        <Link className="flex-1" href="/">
          <Image
            className="cursor-pointer"
            src="/logo/logo-only-icon.svg"
            alt="logo"
          />
        </Link>

        <Row className="inline-flex justify-center">
          <Tabs
            currentValue={swapMode}
            values={[
              'SWAP',
              'TRANSFER',
              'LIQUIDITY',
              'LIMIT ORDER',
              'STOP LOSS',
            ]}
            onChange={(newTab) => {
              if (newTab === 'SWAP') router.push('/')
              else router.push(`/${newTab.replace(' ', '-').toLowerCase()}`)
              useSwap.setState({ swapMode: newTab })
            }}
          />
        </Row>

        <Row className="flex-1 justify-end">
          <WalletWidget />
        </Row>
      </Row>

      <div className="mt-20">{props.children}</div>
    </Col>
  )
}
