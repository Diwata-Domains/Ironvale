import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{f as n,h as r,p as i,t as a}from"./src-BghEvbO8.js";var o,s,c,l,u,d;e((()=>{a(),o=t(),s={title:`Components/Card`,component:n,parameters:{docs:{description:{component:"Container for grouping related content on a themed surface. `base` is the default depth — use `raised` to lift content in a list or grid, `flush` when you own the inner padding."}}},args:{variant:`base`},argTypes:{variant:{control:`inline-radio`,options:[`base`,`raised`,`flush`]}}},c={args:{children:`Card content goes here.`}},l={render:()=>(0,o.jsxs)(r,{gap:`md`,style:{width:`min(28rem, 100%)`},children:[(0,o.jsxs)(n,{variant:`base`,children:[(0,o.jsx)(i,{variant:`label`,style:{display:`block`,marginBottom:4},children:`Base`}),(0,o.jsx)(i,{variant:`body`,children:`Default surface — use for most content blocks.`})]}),(0,o.jsxs)(n,{variant:`raised`,children:[(0,o.jsx)(i,{variant:`label`,style:{display:`block`,marginBottom:4},children:`Raised`}),(0,o.jsx)(i,{variant:`body`,children:`Elevated surface — use in grids or to highlight key cards.`})]}),(0,o.jsx)(n,{variant:`flush`,children:(0,o.jsxs)(`div`,{style:{padding:`16px`,background:`var(--ae-color-bg-muted)`,borderRadius:`var(--ae-radius-md)`},children:[(0,o.jsx)(i,{variant:`label`,style:{display:`block`,marginBottom:4},children:`Flush`}),(0,o.jsx)(i,{variant:`body`,children:`No padding — you control the inner layout.`})]})})]})},u={render:()=>(0,o.jsxs)(n,{style:{width:`min(28rem, 100%)`},children:[(0,o.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:12},children:(0,o.jsxs)(`div`,{children:[(0,o.jsx)(i,{as:`h3`,variant:`heading`,children:`Familiar Registry`}),(0,o.jsx)(i,{variant:`caption`,style:{marginTop:2},children:`3 familiars active`})]})}),(0,o.jsx)(i,{variant:`body`,children:`Cards can contain any mix of heading, body copy, badges, actions, or other components. All spacing derives from Aether semantic tokens.`})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Card content goes here.'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap="md" style={{
    width: 'min(28rem, 100%)'
  }}>
      <Card variant="base">
        <Text variant="label" style={{
        display: 'block',
        marginBottom: 4
      }}>Base</Text>
        <Text variant="body">Default surface — use for most content blocks.</Text>
      </Card>
      <Card variant="raised">
        <Text variant="label" style={{
        display: 'block',
        marginBottom: 4
      }}>Raised</Text>
        <Text variant="body">Elevated surface — use in grids or to highlight key cards.</Text>
      </Card>
      <Card variant="flush">
        <div style={{
        padding: '16px',
        background: 'var(--ae-color-bg-muted)',
        borderRadius: 'var(--ae-radius-md)'
      }}>
          <Text variant="label" style={{
          display: 'block',
          marginBottom: 4
        }}>Flush</Text>
          <Text variant="body">No padding — you control the inner layout.</Text>
        </div>
      </Card>
    </Stack>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: 'min(28rem, 100%)'
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12
    }}>
        <div>
          <Text as="h3" variant="heading">Familiar Registry</Text>
          <Text variant="caption" style={{
          marginTop: 2
        }}>3 familiars active</Text>
        </div>
      </div>
      <Text variant="body">
        Cards can contain any mix of heading, body copy, badges, actions, or other components.
        All spacing derives from Aether semantic tokens.
      </Text>
    </Card>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Variants`,`WithHeader`]}))();export{c as Default,l as Variants,u as WithHeader,d as __namedExportsOrder,s as default};