import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import {
  Grid,
  GridProps,
  ArrowDownIcon,
  WalletConnectedIcon,
  WalletIcon,
} from '@/components'

export default {
  title: 'Atom/Grid',
  component: Grid,
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
} as ComponentMeta<typeof ArrowDownIcon>

const Template: Story<GridProps & { width: number }> = (args) => (
  <div className="w-full bg-gray-700 p-5">
    <Grid {...args}>
      <Grid {...args}>
        <ArrowDownIcon size="md" color="#ffffff" />
        <WalletIcon size="md" color="#ffffff" />
        <WalletConnectedIcon size="md" color="#ffffff" />
      </Grid>
    </Grid>
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  className: 'w-full h-full text-center grid-cols-4 gap-x-3 gap-y-1',
}
