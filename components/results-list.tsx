'use client'

import { ArrowUpDown, Download, ExternalLink, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { IgAccount } from '@/lib/instagram-parser'
import { cn } from '@/lib/utils'

type Sort = 'az' | 'za' | 'newest' | 'oldest'
type Filter = 'all' | 'pending' | 'unfollowed'

type Props = {
  accounts: IgAccount[]
  unfollowed: Set<string>
  onToggle: (username: string) => void
}

const sortLabels: Record<Sort, string> = {
  az: 'Username A–Z',
  za: 'Username Z–A',
  newest: 'Recently followed',
  oldest: 'Oldest followed',
}

function formatDate(ts?: number) {
  if (!ts) return null
  return new Date(ts * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function exportCsv(accounts: IgAccount[], unfollowed: Set<string>) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = [
    ['username', 'profile_url', 'followed_on', 'unfollowed'],
    ...accounts.map((a) => [
      a.username,
      a.href,
      a.timestamp ? new Date(a.timestamp * 1000).toISOString().slice(0, 10) : '',
      unfollowed.has(a.username) ? 'yes' : 'no',
    ]),
  ]
  const csv = rows.map((r) => r.map(escape).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'not-following-back.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function ResultsList({ accounts, unfollowed, onToggle }: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('az')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^@/, '')
    const list = accounts.filter((a) => {
      if (q && !a.username.includes(q)) return false
      if (filter === 'pending') return !unfollowed.has(a.username)
      if (filter === 'unfollowed') return unfollowed.has(a.username)
      return true
    })
    return list.sort((a, b) => {
      if (sort === 'az') return a.username.localeCompare(b.username)
      if (sort === 'za') return b.username.localeCompare(a.username)
      if (sort === 'newest') return (b.timestamp ?? 0) - (a.timestamp ?? 0)
      return (a.timestamp ?? 0) - (b.timestamp ?? 0)
    })
  }, [accounts, query, sort, filter, unfollowed])

  const done = accounts.filter((a) => unfollowed.has(a.username)).length
  const progress = accounts.length ? Math.round((done / accounts.length) * 100) : 0

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 id="results-heading" className="text-xl font-semibold">
            {"Accounts that don't follow you back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {done} of {accounts.length} marked as unfollowed
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => exportCsv(visible, unfollowed)}
          disabled={visible.length === 0}
          className="rounded-full"
        >
          <Download aria-hidden="true" />
          Export to CSV
        </Button>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Unfollow progress"
      >
        <div className="ig-gradient h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search usernames</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username…"
            className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
          />
        </label>
        <div className="flex gap-3">
          <label className="relative flex-1 md:flex-none">
            <span className="sr-only">Sort by</span>
            <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 w-full appearance-none rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
            >
              {(Object.keys(sortLabels) as Sort[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Filter" className="flex rounded-full border border-input bg-background p-1">
            {(['all', 'pending', 'unfollowed'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full px-3 text-xs font-medium capitalize transition-colors',
                  filter === f ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-muted/50 py-12 text-center text-sm text-muted-foreground">
          {accounts.length === 0 ? 'Everyone you follow follows you back.' : 'No accounts match your filters.'}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {visible.map((account) => {
            const isDone = unfollowed.has(account.username)
            const date = formatDate(account.timestamp)
            const id = `unfollowed-${account.username}`
            return (
              <li
                key={account.username}
                className={cn('flex items-center gap-3 px-3 py-3 transition-colors sm:gap-4 sm:px-4', isDone && 'bg-muted/40')}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggle(account.username)}
                  className="size-5 shrink-0 cursor-pointer rounded accent-primary"
                />
                <span
                  aria-hidden="true"
                  className="ig-gradient flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase text-white"
                >
                  {account.username.replace(/[^a-z0-9]/g, '').charAt(0) || '@'}
                </span>
                <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer flex-col">
                  <span className={cn('truncate font-medium', isDone && 'text-muted-foreground line-through')}>
                    @{account.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isDone ? 'Marked as unfollowed' : date ? `Followed ${date}` : 'Not following you back'}
                  </span>
                </label>
                <a
                  href={account.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4"
                >
                  <span className="hidden sm:inline">Visit Profile</span>
                  <span className="sr-only sm:hidden">Visit @{account.username} on Instagram</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
