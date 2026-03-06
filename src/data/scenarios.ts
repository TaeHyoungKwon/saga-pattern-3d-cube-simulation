import type { SagaStep, SagaScenario, FailurePoint } from '../types'

// ─── Factory helpers ───────────────────────────────────────────

function buildOrchestrationHappyPath(isAsync: boolean): SagaStep[] {
  const t = isAsync ? 'event' : 'command'
  return [
    { from: 'Client', to: 'Orchestrator', action: '주문 요청', type: t, isAsync },
    { from: 'Orchestrator', to: 'OrderService', action: '주문 생성', type: t, isAsync },
    { from: 'OrderService', to: 'Orchestrator', action: '주문 생성 완료', type: 'response', isAsync },
    { from: 'Orchestrator', to: 'PaymentService', action: '결제 승인', type: t, isAsync },
    { from: 'PaymentService', to: 'Orchestrator', action: '결제 완료', type: 'response', isAsync },
    { from: 'Orchestrator', to: 'InventoryService', action: '재고 예약', type: t, isAsync },
    { from: 'InventoryService', to: 'Orchestrator', action: '재고 예약 완료', type: 'response', isAsync },
    { from: 'Orchestrator', to: 'ShippingService', action: '배송 생성', type: t, isAsync },
    { from: 'ShippingService', to: 'Orchestrator', action: '배송 생성 완료', type: 'response', isAsync },
    { from: 'Orchestrator', to: 'Client', action: '주문 완료', type: 'response', isAsync },
  ]
}

function buildChoreographyHappyPath(isAsync: boolean): SagaStep[] {
  const t = isAsync ? 'event' : 'command'
  return [
    { from: 'Client', to: 'OrderService', action: '주문 요청', type: t, isAsync },
    { from: 'OrderService', to: 'PaymentService', action: '주문 생성 → 결제 요청', type: t, isAsync },
    { from: 'PaymentService', to: 'InventoryService', action: '결제 완료 → 재고 예약', type: t, isAsync },
    { from: 'InventoryService', to: 'ShippingService', action: '재고 예약 → 배송 생성', type: t, isAsync },
    { from: 'ShippingService', to: 'Client', action: '주문 완료', type: 'response', isAsync },
  ]
}

