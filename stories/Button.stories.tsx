import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Button, { ButtonProps } from '@/components/Button'

export default {
  title: 'Atom/Button',
  component: Button,
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
} as ComponentMeta<typeof Button>

const Template: Story<ButtonProps & { width: number }> = (args) => (
  <div className="w-full bg-gray-700">
    <Button {...args}>
      Button
    </Button>
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  onClick: (val) => console.log(val)
}
