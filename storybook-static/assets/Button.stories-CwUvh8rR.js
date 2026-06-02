import{n as e}from"./chunk-DnJy8xQt.js";import{i as t,o as n,s as r,t as i}from"./src-DVatdCl2.js";var a,o,s,c,l,u,d;e((()=>{i(),a=r(),o={title:`Primitives/Button`,component:n,parameters:{docs:{description:{component:"Presentation-only button primitive. Use the native `button` element for actions, keep visible button text concise, and prefer `disabled` only when the action is truly unavailable."}}},args:{children:`Save changes`,variant:`primary`,size:`md`},argTypes:{variant:{control:`inline-radio`,options:[`primary`,`ghost`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},s={},c={render:e=>(0,a.jsxs)(t,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{...e,variant:`primary`,children:`Primary action`}),(0,a.jsx)(n,{...e,variant:`ghost`,children:`Secondary action`}),(0,a.jsx)(n,{...e,variant:`danger`,children:`Delete record`})]})},l={render:e=>(0,a.jsxs)(t,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{...e,size:`sm`,children:`Small`}),(0,a.jsx)(n,{...e,size:`md`,children:`Medium`}),(0,a.jsx)(n,{...e,size:`lg`,children:`Large`})]})},u={parameters:{docs:{description:{story:'Use `aria-busy="true"` when work is in progress and the label still describes the pending action. Disabled buttons should remain rare and still be paired with nearby explanatory text in product UIs.'}}},render:e=>(0,a.jsxs)(t,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{...e,disabled:!0,children:`Disabled`}),(0,a.jsx)(n,{...e,"aria-busy":`true`,children:`Saving...`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} variant="primary">
        Primary action
      </Button>
      <Button {...args} variant="ghost">
        Secondary action
      </Button>
      <Button {...args} variant="danger">
        Delete record
      </Button>
    </Stack>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </Stack>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Use \`aria-busy="true"\` when work is in progress and the label still describes the pending action. Disabled buttons should remain rare and still be paired with nearby explanatory text in product UIs.'
      }
    }
  },
  render: args => <Stack direction="horizontal" gap="sm" wrap>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} aria-busy="true">
        Saving...
      </Button>
    </Stack>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Variants`,`Sizes`,`DisabledAndBusy`]}))();export{s as Default,u as DisabledAndBusy,l as Sizes,c as Variants,d as __namedExportsOrder,o as default};