import JSZip from 'jszip'

export type IgAccount = {
  username: string
  href: string
  timestamp?: number
}

export type ParsedData = {
  followers: IgAccount[]
  following: IgAccount[]
  sources: string[]
}

export class ParseError extends Error {}

type Kind = 'followers' | 'following' | 'unknown'

type RawEntry = {
  title?: string
  string_list_data?: { href?: string; value?: string; timestamp?: number }[]
}

const FOLLOWERS_FILE = /(^|\/)followers(_\d+)?\.json$/i
const FOLLOWING_FILE = /(^|\/)following\.json$/i
const HTML_EXPORT = /(^|\/)(followers(_\d+)?|following)\.html$/i

function usernameFromHref(href: string) {
  const match = href.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i)
  return match?.[1] ?? ''
}

function toAccount(entry: RawEntry): IgAccount | null {
  const item = entry?.string_list_data?.[0]
  const href = item?.href ?? ''
  const raw = item?.value || entry?.title || usernameFromHref(href)
  const username = raw.trim().replace(/^@/, '').toLowerCase()
  if (!username) return null
  return {
    username,
    href: `https://instagram.com/${username}`,
    timestamp: item?.timestamp,
  }
}

function classify(json: unknown): { kind: Kind; entries: RawEntry[] } {
  if (Array.isArray(json)) {
    return { kind: 'followers', entries: json as RawEntry[] }
  }
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>
    if (Array.isArray(obj.relationships_following)) {
      return { kind: 'following', entries: obj.relationships_following as RawEntry[] }
    }
    if (Array.isArray(obj.relationships_followers)) {
      return { kind: 'followers', entries: obj.relationships_followers as RawEntry[] }
    }
  }
  return { kind: 'unknown', entries: [] }
}

function parseJsonText(text: string, name: string) {
  try {
    return JSON.parse(text)
  } catch {
    throw new ParseError(`"${name}" is not valid JSON. Make sure you selected the JSON format (not HTML) when requesting your data.`)
  }
}

export async function parseInstagramFiles(files: File[]): Promise<ParsedData> {
  const followers = new Map<string, IgAccount>()
  const following = new Map<string, IgAccount>()
  const sources: string[] = []

  const ingest = (json: unknown, name: string) => {
    const { kind, entries } = classify(json)
    if (kind === 'unknown') {
      throw new ParseError(`"${name}" doesn't look like an Instagram followers or following file.`)
    }
    const target = kind === 'followers' ? followers : following
    for (const entry of entries) {
      const account = toAccount(entry)
      if (account && !target.has(account.username)) target.set(account.username, account)
    }
    sources.push(name.split('/').pop() ?? name)
  }

  for (const file of files) {
    const lower = file.name.toLowerCase()

    if (lower.endsWith('.zip') || file.type.includes('zip')) {
      let zip: JSZip
      try {
        zip = await JSZip.loadAsync(file)
      } catch {
        throw new ParseError(`"${file.name}" could not be opened as a ZIP archive. It may be corrupted.`)
      }
      const paths = Object.keys(zip.files).filter((p) => !zip.files[p].dir)
      const relevant = paths.filter((p) => FOLLOWERS_FILE.test(p) || FOLLOWING_FILE.test(p))

      if (relevant.length === 0) {
        if (paths.some((p) => HTML_EXPORT.test(p))) {
          throw new ParseError('This ZIP contains an HTML export. Please request your data again and choose the JSON format.')
        }
        throw new ParseError(`No followers or following files were found inside "${file.name}". Make sure you exported "Followers and following".`)
      }
      for (const path of relevant) {
        const text = await zip.files[path].async('string')
        ingest(parseJsonText(text, path), path)
      }
      continue
    }

    if (lower.endsWith('.json') || file.type === 'application/json') {
      ingest(parseJsonText(await file.text(), file.name), file.name)
      continue
    }

    if (lower.endsWith('.html') || lower.endsWith('.htm')) {
      throw new ParseError(`"${file.name}" is an HTML file. Please request your Instagram data in JSON format.`)
    }

    throw new ParseError(`"${file.name}" isn't supported. Upload a .zip export or the followers_1.json and following.json files.`)
  }

  if (following.size === 0 && followers.size === 0) {
    throw new ParseError('No accounts were found in the uploaded files.')
  }
  if (following.size === 0) {
    throw new ParseError('Missing following.json. Please upload it alongside your followers file.')
  }
  if (followers.size === 0) {
    throw new ParseError('Missing followers_1.json. Please upload it alongside your following file.')
  }

  return {
    followers: [...followers.values()],
    following: [...following.values()],
    sources,
  }
}

export function findNotFollowingBack(data: ParsedData) {
  const followerSet = new Set(data.followers.map((f) => f.username))
  return data.following.filter((f) => !followerSet.has(f.username))
}

export function buildSampleData(): ParsedData {
  const names = [
    'sunset.chaser', 'coffee_and_code', 'mila.travels', 'urban.lens', 'the.daily.bake', 'jordan_fit',
    'pixelpilot', 'noah.sketches', 'wildflower.studio', 'retro.wheels', 'plantmom.ava', 'skyline.shots',
    'chef.marco', 'indie.beats', 'ocean.drift', 'bookish.ella', 'golden.hour.co', 'tiny.kitchen',
    'neon.nights', 'hike.with.sam', 'minimal.spaces', 'vinyl.vault', 'paws.and.tails', 'street.style.kai',
    'studio.lumen', 'mountain.mia', 'late.night.eats', 'ceramics.by.lu', 'film.grain', 'surf.report',
  ]
  const now = Math.floor(Date.now() / 1000)
  const following = names.map((username, i) => ({
    username,
    href: `https://instagram.com/${username}`,
    timestamp: now - i * 86400 * 17,
  }))
  const followers = names
    .filter((_, i) => i % 3 !== 0)
    .concat(['bestfriend.jo', 'cousin.leo'])
    .map((username) => ({ username, href: `https://instagram.com/${username}` }))
  return { followers, following, sources: ['sample data'] }
}
