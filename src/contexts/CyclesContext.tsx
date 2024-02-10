import { ReactNode, createContext, useEffect, useReducer, useState } from "react"
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { InterruptCurrentCycleAction, addNewCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

interface  CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
  cycles: Cycle[]    
}  

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesConextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ 
  children 
}:CyclesConextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, 
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0'
      )      

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )  

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  
  const [amountSecondsPassed, setamountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate)) 
    }
    
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])      
  
  function setSecondPassed(seconds: number) {
    setamountSecondsPassed(seconds)
  }
    
  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())    
  }  

  function InterruptCurrentCycle() {
    dispatch(InterruptCurrentCycleAction())  
    
  }
    
  function createNewCycle(data:CreateCycleData) {   
      
    const id = String(new Date().getTime())
    
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))  
    
    setamountSecondsPassed(0)  
  }

  return(
      <CyclesContext.Provider 
        value={{ 
          activeCycle, 
          activeCycleId, 
          markCurrentCycleAsFinished, 
          amountSecondsPassed,
          setSecondPassed,
          createNewCycle, 
          InterruptCurrentCycle,
          cycles,
        }}
      >
        {children}
      </CyclesContext.Provider>
  )
}