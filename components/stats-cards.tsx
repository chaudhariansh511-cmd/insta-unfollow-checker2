import { UserCheck, UserMinus, Users } from 'lucide-react'

type Props = { following: number; followers: number; notFollowingBack: number }

export function StatsCards({ following, followers, notFollowingBack }: Props) {
  const fmt = new Intl.NumberFormat()
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Total Following</p>
          <p className="text-2xl font-semibold tabular-nums">{fmt.format(following)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
          <UserCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Total Followers</p>
          <p className="text-2xl font-semibold tabular-nums">{fmt.format(followers)}</p>
        </div>
      </div>
      <div className="ig-gradient flex items-center gap-4 rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/20">
          <UserMinus className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-white/85">Not Following Back</p>
          <p className="text-2xl font-semibold tabular-nums">{fmt.format(notFollowingBack)}</p>
        </div>
      </div>
    </div>
  )
}
