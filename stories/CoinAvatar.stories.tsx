import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import CoinAvatar, { CoinAvatarProps } from '@/components/CoinAvatar'

export default {
  title: 'Components/CoinAvatar',
  component: CoinAvatar,
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
} as ComponentMeta<typeof CoinAvatar>

const Template: Story<CoinAvatarProps & { width: number }> = (args) => (
  <div className="w-full bg-gray-700 p-5">
    <CoinAvatar {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  src: "/coins/dollar.svg",
  onClick: () => null,
}
