import { RiExternalLinkLine } from '@remixicon/react'
import { PathChooser } from '@/components/ideas/PathChooser'
import { IdeaCanvas } from '@/components/ideas/IdeaCanvas'
import { CopyButton } from '@/components/ideas/CopyButton'
import { aiPolicyPoints, aiPolicyUrl, coachPrompts, nextSteps, topicAreas } from '@/lib/ideas'

export default function IdeasPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', color: 'var(--bui-fg-primary, #000)' }}>
          💡 Your Ideas
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--bui-fg-secondary, #666)', lineHeight: '1.6', margin: 0 }}>
          ContribFest isn&apos;t only about closing issues. Your experience running and building on Backstage is
          the best source of ideas for where it should go next. This page helps you shape an idea and find the
          right way to propose it. The writing is yours, and the hosts are here to help.
        </p>
      </div>

      <Section title="1. Pick your path" intro="Answer a question or two to find the right way to propose your idea.">
        <PathChooser />
      </Section>

      <Section
        title="2. Need inspiration?"
        intro="Not sure where to start? Explore an area, think about what you've run into with it, and look at what other adopters are asking for."
      >
        <div
          className="repo-resources-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
        >
          {topicAreas.map((topic) => (
            <div key={topic.title} style={cardStyle}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 8px', color: 'var(--bui-fg-primary, #000)' }}>
                <span aria-hidden="true">{topic.emoji}</span> {topic.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--bui-fg-secondary, #666)', margin: '0 0 8px' }}>
                {topic.summary}
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 12px', fontSize: '14px', lineHeight: '1.5', color: 'var(--bui-fg-primary, #000)', flex: 1 }}>
                {topic.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <ExternalLink href={topic.docsUrl}>Docs</ExternalLink>
                <ExternalLink href={topic.codeUrl}>Code</ExternalLink>
                <ExternalLink href={topic.issuesUrl}>Top requests</ExternalLink>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="3. Think it through"
        intro="Jot down answers in your own words. These questions follow the BEP template, so your notes carry over to whichever path you pick. Nothing is sent anywhere."
      >
        <IdeaCanvas />
      </Section>

      <Section
        title="4. Use AI as a coach, not an author"
        intro="AI assistants are great for exploring the codebase and challenging your thinking. Copy a prompt into your own assistant and fill in the brackets. Each one asks the AI to explain, search, or question, not to write your proposal."
      >
        <div
          style={{
            ...cardStyle,
            marginBottom: '16px',
            background: 'var(--contribfest-progress-bg, #dcfce7)',
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 8px', color: 'var(--bui-fg-primary, #000)' }}>
            Backstage AI Use Policy
          </h3>
          <ul style={{ paddingLeft: '18px', margin: '0 0 12px', fontSize: '14px', lineHeight: '1.6', color: 'var(--bui-fg-primary, #000)' }}>
            {aiPolicyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ExternalLink href={aiPolicyUrl}>Read the full policy</ExternalLink>
        </div>

        <div
          className="session-resources-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
        >
          {coachPrompts.map((coachPrompt) => (
            <div key={coachPrompt.title} style={cardStyle}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 4px', color: 'var(--bui-fg-primary, #000)' }}>
                {coachPrompt.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--bui-fg-secondary, #666)', margin: '0 0 12px' }}>
                {coachPrompt.purpose}
              </p>
              <blockquote
                style={{
                  margin: '0 0 12px',
                  padding: '12px',
                  borderLeft: '3px solid var(--bui-bg-solid, #1f5493)',
                  background: 'var(--bui-bg-app, #f8f8f8)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: 'var(--bui-fg-primary, #000)',
                  flex: 1,
                }}
              >
                {coachPrompt.prompt}
              </blockquote>
              <div>
                <CopyButton text={coachPrompt.prompt} label="Copy prompt" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="5. From idea to reality" intro="Big ideas land through conversation and steady, small steps.">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nextSteps.map((step, index) => (
            <li key={step.title} style={{ ...cardStyle, flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  background: 'var(--bui-bg-solid, #1f5493)',
                  color: 'var(--bui-fg-solid, #fff)',
                }}
              >
                {index + 1}
              </span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px', color: 'var(--bui-fg-primary, #000)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--bui-fg-secondary, #666)', margin: 0 }}>
                  {step.description}
                </p>
                {step.link && (
                  <div style={{ marginTop: '8px' }}>
                    <ExternalLink href={step.link.url}>{step.link.label}</ExternalLink>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--bui-border-1, #d5d5d5)',
  borderRadius: '8px',
  padding: '20px',
  background: 'var(--bui-bg-popover, #fff)',
  display: 'flex',
  flexDirection: 'column',
}

function Section({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px', color: 'var(--bui-fg-primary, #000)' }}>
        {title}
      </h2>
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--bui-fg-secondary, #666)', margin: '0 0 20px' }}>
        {intro}
      </p>
      {children}
    </section>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600, color: 'var(--bui-bg-solid, #1f5493)' }}
    >
      {children}
      <RiExternalLinkLine size={14} aria-hidden="true" />
    </a>
  )
}
