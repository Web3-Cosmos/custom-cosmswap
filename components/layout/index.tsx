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

    if (router.pathname === '/limit-order')
      useSwap.setState({ swapMode: 'LIMIT ORDER' })
    if (router.pathname === '/stop-loss')
      useSwap.setState({ swapMode: 'STOP LOSS' })
  }, [router.pathname])

  return (
    <Col className="w-full min-h-screen bg-stack-1 justify-start items-center py-5">
      <Grid className="w-full grid-cols-3 justify-between items-center fixed inset-x-0 top-0 p-5 bg-stack-1 z-50 border-b border-stack-2">
        <Link href="/">
          <Image
            className="cursor-pointer"
            src="/logo/logo-only-icon.svg"
            alt="logo"
          />
        </Link>

        <Row className="inline-flex justify-center">
          <Tabs
            currentValue={swapMode}
            values={['SWAP', 'LIMIT ORDER', 'STOP LOSS']}
            onChange={(newTab) => {
              if (newTab === 'SWAP') router.push('/')
              else router.push(`/${newTab.replace(' ', '-').toLowerCase()}`)
              useSwap.setState({ swapMode: newTab })
            }}
          />
        </Row>

        <WalletWidget />
      </Grid>

      <div className="mt-20">{props.children}</div>
    </Col>
  )
}
