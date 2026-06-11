import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{_ as n,h as r,n as i,p as a,t as o}from"./src-BghEvbO8.js";var s,c,l,u,d,f,p;e((()=>{o(),s=t(),c={title:`Components/Spinner`,component:i,parameters:{docs:{description:{component:'CSS-only loading indicator. Uses `--ae-color-action-primary` for the spinning segment so it picks up the correct brand colour in every product theme. Always pair with an accessible label — the component renders `role="status"` and `aria-label="Loading"` by default.'}}},args:{size:`md`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},l={},u={render:()=>(0,s.jsxs)(r,{direction:`horizontal`,gap:`lg`,style:{alignItems:`center`},children:[(0,s.jsxs)(r,{gap:`xs`,style:{alignItems:`center`},children:[(0,s.jsx)(i,{size:`sm`}),(0,s.jsx)(a,{variant:`caption`,children:`sm`})]}),(0,s.jsxs)(r,{gap:`xs`,style:{alignItems:`center`},children:[(0,s.jsx)(i,{size:`md`}),(0,s.jsx)(a,{variant:`caption`,children:`md`})]}),(0,s.jsxs)(r,{gap:`xs`,style:{alignItems:`center`},children:[(0,s.jsx)(i,{size:`lg`}),(0,s.jsx)(a,{variant:`caption`,children:`lg`})]})]})},d={name:`In context (loading button)`,render:()=>(0,s.jsxs)(r,{direction:`horizontal`,gap:`sm`,children:[(0,s.jsxs)(n,{disabled:!0,"aria-busy":`true`,children:[(0,s.jsx)(i,{size:`sm`}),`Saving…`]}),(0,s.jsxs)(n,{variant:`ghost`,disabled:!0,"aria-busy":`true`,children:[(0,s.jsx)(i,{size:`sm`}),`Loading`]})]})},f={name:`Full-page loading state`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:12,padding:`48px 0`},children:[(0,s.jsx)(i,{size:`lg`}),(0,s.jsx)(a,{variant:`caption`,children:`Loading familiars…`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="horizontal" gap="lg" style={{
    alignItems: 'center'
  }}>
      <Stack gap="xs" style={{
      alignItems: 'center'
    }}>
        <Spinner size="sm" /><Text variant="caption">sm</Text>
      </Stack>
      <Stack gap="xs" style={{
      alignItems: 'center'
    }}>
        <Spinner size="md" /><Text variant="caption">md</Text>
      </Stack>
      <Stack gap="xs" style={{
      alignItems: 'center'
    }}>
        <Spinner size="lg" /><Text variant="caption">lg</Text>
      </Stack>
    </Stack>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'In context (loading button)',
  render: () => <Stack direction="horizontal" gap="sm">
      <Button disabled aria-busy="true">
        <Spinner size="sm" />
        Saving…
      </Button>
      <Button variant="ghost" disabled aria-busy="true">
        <Spinner size="sm" />
        Loading
      </Button>
    </Stack>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Full-page loading state',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '48px 0'
  }}>
      <Spinner size="lg" />
      <Text variant="caption">Loading familiars…</Text>
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`Sizes`,`InButton`,`FullPageState`]}))();export{l as Default,f as FullPageState,d as InButton,u as Sizes,p as __namedExportsOrder,c as default};