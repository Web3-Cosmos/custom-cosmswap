import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import { Row, Col, Icon, Tooltip, TooltipProps } from '@/components'

export default {
  title: 'Atom/Tooltip',
  component: Tooltip,
  argTypes: {
    width: {
      control: { type: 'range', min: 420, max: 1600, step: 50 },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Vy0NbZMTj6yq3b7vBWMezV/Wasted-Talent-rebrand?node-id=846%3A64209',
    },
  },
} as ComponentMeta<typeof Tooltip>

const Template: Story<TooltipProps & { width: number }> = (args) => (
  <div className="bg-gray-700 px-5">
    <div className="h-20" />
    <Tooltip {...args}>
      <Icon size="lg" heroIconName="exclamation-circle" className="text-default" />
    </Tooltip>
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  tooltip: (
    <Col className="w-full">
      <Row className="justify-between">
        <div className="text-sm text-primary">Placed:</div>
        <div className="text-sm text-primary font-bold">July 9th, 2022 UTC</div>
      </Row>
      <Row className="justify-between">
        <div className="text-sm text-primary">Required BANANA/BNB change:</div>
        <div className="text-sm text-primary font-bold">7.99%</div>
      </Row>
    </Col>
  )
}
