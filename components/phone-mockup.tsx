'use client'

import { useState } from 'react'
import { ChevronRight, Grid3x3, Menu, Plus, Pointer } from 'lucide-react'
import type { MockRow, MockScreen } from '@/lib/guide-steps'
import { cn } from '@/lib/utils'

function Highlight({ className }: { className?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-1 rounded-lg border-2 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.18)]',
          className,
        )}
      />
      <Pointer
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 right-1 size-5 fill-white text-red-500 drop-shadow"
      />
    </>
  )
}

function ProfileScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold">{title}</span>
        <div className="flex items-center gap-2">
          <Plus className="size-3.5" aria-hidden="true" />
          <span className="relative flex">
            <Menu className="size-3.5" aria-hidden="true" />
            <Highlight className="-inset-1.5 rounded-full" />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="ig-gradient size-11 shrink-0 rounded-full p-0.5">
          <div className="size-full rounded-full bg-muted" />
        </div>
        <div className="flex flex-1 justify-around text-center">
          {['Posts', 'Followers', 'Following'].map((label) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] font-semibold">--</span>
              <span className="text-[8px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-1/2 rounded-full bg-muted" />
        <div className="h-1.5 w-3/4 rounded-full bg-muted" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 flex-1 rounded-md bg-muted" />
        <div className="h-5 flex-1 rounded-md bg-muted" />
      </div>
      <div className="flex justify-center border-t border-border pt-1.5">
        <Grid3x3 className="size-3 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted" />
        ))}
      </div>
    </div>
  )
}

function ListRow({ row }: { row: MockRow }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-between gap-2 rounded-md px-2 py-2',
        row.highlight && 'bg-red-500/10',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-4 shrink-0 rounded-md bg-muted" aria-hidden="true" />
        <div className="flex min-w-0 flex-col">
          <span className="line-clamp-2 text-[10px] font-medium leading-tight">{row.label}</span>
          {row.sub && <span className="truncate text-[8px] leading-tight text-muted-foreground">{row.sub}</span>}
        </div>
      </div>
      <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
      {row.highlight && <Highlight />}
    </div>
  )
}

function ListScreen({ title, rows }: { title: string; rows: MockRow[] }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      <span className="text-center text-[11px] font-semibold">{title}</span>
      <div className="h-5 rounded-md bg-muted" aria-hidden="true" />
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <ListRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  )
}

export function PhoneMockup({ screen, image, imageAlt }: { screen: MockScreen; image?: string; imageAlt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(image) && failedSrc !== image

  return (
    <div className="mx-auto w-full max-w-[200px] rounded-[1.75rem] border border-border bg-zinc-900 p-1.5 shadow-lg dark:bg-zinc-800">
      <div className="relative aspect-[9/17] overflow-hidden rounded-[1.4rem] bg-background">
        <div className="flex justify-center pt-1.5" aria-hidden="true">
          <span className="h-1.5 w-12 rounded-full bg-zinc-900 dark:bg-zinc-800" />
        </div>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- supports arbitrary user URLs and blob: previews
          <img
            src={image}
            alt={imageAlt}
            onError={() => setFailedSrc(image ?? null)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div role="img" aria-label={imageAlt}>
            {screen.kind === 'profile' ? <ProfileScreen title={screen.title} /> : <ListScreen {...screen} />}
          </div>
        )}
      </div>
    </div>
  )
}
