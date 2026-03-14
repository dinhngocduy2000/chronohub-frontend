import { createFileRoute } from '@tanstack/react-router'
import { getTranslations } from '@/lib/translation'

export const Route = createFileRoute('/_authenticated/')({ component: HomePage })

const t = getTranslations()

function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">{t.sidebar_home()}</h1>
      <p className="mt-2 text-muted-foreground">{t.welcome()}</p>
    </div>
  )
}
