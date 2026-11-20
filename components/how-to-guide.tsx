'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, HelpCircle, ImagePlus, Link2, PencilLine, RotateCcw, Upload } from 'lucide-react'
import { guideSteps, type GuideStep } from '@/lib/guide-steps'
import { PhoneMockup } from '@/components/phone-mockup'
import { Button } from '@/components/ui/button'

type Overrides = Record<string, string>

function StepImageEditor({
  step,
  index,
  override,
  onChange,
}: {
  step: GuideStep
  index: number
  override?: string
  onChange: (value: string | null) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={`Upload screenshot for ${step.title}`}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange(URL.createObjectURL(file))
          e.target.value = ''
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
        <Upload aria-hidden="true" />
        Upload screenshot
      </Button>
      <form
        className="flex gap-1.5"
        onSubmit={(e) => {
          e.preventDefault()
          const value = url.trim()
          if (value) onChange(value)
          setUrl('')
        }}
      >
        <label htmlFor={`${step.id}-url`} className="sr-only">
          Image URL for {step.title}
        </label>
        <div className="relative flex-1">
          <Link2
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={`${step.id}-url`}
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`/images/step${index + 1}.png`}
            className="h-8 w-full rounded-md border border-input bg-background pl-7 pr-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" size="sm" variant="secondary">
          Set
        </Button>
      </form>
      {override && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
          <RotateCcw aria-hidden="true" />
          Reset to default
        </Button>
      )}
    </div>
  )
}

function StepCard({
  step,
  index,
  editing,
  override,
  onChange,
}: {
  step: GuideStep
  index: number
  editing: boolean
  override?: string
  onChange: (value: string | null) => void
}) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <span className="ig-gradient flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
          {index + 1}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Step {index + 1}</p>
          <h3 className="text-sm font-semibold leading-snug text-balance">{step.title}</h3>
        </div>
      </div>
      <div className="rounded-xl bg-muted/50 px-4 py-5">
        <PhoneMockup screen={step.screen} image={override ?? step.image} imageAlt={step.imageAlt} />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
      {editing && <StepImageEditor step={step} index={index} override={override} onChange={onChange} />}
    </li>
  )
}

export function HowToGuide() {
  const [editing, setEditing] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>({})
  const overridesRef = useRef(overrides)
  overridesRef.current = overrides

  useEffect(() => {
    return () => {
      Object.values(overridesRef.current).forEach((src) => src.startsWith('blob:') && URL.revokeObjectURL(src))
    }
  }, [])

  const updateOverride = (id: string, value: string | null) => {
    setOverrides((prev) => {
      const previous = prev[id]
      if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous)
      const next = { ...prev }
      if (value) next[id] = value
      else delete next[id]
      return next
    })
  }

  return (
    <details className="group rounded-2xl border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3 font-medium">
          <HelpCircle className="size-5 text-primary" aria-hidden="true" />
          How to get your Instagram file?
        </span>
        <ChevronDown
          className="size-5 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="flex flex-col gap-5 px-5 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Follow these 5 steps in the Instagram app. The red circle shows where to tap.
          </p>
          <Button
            type="button"
            variant={editing ? 'default' : 'outline'}
            size="sm"
            aria-pressed={editing}
            onClick={() => setEditing((v) => !v)}
            className="self-start sm:self-auto"
          >
            {editing ? <ImagePlus aria-hidden="true" /> : <PencilLine aria-hidden="true" />}
            {editing ? 'Done editing' : 'Edit step images'}
          </Button>
        </div>

        {editing && (
          <p className="rounded-xl border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            Swapped images only apply in this browser tab. To make them permanent, add screenshots to{' '}
            <code className="font-mono text-foreground">public/images/</code> and set each step&apos;s{' '}
            <code className="font-mono text-foreground">image</code> in{' '}
            <code className="font-mono text-foreground">lib/guide-steps.ts</code>.
          </p>
        )}

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guideSteps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              editing={editing}
              override={overrides[step.id]}
              onChange={(value) => updateOverride(step.id, value)}
            />
          ))}
        </ol>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="ig-gradient size-1.5 shrink-0 rounded-full" aria-hidden="true" />
          Instagram emails you when the file is ready. Download the ZIP and drop it in the upload box above.
        </p>
      </div>
    </details>
  )
}
