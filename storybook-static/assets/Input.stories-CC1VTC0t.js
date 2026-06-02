import{n as e}from"./chunk-DnJy8xQt.js";import{a as t,i as n,n as r,s as i,t as a}from"./src-DVatdCl2.js";function o({label:e,hint:t,children:i}){return(0,s.jsxs)(n,{gap:`sm`,children:[(0,s.jsx)(r,{as:`label`,variant:`label`,htmlFor:`input-story-field`,children:e}),i,t?(0,s.jsx)(r,{variant:`caption`,children:t}):null]})}var s,c,l,u,d,f;e((()=>{a(),s=i(),c={title:`Primitives/Input`,component:t,parameters:{layout:`padded`,docs:{description:{component:`Single-line form control primitive. Inputs require an external label in real usage, and validation or help text should be rendered adjacent to the field rather than encoded in the placeholder.`}}},args:{type:`text`,placeholder:`name@example.com`},argTypes:{type:{control:`select`,options:[`text`,`email`,`password`,`search`]}}},l={render:e=>(0,s.jsx)(`div`,{style:{width:`min(24rem, calc(100vw - 3rem))`},children:(0,s.jsx)(o,{label:`Email address`,hint:`Use a persistent label so the field stays understandable after the user types.`,children:(0,s.jsx)(t,{...e,id:`input-story-field`})})})},u={render:()=>(0,s.jsxs)(n,{gap:`md`,children:[(0,s.jsx)(o,{label:`Search`,children:(0,s.jsx)(t,{id:`search-field`,type:`search`,placeholder:`Search accounts`})}),(0,s.jsx)(o,{label:`Email`,children:(0,s.jsx)(t,{id:`email-field`,type:`email`,placeholder:`name@example.com`})}),(0,s.jsx)(o,{label:`Password`,children:(0,s.jsx)(t,{id:`password-field`,type:`password`,placeholder:`Enter password`})})]})},d={parameters:{docs:{description:{story:"The `error` prop only changes presentation. Pair it with adjacent error copy and appropriate validation semantics in the consuming form."}}},render:()=>(0,s.jsxs)(n,{gap:`md`,children:[(0,s.jsx)(o,{label:`Workspace name`,hint:`This name is already in use.`,children:(0,s.jsx)(t,{id:`workspace-field`,error:!0,defaultValue:`ironvale`,"aria-invalid":`true`})}),(0,s.jsx)(o,{label:`Archived field`,hint:`Disabled fields should still be explained when they cannot be edited.`,children:(0,s.jsx)(t,{id:`archived-field`,disabled:!0,defaultValue:`Locked value`})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: 'min(24rem, calc(100vw - 3rem))'
  }}>
      <Field label="Email address" hint="Use a persistent label so the field stays understandable after the user types.">
        <Input {...args} id="input-story-field" />
      </Field>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap="md">
      <Field label="Search">
        <Input id="search-field" type="search" placeholder="Search accounts" />
      </Field>
      <Field label="Email">
        <Input id="email-field" type="email" placeholder="name@example.com" />
      </Field>
      <Field label="Password">
        <Input id="password-field" type="password" placeholder="Enter password" />
      </Field>
    </Stack>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'The \`error\` prop only changes presentation. Pair it with adjacent error copy and appropriate validation semantics in the consuming form.'
      }
    }
  },
  render: () => <Stack gap="md">
      <Field label="Workspace name" hint="This name is already in use.">
        <Input id="workspace-field" error defaultValue="ironvale" aria-invalid="true" />
      </Field>
      <Field label="Archived field" hint="Disabled fields should still be explained when they cannot be edited.">
        <Input id="archived-field" disabled defaultValue="Locked value" />
      </Field>
    </Stack>
}`,...d.parameters?.docs?.source}}},f=[`Default`,`SupportedTypes`,`ErrorAndDisabled`]}))();export{l as Default,d as ErrorAndDisabled,u as SupportedTypes,f as __namedExportsOrder,c as default};