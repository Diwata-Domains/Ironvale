import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-Cz4-9Ekt.js";import{_ as n,g as r,h as i,m as a,p as o,t as s}from"./src-BghEvbO8.js";function c({code:e}){return(0,u.jsx)(`pre`,{style:{margin:0,padding:`1rem`,overflowX:`auto`,borderRadius:`0.75rem`,background:`var(--ae-color-bg-subtle)`,border:`thin solid var(--ae-color-border-default)`,fontSize:`0.9rem`},children:(0,u.jsx)(`code`,{children:e})})}function l({title:e,children:t}){return(0,u.jsxs)(i,{gap:`sm`,children:[(0,u.jsx)(o,{as:`h2`,variant:`heading`,children:e}),t]})}var u,d,f,p,m,h,g,_;e((()=>{s(),u=t(),d=`@import "@diwata/aether/tokens.css";
@import "@diwata/ironvale/ironvale.css";`,f=`import '@diwata/aether/tokens.css';
import '@diwata/ironvale/ironvale.css';

import { Button, Input, Surface, Text } from '@diwata/ironvale';`,p=`<section class="iv-surface iv-surface--raised">
  <p class="iv-text iv-text--label">Email address</p>
  <input
    class="iv-input"
    type="email"
    placeholder="name@example.com"
  />
  <button class="iv-button iv-button--primary iv-button--md">
    Save contact
  </button>
</section>`,m=`:root {
  --ae-color-action-primary-bg: var(--brand-action-600);
  --ae-color-action-primary-hover: var(--brand-action-700);
}

