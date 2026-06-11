import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{h as n,m as r,p as i,t as a}from"./src-BghEvbO8.js";function o({label:e}){return(0,s.jsx)(r,{style:{minWidth:`10rem`},children:(0,s.jsx)(i,{variant:`label`,children:e})})}var s,c,l,u,d,f;e((()=>{a(),s=t(),c={title:`Primitives/Stack`,component:n,parameters:{layout:`padded`,docs:{description:{component:`Layout primitive for vertical and horizontal spacing. Use Stack to express rhythm and grouping instead of ad hoc margin rules, and preserve DOM order so keyboard and screen-reader traversal remain predictable.`}}},args:{gap:`md`,direction:`vertical`,wrap:!1},argTypes:{direction:{control:`inline-radio`,options:[`vertical`,`horizontal`]},gap:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},l={render:e=>(0,s.jsxs)(n,{...e,children:[(0,s.jsx)(o,{label:`First item`}),(0,s.jsx)(o,{label:`Second item`}),(0,s.jsx)(o,{label:`Third item`})]})},u={args:{direction:`horizontal`},render:e=>(0,s.jsxs)(n,{...e,children:[(0,s.jsx)(o,{label:`Filter`}),(0,s.jsx)(o,{label:`Sort`}),(0,s.jsx)(o,{label:`Export`})]})},d={args:{direction:`horizontal`,wrap:!0},parameters:{docs:{description:{story:`Enable wrapping for horizontal groups that need to survive narrow viewports without collapsing order or relying on one-off responsive overrides.`}}},render:e=>(0,s.jsx)(`div`,{style:{maxWidth:`24rem`},children:(0,s.jsxs)(n,{...e,children:[(0,s.jsx)(o,{label:`Alpha`}),(0,s.jsx)(o,{label:`Beta`}),(0,s.jsx)(o,{label:`Gamma`}),(0,s.jsx)(o,{label:`Delta`})]})})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Stack {...args}>
      <ExampleCard label="First item" />
      <ExampleCard label="Second item" />
      <ExampleCard label="Third item" />
    </Stack>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    direction: 'horizontal'
  },
  render: args => <Stack {...args}>
      <ExampleCard label="Filter" />
      <ExampleCard label="Sort" />
      <ExampleCard label="Export" />
    </Stack>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    direction: 'horizontal',
    wrap: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Enable wrapping for horizontal groups that need to survive narrow viewports without collapsing order or relying on one-off responsive overrides.'
      }
    }
  },
  render: args => <div style={{
    maxWidth: '24rem'
  }}>
      <Stack {...args}>
        <ExampleCard label="Alpha" />
        <ExampleCard label="Beta" />
        <ExampleCard label="Gamma" />
        <ExampleCard label="Delta" />
      </Stack>
    </div>
}`,...d.parameters?.docs?.source}}},f=[`Default`,`Horizontal`,`Wrapping`]}))();export{l as Default,u as Horizontal,d as Wrapping,f as __namedExportsOrder,c as default};