import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Input, { InputProps } from '@/components/Input'

export default {
  title: 'Atom/Input',
  component: Input,
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
} as ComponentMeta<typeof Input>

const Template: Story<InputProps & { width: number }> = (args) => (
  <div className="bg-stack-4 p-5">
    <Input {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  className: 'font-extrabold text-lg text-primary flex-grow h-full',
  type: 'number',
  value: '237',
  inputClassName: 'text-left mobile:text-sm font-bold',
  disabled: false,
}
