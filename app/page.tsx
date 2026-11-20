import { ShieldCheck, UserMinus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { UnfollowChecker } from '@/components/unfollow-checker'

export default function Page() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="ig-gradient pointer-events-none absolute -top-48 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl dark:opacity-25"
      />
      <header className="relative mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="ig-gradient flex size-9 items-center justify-center rounded-xl text-white">
            <UserMinus className="size-4.5" aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-tight">InstaUnfollow Checker</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative mx-auto flex max-w-4xl flex-col gap-10 px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <section className="flex flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            100% Private & Local Processing
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {"See who doesn't "}
            <span className="ig-gradient-text">follow you back</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Upload your Instagram data export and get your list in seconds. No password, no login — your files never
            leave your browser.
          </p>
        </section>

        <UnfollowChecker />
      </main>

      <footer className="relative border-t border-border py-6 text-center text-xs text-muted-foreground">
        Not affiliated with Instagram or Meta. All processing happens on your device.
      </footer>
    </div>
  )
}
