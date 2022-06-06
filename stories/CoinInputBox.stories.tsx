import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import CoinInputBox, { CoinInputBoxProps } from '@/components/CoinInputBox'

export default {
  title: 'Atom/CoinInputBox',
  component: CoinInputBox,
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
} as ComponentMeta<typeof CoinInputBox>

const Template: Story<CoinInputBoxProps & { width: number }> = (args) => (
  <div className="w-full">
    <CoinInputBox {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  topLeftLabel: 'Swap:',
  canSelect: true,
  haveHalfButton: true,
}