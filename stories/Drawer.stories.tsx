import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Drawer, { DrawerProps } from '@/components/Drawer'

export default {
  title: 'Atom/Drawer',
  component: Drawer,
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
} as ComponentMeta<typeof Drawer>

const Template: Story<DrawerProps & { width: number }> = (args) => (
  <Drawer {...args}>
    <div className="text-primary">Drawer</div>
  </Drawer>
)

export const Primary = Template.bind({})

Primary.args = {
  open: true,
}
