import React from 'react'

import { Card, Row, Icon, ResponsiveDialogDrawer } from '@/components'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

export default function TestnetDialog() {
  const { isTestnet } = useAppSettings()

  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={isTestnet}
      onClose={() => useAppSettings.setState({ isTestnet: false })}
    >
      {({ close: closePanel }) => (
        <TestnetDialogContent
          open={isTestnet}
          close={() => useAppSettings.setState({ isTestnet: false })}
        />
      )}
    </ResponsiveDialogDrawer>
  )
}

function TestnetDialogContent({
  open,
  close: closePanel,
}: {
  open: boolean
  close: () => void
}) {
  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-[min(250px,100vh)] mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <div className="px-8 mobile:px-6 pt-6">
        <Row className="justify-between items-center mb-6">
          <div className="text-xl font-semibold text-secondary">Testnet</div>
          <Icon
            className="text-primary cursor-pointer clickable clickable-mask-offset-2"
            heroIconName="x"
            onClick={closePanel}
          />
        </Row>
      </div>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4"></div>

      <div className="text-md font-medium text-primary my-auto px-8 mobile:px-6">
        This app is currently in beta and operating in demo mode. The app serves
        only the presentation and testing purposes. You will not be able to
        trade real assets.
      </div>
    </Card>
  )
}
