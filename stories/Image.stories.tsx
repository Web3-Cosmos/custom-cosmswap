import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Image, { ImageProps } from '@/components/Image'

export default {
  title: 'Atom/Image',
  component: Image,
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
} as ComponentMeta<typeof Image>

const Template: Story<ImageProps & { width: number }> = (args) => (
  <div className="bg-stack-4 p-5">
    <Image {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  className: 'overflow-hidden transition-transform transform',
  src: '/backgrounds/dropzone-placeholder.webp',
  fallbackSrc: 'backgrounds/home-bg-element-2.webp',
}
