import{n as e}from"./chunk-DnJy8xQt.js";import{i as t,n,r,s as i,t as a}from"./src-DVatdCl2.js";function o(){return(0,s.jsxs)(t,{gap:`sm`,children:[(0,s.jsx)(n,{as:`h3`,variant:`heading`,children:`Revenue snapshot`}),(0,s.jsx)(n,{variant:`body`,children:`Use surfaces to group related content and let Aether semantic tokens control depth.`}),(0,s.jsx)(n,{variant:`caption`,children:`Updated 5 minutes ago`})]})}var s,c,l,u,d;e((()=>{a(),s=i(),c={title:`Primitives/Surface`,component:r,parameters:{layout:`padded`,docs:{description:{component:"Container primitive for grouping content on a token-driven background. Choose the variant that matches the content hierarchy and keep semantic structure with the `as` prop when the surface represents a section or article."}}},args:{variant:`base`},argTypes:{variant:{control:`inline-radio`,options:[`base`,`raised`,`overlay`]},as:{control:`select`,options:[`div`,`section`,`article`,`aside`]}}},l={args:{as:`section`},render:e=>(0,s.jsx)(r,{...e,style:{width:`min(32rem, calc(100vw - 3rem))`},children:(0,s.jsx)(o,{})})},u={render:()=>(0,s.jsxs)(t,{gap:`md`,children:[(0,s.jsx)(r,{variant:`base`,children:(0,s.jsx)(o,{})}),(0,s.jsx)(r,{variant:`raised`,children:(0,s.jsx)(o,{})}),(0,s.jsx)(r,{variant:`overlay`,children:(0,s.jsx)(o,{})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'section'
  },
  render: args => <Surface {...args} style={{
    width: 'min(32rem, calc(100vw - 3rem))'
  }}>
      <SurfaceContent />
    </Surface>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap="md">
      <Surface variant="base">
        <SurfaceContent />
      </Surface>
      <Surface variant="raised">
        <SurfaceContent />
      </Surface>
      <Surface variant="overlay">
        <SurfaceContent />
      </Surface>
    </Stack>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Variants`]}))();export{l as Default,u as Variants,d as __namedExportsOrder,c as default};