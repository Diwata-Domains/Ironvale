import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { Button, Input, Stack, Surface, Text } from '../index.js';

const installCss = `@import "@diwata/aether/tokens.css";
@import "@diwata/ironvale/ironvale.css";`;

const reactImports = `import '@diwata/aether/tokens.css';
import '@diwata/ironvale/ironvale.css';

import { Button, Input, Surface, Text } from '@diwata/ironvale';`;

const htmlExample = `<section class="iv-surface iv-surface--raised">
  <p class="iv-text iv-text--label">Email address</p>
  <input
    class="iv-input"
    type="email"
    placeholder="name@example.com"
  />
  <button class="iv-button iv-button--primary iv-button--md">
    Save contact
  </button>
</section>`;

const tokenOverrideExample = `:root {
  --ae-color-action-primary-bg: var(--brand-action-600);
  --ae-color-action-primary-hover: var(--brand-action-700);
}

[data-theme="dark"] {
  --ae-color-bg-base: var(--brand-slate-950);
  --ae-color-text-default: var(--brand-slate-050);
}`;

const meta = {
  title: 'Guides/Adoption',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Adoption guide for installing Aether and Ironvale, enabling themes, and choosing between the CSS class API and optional React wrappers.'
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: '1rem',
        overflowX: 'auto',
        borderRadius: '0.75rem',
        background: 'var(--ae-color-bg-subtle)',
        border: 'thin solid var(--ae-color-border-default)',
        fontSize: '0.9rem'
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <Text as="h2" variant="heading">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

export const GettingStarted: Story = {
  render: () => (
    <div style={{ padding: '2rem', maxWidth: '72rem', margin: '0 auto' }}>
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
            <Surface variant="raised" style={{ flex: '1 1 22rem' }}>
              <Stack gap="sm">
                <Text as="h3" variant="heading">
                  Plain HTML
                </Text>
                <CodeBlock code={htmlExample} />
              </Stack>
            </Surface>
            <Surface variant="raised" style={{ flex: '1 1 22rem' }}>
              <Stack gap="sm">
                <Text as="h3" variant="heading">
                  React
                </Text>
                <CodeBlock code={reactImports} />
                <div>
                  <Text as="label" variant="label" htmlFor="adoption-story-input">
                    Email address
                  </Text>
                  <div style={{ marginTop: '0.5rem' }}>
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
          <CodeBlock code={`<body data-theme="dark">...</body>`} />
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
            Avoid overriding `iv-` classes directly unless you are intentionally forking the component
            contract for one application.
          </Text>
        </Section>

        <Section title="Adoption checklist">
          <Stack gap="sm">
            <Text variant="body">1. Install `@diwata/aether` and `@diwata/ironvale` together.</Text>
            <Text variant="body">2. Import `@diwata/aether/tokens.css` before `@diwata/ironvale/ironvale.css`.</Text>
            <Text variant="body">3. Use plain HTML classes everywhere; add React wrappers only where that improves ergonomics.</Text>
            <Text variant="body">4. Apply themes and brand changes through semantic token overrides.</Text>
          </Stack>
        </Section>
      </Stack>
    </div>
  )
};