[data-theme="dark"] {
  --ae-color-bg-base: var(--brand-slate-950);
  --ae-color-text-default: var(--brand-slate-050);
}`,h={title:`Guides/Adoption`,parameters:{layout:`fullscreen`,docs:{description:{component:`Adoption guide for installing Aether and Ironvale, enabling themes, and choosing between the CSS class API and optional React wrappers.`}}}},g={render:()=>(0,u.jsx)(`div`,{style:{padding:`2rem`,maxWidth:`72rem`,margin:`0 auto`},children:(0,u.jsxs)(i,{gap:`lg`,children:[(0,u.jsxs)(l,{title:`Install and import in order`,children:[(0,u.jsx)(o,{variant:`body`,children:`Ironvale does not ship its own token layer. Load Aether tokens first, then Ironvale CSS, so all component variables resolve against the semantic token contract.`}),(0,u.jsx)(c,{code:d}),(0,u.jsx)(o,{variant:`caption`,children:`In bundler-based apps, use the package import paths directly instead of reaching into workspace-relative files.`})]}),(0,u.jsxs)(l,{title:`Choose the API surface`,children:[(0,u.jsx)(o,{variant:`body`,children:`The CSS class API is the default cross-framework surface. React wrappers are optional and only translate props into those same class names.`}),(0,u.jsxs)(i,{direction:`horizontal`,gap:`lg`,wrap:!0,children:[(0,u.jsx)(a,{variant:`raised`,style:{flex:`1 1 22rem`},children:(0,u.jsxs)(i,{gap:`sm`,children:[(0,u.jsx)(o,{as:`h3`,variant:`heading`,children:`Plain HTML`}),(0,u.jsx)(c,{code:p})]})}),(0,u.jsx)(a,{variant:`raised`,style:{flex:`1 1 22rem`},children:(0,u.jsxs)(i,{gap:`sm`,children:[(0,u.jsx)(o,{as:`h3`,variant:`heading`,children:`React`}),(0,u.jsx)(c,{code:f}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(o,{as:`label`,variant:`label`,htmlFor:`adoption-story-input`,children:`Email address`}),(0,u.jsx)(`div`,{style:{marginTop:`0.5rem`},children:(0,u.jsx)(r,{id:`adoption-story-input`,type:`email`,placeholder:`name@example.com`})})]}),(0,u.jsx)(`div`,{children:(0,u.jsx)(n,{children:`Save contact`})})]})})]})]}),(0,u.jsxs)(l,{title:`Theme activation`,children:[(0,u.jsx)(o,{variant:`body`,children:`Ironvale follows Aether's theme model. Components flip automatically when the active theme changes because every primitive consumes semantic tokens only.`}),(0,u.jsx)(c,{code:`<body data-theme="dark">...</body>`}),(0,u.jsx)(o,{variant:`caption`,children:`Theme switching should happen at the application shell level. Ironvale components do not need per-component dark-mode props or overrides.`})]}),(0,u.jsxs)(l,{title:`Token overrides`,children:[(0,u.jsx)(o,{variant:`body`,children:`Override semantic tokens, not Ironvale classes. That keeps the library CSS stable while letting a product or brand layer redefine meaning at the token level.`}),(0,u.jsx)(c,{code:m}),(0,u.jsx)(o,{variant:`caption`,children:"Avoid overriding `iv-` classes directly unless you are intentionally forking the component contract for one application."})]}),(0,u.jsx)(l,{title:`Adoption checklist`,children:(0,u.jsxs)(i,{gap:`sm`,children:[(0,u.jsx)(o,{variant:`body`,children:"1. Install `@diwata/aether` and `@diwata/ironvale` together."}),(0,u.jsx)(o,{variant:`body`,children:"2. Import `@diwata/aether/tokens.css` before `@diwata/ironvale/ironvale.css`."}),(0,u.jsx)(o,{variant:`body`,children:`3. Use plain HTML classes everywhere; add React wrappers only where that improves ergonomics.`}),(0,u.jsx)(o,{variant:`body`,children:`4. Apply themes and brand changes through semantic token overrides.`})]})})]})})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '2rem',
    maxWidth: '72rem',
    margin: '0 auto'
  }}>
      <Stack gap="lg">
        <Section title="Install and import in order">
          <Text variant="body">
            Ironvale does not ship its own token layer. Load Aether tokens first, then Ironvale CSS,
            so all component variables resolve against the semantic token contract.
          </Text>
          <CodeBlock code={installCss} />
          <Text variant="caption">
            In bundler-based apps, use the package import paths directly instead of reaching into
            workspace-relative files.
          </Text>
        </Section>

        <Section title="Choose the API surface">
          <Text variant="body">
            The CSS class API is the default cross-framework surface. React wrappers are optional and
            only translate props into those same class names.
          </Text>
          <Stack direction="horizontal" gap="lg" wrap>
            <Surface variant="raised" style={{
            flex: '1 1 22rem'
          }}>
              <Stack gap="sm">
                <Text as="h3" variant="heading">
                  Plain HTML
                </Text>
                <CodeBlock code={htmlExample} />
              </Stack>
            </Surface>
            <Surface variant="raised" style={{
            flex: '1 1 22rem'
          }}>
              <Stack gap="sm">
                <Text as="h3" variant="heading">
                  React
                </Text>
                <CodeBlock code={reactImports} />
                <div>
                  <Text as="label" variant="label" htmlFor="adoption-story-input">
                    Email address
                  </Text>
                  <div style={{
                  marginTop: '0.5rem'
                }}>
                    <Input id="adoption-story-input" type="email" placeholder="name@example.com" />
                  </div>
                </div>
                <div>
                  <Button>Save contact</Button>
                </div>
              </Stack>
            </Surface>
          </Stack>
        </Section>

        <Section title="Theme activation">
          <Text variant="body">
            Ironvale follows Aether&apos;s theme model. Components flip automatically when the active
            theme changes because every primitive consumes semantic tokens only.
          </Text>
          <CodeBlock code={\`<body data-theme="dark">...</body>\`} />
          <Text variant="caption">
            Theme switching should happen at the application shell level. Ironvale components do not
            need per-component dark-mode props or overrides.
          </Text>
        </Section>

        <Section title="Token overrides">
          <Text variant="body">
            Override semantic tokens, not Ironvale classes. That keeps the library CSS stable while
            letting a product or brand layer redefine meaning at the token level.
          </Text>
          <CodeBlock code={tokenOverrideExample} />
          <Text variant="caption">
            Avoid overriding \`iv-\` classes directly unless you are intentionally forking the component
            contract for one application.
          </Text>
        </Section>

        <Section title="Adoption checklist">
          <Stack gap="sm">
            <Text variant="body">1. Install \`@diwata/aether\` and \`@diwata/ironvale\` together.</Text>
            <Text variant="body">2. Import \`@diwata/aether/tokens.css\` before \`@diwata/ironvale/ironvale.css\`.</Text>
            <Text variant="body">3. Use plain HTML classes everywhere; add React wrappers only where that improves ergonomics.</Text>
            <Text variant="body">4. Apply themes and brand changes through semantic token overrides.</Text>
          </Stack>
        </Section>
      </Stack>
    </div>
}`,...g.parameters?.docs?.source}}},_=[`GettingStarted`]}))();export{g as GettingStarted,_ as __namedExportsOrder,h as default};