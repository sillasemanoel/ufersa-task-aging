'use client'

import { PlusIcon, TimerIcon } from 'lucide-react'

import { useTaskManager } from '@/hooks/use-task-manager'

import { Copyright } from '../custom/copyright'
import { Dialog } from '../custom/dialog'
import { SwitchTheme } from '../custom/switch-theme'
import { TaskCreateForm } from '../custom/task-create-form'
import { Footer, Header, Main, Section, Template } from '../custom/template'
import { TimerUpdateForm } from '../custom/timer-update-form'
import { Empty } from './empty'
import { Item } from './item'

export function HomeContent() {
  const { tasks } = useTaskManager()

  return (
    <Template>
      <Header>
        <Dialog
          description="Customize para uma melhor experiência."
          icon={TimerIcon}
          size="icon"
          title="Tempo de Prioridade"
          variant="outline"
        >
          <TimerUpdateForm />
        </Dialog>

        <SwitchTheme />

        <Dialog
          description="Preencha o formulário para criar uma nova tarefa."
          icon={PlusIcon}
          label="Criar"
          title="Criar Tarefa"
        >
          <TaskCreateForm />
        </Dialog>
      </Header>

      <Main>
        <Section>
          {!tasks.length ? (
            <Empty />
          ) : (
            <>
              {tasks.map((task) => (
                <Item key={task.id} task={task} />
              ))}
            </>
          )}
        </Section>
      </Main>

      <Footer>
        <Copyright />
      </Footer>
    </Template>
  )
}
