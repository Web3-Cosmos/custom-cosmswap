import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import RequestHistory, {
  RequestHistoryProps,
} from '@/components/TransactionHistory'

export default {
  title: 'Components/RequestHistory',
  component: RequestHistory,
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
} as ComponentMeta<typeof RequestHistory>

const Template: Story<RequestHistoryProps & { width: number }> = (args) => (
  <div className="w-full bg-gray-700 p-5">
    <div className="h-20" />
    <RequestHistory {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  open: 'open',
  onClick: (open) => console.log(open),
}
