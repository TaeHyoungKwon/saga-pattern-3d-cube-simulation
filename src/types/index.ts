export type Communication = 'sync' | 'async'
export type Consistency = 'atomic' | 'eventual'
export type Coordination = 'orchestration' | 'choreography'
export type Grade = 'low' | 'medium' | 'high'

export type SagaPattern = {
  id: string
  name: string
  communication: Communication
  consistency: Consistency
  coordination: Coordination
  description: string
  advantages: string[]
  disadvantages: string[]
  useCases: string[]
  complexity: Grade
  scalability: Grade
  position: [number, number, number]
}

export type StepActor =
  | 'Client'
  | 'Orchestrator'
  | 'OrderService'
  | 'PaymentService'
  | 'InventoryService'
  | 'ShippingService'

export type SagaStep = {
  from: StepActor
  to: StepActor
  action: string
  type: 'command' | 'event' | 'compensation' | 'response'
  isAsync: boolean
}

export type FailurePoint = 'payment' | 'inventory' | 'shipping'

export type SagaScenario = {
  patternId: string
  happyPath: SagaStep[]
  failurePaths: Record<FailurePoint, SagaStep[]>
}

export type ViewMode = 'happy' | 'failure' | 'combined'
