import { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { CoinAvatar, Row, Col, Icon } from '@/components'
import {
  ibcWalletState,
  walletState,
} from '@/hooks/application/atoms/walletAtoms'
import { APP_NAME } from '@/util/constants'

export const WalletInfo = ({
  label,
  icon,
  address,
  className,
}: {
  label: string
  icon: ReactNode
  address: string
  className?: string
}) => {
  return (
    <Row className={className}>
      {icon}
      <Col className="ml-4">
        <div className="text-primary text-sm mb-1">{label}</div>
        <Row>
          <Icon
            className="text-secondary mr-2"
            size="sm"
            heroIconName="information-circle"
          />
          <div className="text-secondary text-xs">
            {address || "address wasn't identified yet"}
          </div>
        </Row>
      </Col>
    </Row>
  )
}

type WalletInfoProps = {
  className?: string
  depositing?: boolean
}

export const KeplrWalletInfo = ({ className, depositing }: WalletInfoProps) => {
  const { address: ibcWalletAddress } = useRecoilValue(ibcWalletState)

  return (
    <WalletInfo
      className={className}
      label={`${depositing ? 'To ' : ''}Keplr Wallet`}
      icon={<CoinAvatar size="md" src="/wallets/keplr-icon.png" />}
      address={ibcWalletAddress}
    />
  )
}

export const AppWalletInfo = ({ className, depositing }: WalletInfoProps) => {
  const { address: walletAddress } = useRecoilValue(walletState)

  return (
    <WalletInfo
      className={className}
      label={`${depositing ? 'To ' : ''}${APP_NAME}`}
      icon={<CoinAvatar size="md" />}
      address={walletAddress}
    />
  )
}
