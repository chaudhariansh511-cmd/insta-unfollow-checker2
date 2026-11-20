'use client'

import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { HowToGuide } from '@/components/how-to-guide'
import { ResultsList } from '@/components/results-list'
import { StatsCards } from '@/components/stats-cards'
import { Button } from '@/components/ui/button'
import { UploadZone } from '@/components/upload-zone'
import {
  buildSampleData,
  findNotFollowingBack,
  type IgAccount,
  type ParsedData,
  ParseError,
  parseInstagramFiles,
} from '@/lib/instagram-parser'

const STORAGE_KEY = 'instaunfollow:unfollowed'

type Results = { data: ParsedData; notFollowingBack: IgAccount[] }

function loadUnfollowed() {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set<string>()
  }
}

export function UnfollowChecker() {
  const [results, setResults] = useState<Results | null>(null)
  const [unfollowed, setUnfollowed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const show = (data: ParsedData) => {
    setUnfollowed(loadUnfollowed())
    setResults({ data, notFollowingBack: findNotFollowingBack(data) })
  }

  const handleFiles = async (files: File[]) => {
    setLoading(true)
    setError(null)
    try {
      show(await parseInstagramFiles(files))
    } catch (err) {
      setError(err instanceof ParseError ? err.message : 'Something went wrong while reading your files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggle = (username: string) => {
    setUnfollowed((prev) => {
      const next = new Set(prev)
      if (next.has(username)) next.delete(username)
      else next.add(username)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  if (!results) {
    return (
      <div className="flex flex-col gap-6">
        <UploadZone onFiles={handleFiles} onSample={() => show(buildSampleData())} loading={loading} error={error} />
        <HowToGuide />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Analyzed <span className="font-medium text-foreground">{results.data.sources.join(', ')}</span>
        </p>
        <Button variant="ghost" className="rounded-full" onClick={() => setResults(null)}>
          <RotateCcw aria-hidden="true" />
          Upload new files
        </Button>
      </div>
      <StatsCards
        following={results.data.following.length}
        followers={results.data.followers.length}
        notFollowingBack={results.notFollowingBack.length}
      />
      <ResultsList accounts={results.notFollowingBack} unfollowed={unfollowed} onToggle={toggle} />
    </div>
  )
}
