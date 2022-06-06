import type { NextPage } from 'next'
import Layout from '../components/layout'
import { CoinAvatar } from '@/components'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-primary">Hello Yes.</h1>
      <CoinAvatar />
    </Layout>
  )
}

export default Home
