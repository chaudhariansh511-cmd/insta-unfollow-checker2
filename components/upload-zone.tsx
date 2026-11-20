'use client'

import { AlertCircle, FileArchive, Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  onFiles: (files: File[]) => void
  onSample: () => void
  loading: boolean
  error: string | null
}

export function UploadZone({ onFiles, onSample, loading, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handle = (list: FileList | null) => {
    if (list && list.length > 0) onFiles(Array.from(list))
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handle(e.dataTransfer.files)
        }}
        className={cn(
          'relative rounded-3xl p-[1.5px] transition-transform',
          dragging ? 'ig-gradient scale-[1.01]' : 'bg-border',
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex w-full flex-col items-center gap-4 rounded-[calc(1.5rem-1.5px)] bg-card px-6 py-12 text-center transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait"
        >
          <span className="ig-gradient flex size-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20">
            {loading ? (
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            ) : dragging ? (
              <FileArchive className="size-6" aria-hidden="true" />
            ) : (
              <Upload className="size-6" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-balance">
              {loading ? 'Analyzing your data…' : 'Drop your Instagram ZIP or JSON files here'}
            </span>
            <span className="text-sm text-muted-foreground text-pretty">
              or click to browse — accepts <code className="font-mono text-xs">.zip</code>,{' '}
              <code className="font-mono text-xs">followers_1.json</code> and{' '}
              <code className="font-mono text-xs">following.json</code>
            </span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".zip,.json,application/json,application/zip"
          className="sr-only"
          aria-label="Upload Instagram data files"
          onChange={(e) => {
            handle(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Just want to look around?{' '}
        <button type="button" onClick={onSample} className="font-medium text-primary underline-offset-4 hover:underline">
          Try with sample data
        </button>
      </p>
    </div>
  )
}
