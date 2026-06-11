import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{h as n,l as r,p as i,t as a}from"./src-BghEvbO8.js";var o,s,c,l,u,d,f,p;e((()=>{a(),o=t(),s={title:`Components/StatusDot`,component:r,parameters:{docs:{description:{component:"Small indicator for health or presence status. Colour maps directly to feedback tokens so it responds correctly to any product theme. Use `pulse` for live or actively-changing state."}}},args:{color:`green`,size:`md`,pulse:!1},argTypes:{color:{control:`inline-radio`,options:[`green`,`yellow`,`red`,`grey`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},pulse:{control:`boolean`}}},c={},l={render:()=>(0,o.jsxs)(n,{direction:`horizontal`,gap:`md`,children:[(0,o.jsxs)(n,{direction:`horizontal`,gap:`sm`,style:{alignItems:`center`},children:[(0,o.jsx)(r,{color:`green`}),(0,o.jsx)(i,{variant:`label`,children:`healthy`})]}),(0,o.jsxs)(n,{direction:`horizontal`,gap:`sm`,style:{alignItems:`center`},children:[(0,o.jsx)(r,{color:`yellow`}),(0,o.jsx)(i,{variant:`label`,children:`degraded`})]}),(0,o.jsxs)(n,{direction:`horizontal`,gap:`sm`,style:{alignItems:`center`},children:[(0,o.jsx)(r,{color:`red`}),(0,o.jsx)(i,{variant:`label`,children:`unreachable`})]}),(0,o.jsxs)(n,{direction:`horizontal`,gap:`sm`,style:{alignItems:`center`},children:[(0,o.jsx)(r,{color:`grey`}),(0,o.jsx)(i,{variant:`label`,children:`unknown`})]})]})},u={render:()=>(0,o.jsxs)(n,{direction:`horizontal`,gap:`md`,style:{alignItems:`center`},children:[(0,o.jsx)(r,{color:`green`,size:`sm`}),(0,o.jsx)(r,{color:`green`,size:`md`}),(0,o.jsx)(r,{color:`green`,size:`lg`})]})},d={args:{color:`green`,pulse:!0},parameters:{docs:{description:{story:"Use `pulse` to indicate a live connection or actively-updating state."}}}},f={name:`In context (service row)`,render:()=>(0,o.jsx)(`div`,{style:{width:`min(24rem, 100%)`,display:`flex`,flexDirection:`column`,gap:0},children:[{name:`DAEMON`,url:`localhost:8001`,ok:!0},{name:`Conclave`,url:`localhost:8002`,ok:!0},{name:`Assay`,url:`localhost:8000`,ok:!1},{name:`Lore`,url:`localhost:8003`,ok:!1}].map(e=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`8px 0`,borderBottom:`var(--ae-border-width) solid var(--ae-color-border)`},children:[(0,o.jsx)(r,{color:e.ok?`green`:`red`}),(0,o.jsx)(i,{variant:`label`,style:{flex:1},children:e.name}),(0,o.jsx)(i,{variant:`caption`,style:{fontFamily:`monospace`},children:e.url})]},e.name))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="horizontal" gap="md">
      <Stack direction="horizontal" gap="sm" style={{
      alignItems: 'center'
    }}>
        <StatusDot color="green" /><Text variant="label">healthy</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{
      alignItems: 'center'
    }}>
        <StatusDot color="yellow" /><Text variant="label">degraded</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{
      alignItems: 'center'
    }}>
        <StatusDot color="red" /><Text variant="label">unreachable</Text>
      </Stack>
      <Stack direction="horizontal" gap="sm" style={{
      alignItems: 'center'
    }}>
        <StatusDot color="grey" /><Text variant="label">unknown</Text>
      </Stack>
    </Stack>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="horizontal" gap="md" style={{
    alignItems: 'center'
  }}>
      <StatusDot color="green" size="sm" />
      <StatusDot color="green" size="md" />
      <StatusDot color="green" size="lg" />
    </Stack>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    color: 'green',
    pulse: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Use \`pulse\` to indicate a live connection or actively-updating state.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'In context (service row)',
  render: () => <div style={{
    width: 'min(24rem, 100%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0
  }}>
      {[{
      name: 'DAEMON',
      url: 'localhost:8001',
      ok: true
    }, {
      name: 'Conclave',
      url: 'localhost:8002',
      ok: true
    }, {
      name: 'Assay',
      url: 'localhost:8000',
      ok: false
    }, {
      name: 'Lore',
      url: 'localhost:8003',
      ok: false
    }].map(s => <div key={s.name} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderBottom: 'var(--ae-border-width) solid var(--ae-color-border)'
    }}>
          <StatusDot color={s.ok ? 'green' : 'red'} />
          <Text variant="label" style={{
        flex: 1
      }}>{s.name}</Text>
          <Text variant="caption" style={{
        fontFamily: 'monospace'
      }}>{s.url}</Text>
        </div>)}
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`Colors`,`Sizes`,`Pulse`,`InContext`]}))();export{l as Colors,c as Default,f as InContext,d as Pulse,u as Sizes,p as __namedExportsOrder,s as default};