function buildOrchestrationFailure(
  isAsync: boolean,
  failurePoint: FailurePoint,
): SagaStep[] {
  const t = isAsync ? 'event' : 'command'
  const steps: SagaStep[] = [
    { from: 'Client', to: 'Orchestrator', action: '주문 요청', type: t, isAsync },
    { from: 'Orchestrator', to: 'OrderService', action: '주문 생성', type: t, isAsync },
    { from: 'OrderService', to: 'Orchestrator', action: '주문 생성 완료', type: 'response', isAsync },
  ]

  if (failurePoint === 'payment') {
    steps.push(
      { from: 'Orchestrator', to: 'PaymentService', action: '결제 승인', type: t, isAsync },
      { from: 'PaymentService', to: 'Orchestrator', action: '결제 실패', type: 'response', isAsync },
      // compensation
      { from: 'Orchestrator', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
      { from: 'OrderService', to: 'Orchestrator', action: '주문 취소 완료', type: 'compensation', isAsync },
    )
  } else if (failurePoint === 'inventory') {
    steps.push(
      { from: 'Orchestrator', to: 'PaymentService', action: '결제 승인', type: t, isAsync },
      { from: 'PaymentService', to: 'Orchestrator', action: '결제 완료', type: 'response', isAsync },
      { from: 'Orchestrator', to: 'InventoryService', action: '재고 예약', type: t, isAsync },
      { from: 'InventoryService', to: 'Orchestrator', action: '재고 예약 실패', type: 'response', isAsync },
      // compensation
      { from: 'Orchestrator', to: 'PaymentService', action: '결제 취소', type: 'compensation', isAsync },
      { from: 'PaymentService', to: 'Orchestrator', action: '결제 취소 완료', type: 'compensation', isAsync },
      { from: 'Orchestrator', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
      { from: 'OrderService', to: 'Orchestrator', action: '주문 취소 완료', type: 'compensation', isAsync },
    )
  } else {
    // shipping
    steps.push(
      { from: 'Orchestrator', to: 'PaymentService', action: '결제 승인', type: t, isAsync },
      { from: 'PaymentService', to: 'Orchestrator', action: '결제 완료', type: 'response', isAsync },
      { from: 'Orchestrator', to: 'InventoryService', action: '재고 예약', type: t, isAsync },
      { from: 'InventoryService', to: 'Orchestrator', action: '재고 예약 완료', type: 'response', isAsync },
      { from: 'Orchestrator', to: 'ShippingService', action: '배송 생성', type: t, isAsync },
      { from: 'ShippingService', to: 'Orchestrator', action: '배송 생성 실패', type: 'response', isAsync },
      // compensation
      { from: 'Orchestrator', to: 'InventoryService', action: '재고 해제', type: 'compensation', isAsync },
      { from: 'InventoryService', to: 'Orchestrator', action: '재고 해제 완료', type: 'compensation', isAsync },
      { from: 'Orchestrator', to: 'PaymentService', action: '결제 취소', type: 'compensation', isAsync },
      { from: 'PaymentService', to: 'Orchestrator', action: '결제 취소 완료', type: 'compensation', isAsync },
      { from: 'Orchestrator', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
      { from: 'OrderService', to: 'Orchestrator', action: '주문 취소 완료', type: 'compensation', isAsync },
    )
  }

  steps.push(
    { from: 'Orchestrator', to: 'Client', action: '주문 실패', type: 'response', isAsync },
  )

  return steps
}

function buildChoreographyFailure(
  isAsync: boolean,
  failurePoint: FailurePoint,
): SagaStep[] {
  const t = isAsync ? 'event' : 'command'
  const steps: SagaStep[] = [
    { from: 'Client', to: 'OrderService', action: '주문 요청', type: t, isAsync },
  ]

  if (failurePoint === 'payment') {
    steps.push(
      { from: 'OrderService', to: 'PaymentService', action: '주문 생성 → 결제 요청', type: t, isAsync },
      { from: 'PaymentService', to: 'OrderService', action: '결제 실패', type: 'response', isAsync },
      // compensation
      { from: 'OrderService', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
    )
  } else if (failurePoint === 'inventory') {
    steps.push(
      { from: 'OrderService', to: 'PaymentService', action: '주문 생성 → 결제 요청', type: t, isAsync },
      { from: 'PaymentService', to: 'InventoryService', action: '결제 완료 → 재고 예약', type: t, isAsync },
      { from: 'InventoryService', to: 'PaymentService', action: '재고 예약 실패', type: 'response', isAsync },
      // compensation
      { from: 'PaymentService', to: 'PaymentService', action: '결제 취소', type: 'compensation', isAsync },
      { from: 'PaymentService', to: 'OrderService', action: '결제 취소 알림', type: 'compensation', isAsync },
      { from: 'OrderService', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
    )
  } else {
    // shipping
    steps.push(
      { from: 'OrderService', to: 'PaymentService', action: '주문 생성 → 결제 요청', type: t, isAsync },
      { from: 'PaymentService', to: 'InventoryService', action: '결제 완료 → 재고 예약', type: t, isAsync },
      { from: 'InventoryService', to: 'ShippingService', action: '재고 예약 → 배송 생성', type: t, isAsync },
      { from: 'ShippingService', to: 'InventoryService', action: '배송 생성 실패', type: 'response', isAsync },
      // compensation
      { from: 'InventoryService', to: 'InventoryService', action: '재고 해제', type: 'compensation', isAsync },
      { from: 'InventoryService', to: 'PaymentService', action: '재고 해제 알림', type: 'compensation', isAsync },
      { from: 'PaymentService', to: 'PaymentService', action: '결제 취소', type: 'compensation', isAsync },
      { from: 'PaymentService', to: 'OrderService', action: '결제 취소 알림', type: 'compensation', isAsync },
      { from: 'OrderService', to: 'OrderService', action: '주문 취소', type: 'compensation', isAsync },
    )
  }

  steps.push(
    { from: 'OrderService', to: 'Client', action: '주문 실패', type: 'response', isAsync },
  )

  return steps
}

// ─── Build 8 scenarios ─────────────────────────────────────────

function buildScenario(
  id: string,
  isOrchestration: boolean,
  isAsync: boolean,
): SagaScenario {
  const happyPath = isOrchestration
    ? buildOrchestrationHappyPath(isAsync)
    : buildChoreographyHappyPath(isAsync)

  const failurePaths: Record<FailurePoint, SagaStep[]> = {
    payment: isOrchestration
      ? buildOrchestrationFailure(isAsync, 'payment')
      : buildChoreographyFailure(isAsync, 'payment'),
    inventory: isOrchestration
      ? buildOrchestrationFailure(isAsync, 'inventory')
      : buildChoreographyFailure(isAsync, 'inventory'),
    shipping: isOrchestration
      ? buildOrchestrationFailure(isAsync, 'shipping')
      : buildChoreographyFailure(isAsync, 'shipping'),
  }

  return { patternId: id, happyPath, failurePaths }
}

export const scenarios: Record<string, SagaScenario> = {
  sao: buildScenario('sao', true, false),
  sac: buildScenario('sac', false, false),
  seo: buildScenario('seo', true, false),
  sec: buildScenario('sec', false, false),
  aao: buildScenario('aao', true, true),
  aac: buildScenario('aac', false, true),
  aeo: buildScenario('aeo', true, true),
  aec: buildScenario('aec', false, true),
}
