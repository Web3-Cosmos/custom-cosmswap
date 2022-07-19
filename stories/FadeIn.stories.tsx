import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import {
  FadeInStable,
  Grid,
  ArrowDownIcon,
  WalletConnectedIcon,
  WalletIcon,
} from '@/components'

export default {
  title: 'Atom/FadeIn',
  component: FadeInStable,
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
} as ComponentMeta<typeof FadeInStable>

const Template: Story<{ show: boolean; width: number }> = ({ show }) => (
  <div className="w-full bg-gray-700 p-5">
    <FadeInStable show={show}>
      <div className="overflow-auto no-native-scrollbar h-full" style={{ scrollbarGutter: 'always' }}>
        <Grid className="flex-1 px-8 justify-items-stretch mobile:px-6 pb-4 overflow-auto gap-x-6 gap-y-3 mobile:gap-2 grid-cols-3 mobile:grid-cols-[1fr,1fr,1fr]">
          <ArrowDownIcon size="md" color="#ffffff" />
          <WalletIcon size="md" color="#ffffff" />
          <WalletConnectedIcon size="md" color="#ffffff" />
        </Grid>
      </div>
    </FadeInStable>
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  show: true,
}
