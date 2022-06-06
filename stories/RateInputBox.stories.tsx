import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import RateInputBox, { RateInputBoxProps } from '@/components/RateInputBox'

export default {
  title: 'Atom/RateInputBox',
  component: RateInputBox,
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
} as ComponentMeta<typeof RateInputBox>

const Template: Story<RateInputBoxProps & { width: number }> = (args) => (
  <div className="w-full">
    <RateInputBox {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
}