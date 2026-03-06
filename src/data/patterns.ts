import type { SagaPattern } from '../types'

export const patterns: SagaPattern[] = [
  {
    id: 'sao',
    name: 'Epic Saga',
    communication: 'sync',
    consistency: 'atomic',
    coordination: 'orchestration',
    description:
      '중앙 오케스트레이터가 동기적으로 모든 단계를 순차 호출하고, 실패 시 즉시 전체 롤백',
    advantages: ['구현이 단순', '흐름 추적 용이', '즉각적 일관성 보장'],
    disadvantages: ['높은 결합도', '오케스트레이터 병목', '낮은 확장성'],
    useCases: [
      '소규모 모놀리식 전환 초기',
      '강한 일관성이 필요한 금융 거래',
    ],
    complexity: 'low',
    scalability: 'low',
    position: [-1, -1, -1],
  },
  {
    id: 'sac',
    name: 'Phone Tag Saga',
    communication: 'sync',
    consistency: 'atomic',
    coordination: 'choreography',
    description:
      '각 서비스가 동기적으로 다음 서비스를 직접 호출하고, 실패 시 호출 체인을 따라 즉시 롤백',
    advantages: [
      '중앙 조율자 불필요',
      '서비스 간 직접 통신으로 낮은 지연',
      '단순한 체인 구조',
    ],
    disadvantages: [
      '호출 체인이 길어지면 추적 어려움',
      '서비스 간 강한 결합',
      '동기 호출로 인한 병목',
    ],
    useCases: [
      '서비스 수가 적은 간단한 워크플로',
      '즉각적 응답이 필요한 동기 처리',
    ],
    complexity: 'medium',
    scalability: 'low',
    position: [-1, -1, 1],
  },
  {
    id: 'seo',
    name: 'Fairy Tale Saga',
    communication: 'sync',
    consistency: 'eventual',
    coordination: 'orchestration',
    description:
      '오케스트레이터가 동기적으로 각 단계를 호출하지만, 각 단계는 독립 커밋 후 비동기 보상으로 복구',
    advantages: [
      '명확한 워크플로 제어',
      '각 단계 독립적 커밋 가능',
      '부분 실패 허용',
    ],
    disadvantages: [
      '보상 지연 가능',
      '임시 불일치 상태 존재',
      '보상 로직 복잡',
    ],
    useCases: [
      '장기 실행 비즈니스 프로세스',
      '일시적 불일치를 허용하는 주문 처리',
    ],
    complexity: 'medium',
    scalability: 'medium',
    position: [-1, 1, -1],
  },
  {
    id: 'sec',
    name: 'Time Travel Saga',
    communication: 'sync',
    consistency: 'eventual',
    coordination: 'choreography',
    description:
      '각 서비스가 동기 호출로 다음 서비스를 트리거하고, 독립 커밋 후 실패 시 역방향 보상 이벤트 전파',
    advantages: [
      '중앙 조율자 불필요',
      '각 서비스 자율적 보상',
      '부분 실패 허용',
    ],
    disadvantages: [
      '보상 체인 추적 어려움',
      '디버깅 복잡',
      '보상 순서 보장 어려움',
    ],
    useCases: [
      '서비스 자율성이 중요한 환경',
      '최종 일관성으로 충분한 비즈니스 로직',
    ],
    complexity: 'high',
    scalability: 'medium',
    position: [-1, 1, 1],
  },
  {
    id: 'aao',
    name: 'Fantasy Fiction Saga',
    communication: 'async',
    consistency: 'atomic',
    coordination: 'orchestration',
    description:
      '오케스트레이터가 비동기 메시지로 각 단계를 호출하되, 전체를 하나의 트랜잭션으로 관리하여 즉시 롤백',
    advantages: [
      '비동기 통신으로 느슨한 결합',
      '명확한 트랜잭션 경계',
      '오케스트레이터의 중앙 제어',
    ],
    disadvantages: [
      '분산 트랜잭션 구현 복잡',
      '2PC 또는 유사 프로토콜 필요',
      '메시지 순서 보장 필요',
    ],
    useCases: [
      '비동기 환경에서 강한 일관성이 필요한 경우',
      '금융 거래의 비동기 처리',
    ],
    complexity: 'medium',
    scalability: 'medium',
    position: [1, -1, -1],
  },
  {
    id: 'aac',
    name: 'Horror Story Saga',
    communication: 'async',
    consistency: 'atomic',
    coordination: 'choreography',
    description:
      '각 서비스가 비동기 이벤트로 소통하면서 전체 원자적 일관성을 유지, 실패 시 이벤트 기반 즉시 롤백',
    advantages: [
      '높은 분산성',
      '서비스 독립성',
      '이벤트 기반 확장 용이',
    ],
    disadvantages: [
      '원자적 일관성 보장 매우 어려움',
      '이벤트 순서 문제',
      '디버깅 극히 어려움',
    ],
    useCases: [
      '이벤트 소싱 기반 시스템',
      '높은 분산성이 필요하나 일관성도 중요한 경우',
    ],
    complexity: 'high',
    scalability: 'medium',
    position: [1, -1, 1],
  },
  {
    id: 'aeo',
    name: 'Parallel Saga',
    communication: 'async',
    consistency: 'eventual',
    coordination: 'orchestration',
    description:
      '오케스트레이터가 비동기 메시지로 각 단계를 관리하고, 최종 일관성으로 비동기 보상 처리',
    advantages: [
      '높은 확장성',
      '명확한 워크플로 제어',
      '비교적 낮은 복잡도',
    ],
    disadvantages: [
      '중앙 오케스트레이터 필요',
      '보상 지연 가능',
      '임시 불일치 상태',
    ],
    useCases: [
      '대규모 이커머스 주문 처리',
      'MSA 환경의 표준 사가 패턴',
    ],
    complexity: 'medium',
    scalability: 'high',
    position: [1, 1, -1],
  },
  {
    id: 'aec',
    name: 'Anthology Saga',
    communication: 'async',
    consistency: 'eventual',
    coordination: 'choreography',
    description:
      '각 서비스가 독립적으로 이벤트를 발행/구독하고, 최종 일관성으로 자율 보상 처리',
    advantages: [
      '최고의 확장성',
      '완전한 서비스 분리',
      '높은 장애 격리',
    ],
    disadvantages: [
      '흐름 추적 매우 어려움',
      '디버깅 복잡',
      '이벤트 스톰 위험',
    ],
    useCases: [
      '대규모 이벤트 드리븐 아키텍처',
      '마이크로서비스 간 완전 분리가 필요한 시스템',
    ],
    complexity: 'high',
    scalability: 'high',
    position: [1, 1, 1],
  },
]

export function getPatternById(id: string) {
  return patterns.find((p) => p.id === id) ?? null
}

// 8 distinct colors for each pattern (avoids axis colors: blue/green/purple)
export const patternColors: Record<string, string> = {
  sao: '#F87171', // Epic Saga - red
  sac: '#FB923C', // Phone Tag Saga - orange
  seo: '#FBBF24', // Fairy Tale Saga - amber
  sec: '#2DD4BF', // Time Travel Saga - teal
  aao: '#22D3EE', // Fantasy Fiction Saga - cyan
  aac: '#818CF8', // Horror Story Saga - indigo
  aeo: '#F472B6', // Parallel Saga - pink
  aec: '#E879F9', // Anthology Saga - fuchsia
}
