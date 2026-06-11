import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{h as n,p as r,t as i}from"./src-BghEvbO8.js";var a,o,s,c,l,u;e((()=>{i(),a=t(),o={title:`Primitives/Text`,component:r,parameters:{layout:`padded`,docs:{description:{component:"Typography primitive for body copy, labels, headings, and captions. Choose the variant for visual treatment and the `as` prop for semantic HTML so document structure and form labeling stay correct."}}},args:{children:`Body copy communicates the default reading style for Ironvale.`},argTypes:{variant:{control:`inline-radio`,options:[`body`,`label`,`heading`,`caption`]},as:{control:`select`,options:[`p`,`span`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`label`]}}},s={args:{variant:`body`,as:`p`}},c={render:()=>(0,a.jsxs)(n,{gap:`sm`,children:[(0,a.jsx)(r,{as:`h2`,variant:`heading`,children:`Heading variant`}),(0,a.jsx)(r,{variant:`body`,children:`Body variant is the default for longer text and general interface copy.`}),(0,a.jsx)(r,{as:`label`,variant:`label`,htmlFor:`text-story-field`,children:`Label variant`}),(0,a.jsx)(r,{variant:`caption`,children:`Caption variant supports secondary or supporting text.`})]})},l={parameters:{docs:{description:{story:"Keep semantic structure separate from styling. For example, a heading may render as `h2` or `h3` depending on page outline, while a label should render as `label` and point to its form control with `htmlFor`."}}},render:()=>(0,a.jsxs)(n,{gap:`sm`,children:[(0,a.jsx)(r,{as:`h1`,variant:`heading`,children:`Page title`}),(0,a.jsx)(r,{as:`h2`,variant:`heading`,children:`Section title`}),(0,a.jsx)(r,{as:`span`,variant:`caption`,children:`Inline supporting metadata`}),(0,a.jsx)(r,{as:`label`,variant:`label`,htmlFor:`text-story-field`,children:`Email address`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'body',
    as: 'p'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap="sm">
      <Text as="h2" variant="heading">
        Heading variant
      </Text>
      <Text variant="body">
        Body variant is the default for longer text and general interface copy.
      </Text>
      <Text as="label" variant="label" htmlFor="text-story-field">
        Label variant
      </Text>
      <Text variant="caption">Caption variant supports secondary or supporting text.</Text>
    </Stack>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Keep semantic structure separate from styling. For example, a heading may render as \`h2\` or \`h3\` depending on page outline, while a label should render as \`label\` and point to its form control with \`htmlFor\`.'
      }
    }
  },
  render: () => <Stack gap="sm">
      <Text as="h1" variant="heading">
        Page title
      </Text>
      <Text as="h2" variant="heading">
        Section title
      </Text>
      <Text as="span" variant="caption">
        Inline supporting metadata
      </Text>
      <Text as="label" variant="label" htmlFor="text-story-field">
        Email address
      </Text>
    </Stack>
}`,...l.parameters?.docs?.source}}},u=[`Default`,`Variants`,`SemanticElements`]}))();export{s as Default,l as SemanticElements,c as Variants,u as __namedExportsOrder,o as default};