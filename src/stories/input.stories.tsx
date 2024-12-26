import type { Meta, StoryFn } from "@storybook/react";

import { Input } from "..";

export default {
	title: "Input",
	component: Input,
	argTypes: {},
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});

Default.args = {};
