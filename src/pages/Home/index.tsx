import { HandPalm, Play, } from "phosphor-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'


import { HomeContainer, StartCoutdowmButton, StopCoutdowmButton } from "./styles";
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1,'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'o ciclo precisar ser no minimo 5 minutos')
    .max(60, 'o ciclo precisar ser no maximo 60 minutos'),
})

type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task:string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {  
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCicleId] = useState<string | null>(null)
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const {register, handleSubmit, watch, reset} = useForm<NewCycleFormDate>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task:'',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate,
        )

        if(secondsDifference>=totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if(cycle.id === activeCycleId) {
                return {...cycle, finishedDate: new Date()}
              } else {
                return cycle
              }
            }),    
          )
        setamountSecondsPassed(totalSeconds)  
        clearInterval(interval)
        } else {        
        setamountSecondsPassed(secondsDifference)
        } 
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }

  }, [activeCycle])

  function handleInterruptCycle() {
    setCycles((state) =>
    state.map((cycle) => {
      if(cycle.id === activeCycleId) {
        return {...cycle, interruptedDate: new Date()}
    } else {
      return cycle
    }
  }),    
  )
  setActiveCicleId(null)
}

  function handleCreateNewCycle (data:NewCycleFormDate) {   
    
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCicleId(id)
    setamountSecondsPassed(0)

    reset()
  }  
  
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2,'0')
  const seconds = String(secondsAmount).padStart(2,'0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }    
  }, [minutes,seconds,activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>  
      <NewCycleForm/>  
      <Countdown/>  

        { activeCycle ? (
          <StopCoutdowmButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24}/>
          Interromper          
          </StopCoutdowmButton>         
        ) : (
          <StartCoutdowmButton disabled={isSubmitDisabled} type="submit">
          <Play size={24}/>
          Começar
        </StartCoutdowmButton>
        )}
      </form>  
    </HomeContainer>
  )
}