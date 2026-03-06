import type { SagaStep, SagaScenario, ViewMode, FailurePoint, StepActor } from '../types'

const actorAlias: Record<StepActor, string> = {
  Client: 'C',
  Orchestrator: 'O',
  OrderService: 'OS',
  PaymentService: 'PS',
  InventoryService: 'IS',
  ShippingService: 'SS',
}

const actorLabel: Record<StepActor, string> = {
  Client: 'Client',
  Orchestrator: 'Orchestrator',
  OrderService: 'OrderService',
  PaymentService: 'PaymentService',
  InventoryService: 'InventoryService',
  ShippingService: 'ShippingService',
}

function getParticipants(steps: SagaStep[]): StepActor[] {
  const seen = new Set<StepActor>()
  const ordered: StepActor[] = []
  for (const step of steps) {
    if (!seen.has(step.from)) {
      seen.add(step.from)
      ordered.push(step.from)
    }
    if (!seen.has(step.to)) {
      seen.add(step.to)
      ordered.push(step.to)
    }
  }
  return ordered
}

function arrow(step: SagaStep): string {
  if (step.isAsync) return '-->>'
  return '->>'
}

function stepsToMermaidLines(steps: SagaStep[]): string[] {
  const lines: string[] = []
  let inCompensation = false

  for (const step of steps) {
    const from = actorAlias[step.from]
    const to = actorAlias[step.to]
    const arr = arrow(step)

    if (step.type === 'compensation' && !inCompensation) {
      inCompensation = true
      lines.push('    rect rgb(127, 29, 29)')
      lines.push('    Note over O,OS: Compensation Transaction')
    }

    if (step.type !== 'compensation' && inCompensation) {
      inCompensation = false
      lines.push('    end')
    }

    lines.push(`    ${from}${arr}${to}: ${step.action}`)
  }

  if (inCompensation) {
    lines.push('    end')
  }

  return lines
}

function stepsToMermaidLinesChoreography(steps: SagaStep[]): string[] {
  const lines: string[] = []
  let inCompensation = false

  // Find first compensation actor for Note placement
  const firstCompActor = steps.find((s) => s.type === 'compensation')

  for (const step of steps) {
    const from = actorAlias[step.from]
    const to = actorAlias[step.to]
    const arr = arrow(step)

    if (step.type === 'compensation' && !inCompensation) {
      inCompensation = true
      const noteActor = firstCompActor
        ? `${actorAlias[firstCompActor.from]},${actorAlias[firstCompActor.to]}`
        : 'OS,PS'
      lines.push('    rect rgb(127, 29, 29)')
      lines.push(`    Note over ${noteActor}: Compensation Transaction`)
    }

    if (step.type !== 'compensation' && inCompensation) {
      inCompensation = false
      lines.push('    end')
    }

    lines.push(`    ${from}${arr}${to}: ${step.action}`)
  }

  if (inCompensation) {
    lines.push('    end')
  }

  return lines
}

export function generateMermaidDiagram(
  scenario: SagaScenario,
  viewMode: ViewMode,
  failurePoint?: FailurePoint,
): string {
  const fp = failurePoint ?? 'payment'
  const isChoreography = !scenario.happyPath.some((s) => s.from === 'Orchestrator' || s.to === 'Orchestrator')
  const toLines = isChoreography ? stepsToMermaidLinesChoreography : stepsToMermaidLines

  let steps: SagaStep[]
  if (viewMode === 'happy') {
    steps = scenario.happyPath
  } else if (viewMode === 'failure') {
    steps = scenario.failurePaths[fp]
  } else {
    // combined - we'll build it manually
    const participants = getParticipants([...scenario.happyPath, ...scenario.failurePaths[fp]])
    const participantLines = participants.map(
      (a) => `    participant ${actorAlias[a]} as ${actorLabel[a]}`,
    )

    const happyLines = toLines(scenario.happyPath)
    const failureLines = toLines(scenario.failurePaths[fp])

    const failureLabel = fp === 'payment' ? 'Payment' : fp === 'inventory' ? 'Inventory' : 'Shipping'

    return [
      'sequenceDiagram',
      ...participantLines,
      `    alt Success Path`,
      ...happyLines,
      `    else Failure at ${failureLabel}`,
      ...failureLines,
      '    end',
    ].join('\n')
  }

  const participants = getParticipants(steps)
  const participantLines = participants.map(
    (a) => `    participant ${actorAlias[a]} as ${actorLabel[a]}`,
  )

  const bodyLines = toLines(steps)

  return ['sequenceDiagram', ...participantLines, ...bodyLines].join('\n')
}
