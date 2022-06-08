import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Badge, { BadgeProps } from '@/components/Badge'

export default {
  title: 'Atom/Badge',
  component: Badge,
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
} as ComponentMeta<typeof Badge>

const Template: Story<BadgeProps & { width: number }> = (args) => (
  <div className="w-full bg-stack-1 p-5">
    <Badge {...args}>
      Badge
    </Badge>
  </div>
)

export const Primary = Template.bind({})
