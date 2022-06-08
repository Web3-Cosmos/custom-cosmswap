import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Dialog, { DialogProps } from '@/components/Dialog'

export default {
  title: 'Atom/Dialog',
  component: Dialog,
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
} as ComponentMeta<typeof Dialog>

const Template: Story<DialogProps & { width: number }> = (args) => (
  <Dialog {...args}>
    <div className="text-primary">Dialog</div>
  </Dialog>
)

export const Primary = Template.bind({})

Primary.args = {
  open: true,
}
