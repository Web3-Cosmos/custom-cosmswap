import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import TokenSelectDialog from '@/components/dialogs/TokenSelectDialog'

export default {
  title: 'Components/TokenSelectDialog',
  component: TokenSelectDialog,
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
} as ComponentMeta<typeof TokenSelectDialog>

const Template: Story<{ open: boolean }> = (args) => (
  <TokenSelectDialog {...args} />
)

export const Primary = Template.bind({})

Primary.args = {
  open: true,
}
