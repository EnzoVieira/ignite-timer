import { HandPalm, Play } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles"

import { Countdown } from "./components/Countdown"
import { NewCycleForm } from "./components/NewCycleForm"
import { useCycles } from "../../context/CyclesContext"

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
})

type NewCycleFormDataType = zod.infer<typeof newCycleValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useCycles()

  const newCycleForm = useForm<NewCycleFormDataType>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const task = watch("task")
  const isSubmitDisabled = !task

  function handleCreateNewCycle(data: NewCycleFormDataType) {
    createNewCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
