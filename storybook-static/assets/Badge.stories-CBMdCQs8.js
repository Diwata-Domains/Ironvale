import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{d as n,h as r,t as i}from"./src-BghEvbO8.js";var a,o,s,c,l,u,d;e((()=>{i(),a=t(),o={title:`Components/Badge`,component:n,parameters:{docs:{description:{component:`Inline label for status, intent, or categorical classification. Intent variants (success/warning/error/neutral/info) communicate system state. Tier variants (sovereign/adept/guild) are Conclave-specific classifications.`}}},args:{variant:`neutral`,children:`Badge`},argTypes:{variant:{control:`select`,options:[`success`,`warning`,`error`,`neutral`,`info`,`sovereign`,`adept`,`guild`]}}},s={},c={name:`Intent variants`,render:()=>(0,a.jsxs)(r,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{variant:`success`,children:`Active`}),(0,a.jsx)(n,{variant:`warning`,children:`Degraded`}),(0,a.jsx)(n,{variant:`error`,children:`Failed`}),(0,a.jsx)(n,{variant:`neutral`,children:`Draft`}),(0,a.jsx)(n,{variant:`info`,children:`Pending`})]})},l={name:`Tier variants (Conclave)`,parameters:{docs:{description:{story:`Used to classify Conclave familiars by tier. Sovereign uses the gold accent, reflecting its elevated status.`}}},render:()=>(0,a.jsxs)(r,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{variant:`sovereign`,children:`Sovereign`}),(0,a.jsx)(n,{variant:`adept`,children:`Adept`}),(0,a.jsx)(n,{variant:`guild`,children:`Guild`})]})},u={name:`All variants`,render:()=>(0,a.jsxs)(r,{gap:`sm`,children:[(0,a.jsxs)(r,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{variant:`success`,children:`success`}),(0,a.jsx)(n,{variant:`warning`,children:`warning`}),(0,a.jsx)(n,{variant:`error`,children:`error`}),(0,a.jsx)(n,{variant:`neutral`,children:`neutral`}),(0,a.jsx)(n,{variant:`info`,children:`info`})]}),(0,a.jsxs)(r,{direction:`horizontal`,gap:`sm`,wrap:!0,children:[(0,a.jsx)(n,{variant:`sovereign`,children:`sovereign`}),(0,a.jsx)(n,{variant:`adept`,children:`adept`}),(0,a.jsx)(n,{variant:`guild`,children:`guild`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Intent variants',
  render: () => <Stack direction="horizontal" gap="sm" wrap>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="info">Pending</Badge>
    </Stack>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Tier variants (Conclave)',
  parameters: {
    docs: {
      description: {
        story: 'Used to classify Conclave familiars by tier. Sovereign uses the gold accent, reflecting its elevated status.'
      }
    }
  },
  render: () => <Stack direction="horizontal" gap="sm" wrap>
      <Badge variant="sovereign">Sovereign</Badge>
      <Badge variant="adept">Adept</Badge>
      <Badge variant="guild">Guild</Badge>
    </Stack>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'All variants',
  render: () => <Stack gap="sm">
      <Stack direction="horizontal" gap="sm" wrap>
        <Badge variant="success">success</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="error">error</Badge>
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="info">info</Badge>
      </Stack>
      <Stack direction="horizontal" gap="sm" wrap>
        <Badge variant="sovereign">sovereign</Badge>
        <Badge variant="adept">adept</Badge>
        <Badge variant="guild">guild</Badge>
      </Stack>
    </Stack>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`IntentVariants`,`TierVariants`,`AllVariants`]}))();export{u as AllVariants,s as Default,c as IntentVariants,l as TierVariants,d as __namedExportsOrder,o as default};