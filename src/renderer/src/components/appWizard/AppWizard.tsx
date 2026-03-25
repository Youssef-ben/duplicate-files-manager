import { useCallback, useMemo, useState } from 'react'
import { WizardFooter, WizardStep } from './components'

export interface AppWizardStep {
  id: number
  label: string
  isActive: boolean
  isRunning: boolean
  isCompleted: boolean
  component: React.ReactNode
}

export interface AppWizardProps {
  steps: AppWizardStep[]
  children?: React.ReactNode
  onFinishClick?: () => void
}

export const AppWizard = ({
  steps,
  children,
  onFinishClick
}: AppWizardProps): React.JSX.Element | null => {
  const [activeIndex, setActiveIndex] = useState(0)

  const { activeStep, isFirstStep, isLastStep } = useMemo(() => {
    const stepCount = steps.length
    if (stepCount === 0) {
      return { activeStep: null, isFirstStep: true, isLastStep: true }
    }
    const idx = Math.min(Math.max(activeIndex, 0), stepCount - 1)
    return {
      activeStep: steps[idx],
      isFirstStep: idx === 0,
      isLastStep: idx === stepCount - 1
    }
  }, [steps, activeIndex])

  const goToNextStep = useCallback(() => {
    setActiveIndex((index) => {
      if (steps.length === 0) return 0
      return Math.min(index + 1, steps.length - 1)
    })
  }, [steps.length])

  const goToPreviousStep = useCallback(() => {
    setActiveIndex((index) => Math.max(index - 1, 0))
  }, [])

  const isWizardCompleted = useMemo(() => {
    return steps.every((step) => step.isCompleted) && isLastStep
  }, [steps, isLastStep])

  const handleOnWizardCompleted = useCallback(() => {
    if (!isWizardCompleted && onFinishClick) return
    onFinishClick?.()
    setActiveIndex(0)
  }, [isWizardCompleted, onFinishClick, setActiveIndex])

  if (!activeStep) {
    return null
  }

  return (
    <div className="flex flex-col rounded-md h-full w-full">
      {/* Wizard Steps*/}
      <div className="flex flex-row items-center justify-left gap-8 w-full h-14 rounded-t-md px-6 pb-2 pt-3 bg-surface-bright border-b border-surface-variant">
        {steps.map((step) => {
          return (
            <WizardStep
              {...step}
              key={step.id}
              isActive={step.id === activeStep.id}
              isCompleted={step.id < activeStep.id}
            />
          )
        })}
      </div>

      {/* Wizard Content */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center w-full h-full overflow-auto p-4">
        {children}
        {activeStep.component}
      </div>

      {/* Wizard Footer */}
      <WizardFooter
        goToPreviousStep={goToPreviousStep}
        isFirstStep={isFirstStep}
        goToNextStep={goToNextStep}
        isLastStep={isLastStep}
        isCompleted={activeStep.isCompleted}
        isRunning={activeStep.isRunning}
        isWizardCompleted={isWizardCompleted}
        onWizardCompleted={handleOnWizardCompleted}
      />
    </div>
  )
}
