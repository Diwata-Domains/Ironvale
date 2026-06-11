import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{h as n,t as r,u as i}from"./src-BghEvbO8.js";var a,o,s,c,l,u,d,f,p,m;e((()=>{r(),a=t(),o=()=>(0,a.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 16 16`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,a.jsx)(`rect`,{x:`1`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,a.jsx)(`rect`,{x:`9`,y:`1`,width:`6`,height:`6`,rx:`1`}),(0,a.jsx)(`rect`,{x:`1`,y:`9`,width:`6`,height:`6`,rx:`1`}),(0,a.jsx)(`rect`,{x:`9`,y:`9`,width:`6`,height:`6`,rx:`1`})]}),s=()=>(0,a.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 16 16`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,a.jsx)(`circle`,{cx:`8`,cy:`8`,r:`6`}),(0,a.jsx)(`circle`,{cx:`8`,cy:`8`,r:`2`})]}),c=()=>(0,a.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 16 16`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,a.jsx)(`circle`,{cx:`8`,cy:`8`,r:`2.5`}),(0,a.jsx)(`path`,{d:`M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4`})]}),l={title:`Components/NavItem`,component:i,parameters:{docs:{description:{component:"Navigation link used inside app sidebars. Renders as an `<a>` — pair with your router's link component or `NavLink` by applying `iv-nav-item` and `iv-nav-item--active` CSS classes directly."}}},args:{label:`Dashboard`,active:!1},argTypes:{active:{control:`boolean`}}},u={},d={args:{active:!0}},f={args:{label:`Familiars`,icon:(0,a.jsx)(o,{})}},p={name:`Nav group (sidebar)`,parameters:{docs:{description:{story:"Typical sidebar usage — one active item, rest idle. Active state uses `--ae-color-action-primary` which resolves to product-theme crimson (Conclave) or gold (DAEMON)."}}},render:()=>(0,a.jsx)(`div`,{style:{width:180,background:`var(--ae-color-bg-subtle)`,padding:`8px`,borderRadius:`var(--ae-radius-lg)`},children:(0,a.jsxs)(n,{gap:`xs`,children:[(0,a.jsx)(i,{label:`Familiars`,icon:(0,a.jsx)(o,{}),active:!0}),(0,a.jsx)(i,{label:`Circles`,icon:(0,a.jsx)(s,{})}),(0,a.jsx)(i,{label:`Settings`,icon:(0,a.jsx)(c,{})})]})})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Familiars',
    icon: <GridIcon />
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Nav group (sidebar)',
  parameters: {
    docs: {
      description: {
        story: 'Typical sidebar usage — one active item, rest idle. Active state uses \`--ae-color-action-primary\` which resolves to product-theme crimson (Conclave) or gold (DAEMON).'
      }
    }
  },
  render: () => <div style={{
    width: 180,
    background: 'var(--ae-color-bg-subtle)',
    padding: '8px',
    borderRadius: 'var(--ae-radius-lg)'
  }}>
      <Stack gap="xs">
        <NavItem label="Familiars" icon={<GridIcon />} active />
        <NavItem label="Circles" icon={<CircleIcon />} />
        <NavItem label="Settings" icon={<SettingsIcon />} />
      </Stack>
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Default`,`Active`,`WithIcon`,`NavGroup`]}))();export{d as Active,u as Default,p as NavGroup,f as WithIcon,m as __namedExportsOrder,l as default};