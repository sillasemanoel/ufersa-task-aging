import { HomeContent } from '@/components/custom/home-content'
import { TaskManagerProvider } from '@/contexts/task-manager'

export default function HomePage() {
  return (
    <TaskManagerProvider>
      <HomeContent />
    </TaskManagerProvider>
  )
}
