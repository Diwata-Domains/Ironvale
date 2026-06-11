import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{a as n,c as r,d as i,i as a,o,r as s,s as c,t as l}from"./src-BghEvbO8.js";function u(e){return e===`active`?`success`:e===`suspended`?`error`:`neutral`}function d(e){return e===`sovereign`||e===`adept`||e===`guild`?e:`neutral`}var f,p,m,h,g,_;e((()=>{l(),f=t(),p={title:`Components/Table`,component:s,parameters:{docs:{description:{component:"Semantic data table using the full sub-component set: Table, Thead, Tbody, Tr, Th, Td. Use `compact` for dense operator views. Use `static` to disable row hover highlighting."}}},args:{compact:!1,static:!1},argTypes:{compact:{control:`boolean`},static:{control:`boolean`}}},m=[{name:`Vesper`,tier:`sovereign`,status:`active`,joined:`2026-01-12`},{name:`Oryn`,tier:`adept`,status:`active`,joined:`2026-02-08`},{name:`Kael`,tier:`guild`,status:`draft`,joined:`2026-04-03`},{name:`Sable`,tier:`adept`,status:`suspended`,joined:`2026-05-19`}],h={render:e=>(0,f.jsxs)(s,{...e,style:{width:`min(36rem, 100%)`},children:[(0,f.jsx)(c,{children:(0,f.jsxs)(r,{children:[(0,f.jsx)(o,{children:`Name`}),(0,f.jsx)(o,{children:`Tier`}),(0,f.jsx)(o,{children:`Status`}),(0,f.jsx)(o,{children:`Joined`})]})}),(0,f.jsx)(a,{children:m.map(e=>(0,f.jsxs)(r,{children:[(0,f.jsx)(n,{style:{fontWeight:500},children:e.name}),(0,f.jsx)(n,{children:(0,f.jsx)(i,{variant:d(e.tier),children:e.tier})}),(0,f.jsx)(n,{children:(0,f.jsx)(i,{variant:u(e.status),children:e.status})}),(0,f.jsx)(n,{style:{fontFamily:`monospace`},children:e.joined})]},e.name))})]})},g={render:()=>(0,f.jsxs)(s,{compact:!0,style:{width:`min(36rem, 100%)`},children:[(0,f.jsx)(c,{children:(0,f.jsxs)(r,{children:[(0,f.jsx)(o,{children:`Name`}),(0,f.jsx)(o,{children:`Tier`}),(0,f.jsx)(o,{children:`Status`}),(0,f.jsx)(o,{children:`Joined`})]})}),(0,f.jsx)(a,{children:m.map(e=>(0,f.jsxs)(r,{children:[(0,f.jsx)(n,{style:{fontWeight:500},children:e.name}),(0,f.jsx)(n,{children:(0,f.jsx)(i,{variant:d(e.tier),children:e.tier})}),(0,f.jsx)(n,{children:(0,f.jsx)(i,{variant:u(e.status),children:e.status})}),(0,f.jsx)(n,{style:{fontFamily:`monospace`},children:e.joined})]},e.name))})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Table {...args} style={{
    width: 'min(36rem, 100%)'
  }}>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Tier</Th>
          <Th>Status</Th>
          <Th>Joined</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map(r => <Tr key={r.name}>
            <Td style={{
          fontWeight: 500
        }}>{r.name}</Td>
            <Td><Badge variant={tierVariant(r.tier)}>{r.tier}</Badge></Td>
            <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
            <Td style={{
          fontFamily: 'monospace'
        }}>{r.joined}</Td>
          </Tr>)}
      </Tbody>
    </Table>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Table compact style={{
    width: 'min(36rem, 100%)'
  }}>
      <Thead>
        <Tr><Th>Name</Th><Th>Tier</Th><Th>Status</Th><Th>Joined</Th></Tr>
      </Thead>
      <Tbody>
        {rows.map(r => <Tr key={r.name}>
            <Td style={{
          fontWeight: 500
        }}>{r.name}</Td>
            <Td><Badge variant={tierVariant(r.tier)}>{r.tier}</Badge></Td>
            <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
            <Td style={{
          fontFamily: 'monospace'
        }}>{r.joined}</Td>
          </Tr>)}
      </Tbody>
    </Table>
}`,...g.parameters?.docs?.source}}},_=[`Default`,`Compact`]}))();export{g as Compact,h as Default,_ as __namedExportsOrder,p as default};