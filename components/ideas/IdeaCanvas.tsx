'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { canvasQuestions } from '@/lib/ideas'
import { CopyButton } from './CopyButton'

// Formats only what the attendee typed, under the canvas headings
function formatNotes(answers: Record<string, string>): string {
  return canvasQuestions
    .filter((question) => answers[question.id]?.trim())
    .map((question) => `## ${question.heading}\n\n${answers[question.id].trim()}`)
    .join('\n\n')
}

export function IdeaCanvas() {
  const [answers, setAnswers] = useLocalStorage<Record<string, string>>('contribfest-idea-canvas', {})
  const notes = formatNotes(answers)

  const handleReset = () => {
    if (window.confirm('Clear all of your idea notes? This cannot be undone.')) {
      setAnswers({})
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {canvasQuestions.map((question) => (
          <div key={question.id}>
            <label
              htmlFor={`canvas-${question.id}`}
              style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--bui-fg-primary, #000)' }}
            >
              {question.heading}
            </label>
            <p style={{ fontSize: '14px', color: 'var(--bui-fg-secondary, #666)', margin: '4px 0 8px' }}>
              {question.prompt}
            </p>
            <textarea
              id={`canvas-${question.id}`}
              rows={3}
              value={answers[question.id] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--bui-border-1, #d5d5d5)',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                resize: 'vertical',
                background: 'var(--bui-bg-app, #f8f8f8)',
                color: 'var(--bui-fg-primary, #000)',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        <CopyButton text={notes} label="Copy my notes" disabled={!notes} />
        <button
          type="button"
          onClick={handleReset}
          disabled={!notes}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: 'transparent',
            color: 'var(--bui-fg-secondary, #666)',
            fontSize: '13px',
            textDecoration: 'underline',
            cursor: notes ? 'pointer' : 'not-allowed',
          }}
        >
          Clear notes
        </button>
        <span style={{ fontSize: '13px', color: 'var(--bui-fg-secondary, #666)' }}>
          Saved in this browser only.
        </span>
      </div>
    </div>
  )
}
