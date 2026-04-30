import { NotepadTextIcon } from 'lucide-react'

import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Empty as EmptyUI,
} from '../ui/empty'

export function Empty() {
  return (
    <EmptyUI className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NotepadTextIcon />
        </EmptyMedia>

        <EmptyTitle>Você ainda não tem tarefas</EmptyTitle>

        <EmptyDescription>
          Crie tarefas e organize suas prioridades.
        </EmptyDescription>
      </EmptyHeader>
    </EmptyUI>
  )
}
