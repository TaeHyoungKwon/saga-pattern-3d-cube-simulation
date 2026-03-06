아래 PRD는 **Saga 패턴 학습용 인터랙티브 웹(3D 큐브 시각화)**를 실제 구현 가능한 수준으로 정리한 문서입니다.
목표는 **“8가지 Saga 패턴을 한 번에 이해하게 만드는 탐색형 학습 도구”**입니다.

---

# PRD — Saga Pattern Explorer (3D Cube Visualization)

## 1. 제품 개요

### 1.1 제품 이름

**Saga Pattern Explorer**

### 1.2 문제 정의

Saga 패턴은 다음 **3개의 축** 조합으로 이해됩니다.

* 통신 방식

  * 동기 (Sync)
  * 비동기 (Async)

* 일관성 모델

  * 원자적 일관성 (Atomic)
  * 최종 일관성 (Eventual)

* 조율 방식

  * 오케스트레이션 (Orchestration)
  * 코레오그래피 (Choreography)

이 3축 조합으로 **총 8개의 Saga 패턴**이 생성됩니다.

그러나 대부분의 학습 자료는

* 개념 설명 위주
* 정적인 다이어그램
* 패턴 간 관계가 보이지 않음

이라는 문제가 있습니다.

결과적으로 학습자는

* 패턴 간 차이
* 왜 그런 구조가 되는지
* 실패 시 동작 차이

를 직관적으로 이해하기 어렵습니다.

---

## 1.3 해결 방법

**3D Cube Visualization**

3개의 축을 공간 좌표로 표현합니다.

```
X axis → 통신 방식
Y axis → 일관성 모델
Z axis → 조율 방식
```

그 결과 **3차원 큐브**가 생성됩니다.

```
           Async
             ↑
             │
      ┌──────┼──────┐
      │      │      │
      │      │      │
      │      │      │
Atomic ───────────── Eventual
      │      │      │
      │      │      │
      │      │      │
      └──────┼──────┘
             │
         Sync
```

큐브의 **8개 꼭짓점이 각각 하나의 Saga 패턴**입니다.

사용자는

* 큐브를 회전
* 꼭짓점 선택
* 패턴 탐색

을 통해 Saga 패턴을 이해합니다.

---

# 2. 사용자 목표

### Primary User

* 백엔드 개발자
* MSA 아키텍처 학습자
* 시스템 설계 학습자

### 사용자 목표

사용자는 이 도구를 통해 다음 질문에 답할 수 있어야 합니다.

* Saga 패턴이 왜 여러 종류로 나뉘는가
* 각 패턴은 어떤 트레이드오프를 가지는가
* 실패 시 어떻게 복구되는가
* 어떤 상황에서 어떤 패턴이 적합한가

---

# 3. 핵심 사용자 경험

사용자가 도구를 사용하는 흐름

```
1. 3D 큐브 확인
2. 큐브 회전
3. 특정 패턴 클릭
4. 패턴 상세 보기
5. 시퀀스 다이어그램 확인
6. 성공/실패 시나리오 시뮬레이션
7. 다른 패턴과 비교
```

---

# 4. 핵심 기능

## 4.1 3D Cube Visualization

### 목적

Saga 패턴의 구조적 관계를 직관적으로 표현

### 기능

* 큐브 회전
* 줌
* 꼭짓점 클릭
* 축 설명 표시

### 축 정의

```
X axis → 통신 방식
    Sync
    Async

Y axis → 일관성 모델
    Atomic
    Eventual

Z axis → 조율 방식
    Orchestration
    Choreography
```

---

## 4.2 패턴 노드 (Cube Vertex)

각 꼭짓점은 하나의 Saga 패턴입니다.

### 총 8개 패턴

코드 규칙: `[통신][일관성][조율]` — s=Sync, a=Async, a=Atomic, e=Eventual, o=Orchestration, c=Choreography

| Pattern              | Code | Communication | Consistency | Coordination    |
| -------------------- | ---- | ------------- | ----------- | --------------- |
| Epic Saga            | sao  | Sync          | Atomic      | Orchestration   |
| Phone Tag Saga       | sac  | Sync          | Atomic      | Choreography    |
| Fairy Tale Saga      | seo  | Sync          | Eventual    | Orchestration   |
| Time Travel Saga     | sec  | Sync          | Eventual    | Choreography    |
| Fantasy Fiction Saga | aao  | Async         | Atomic      | Orchestration   |
| Horror Story Saga    | aac  | Async         | Atomic      | Choreography    |
| Parallel Saga        | aeo  | Async         | Eventual    | Orchestration   |
| Anthology Saga       | aec  | Async         | Eventual    | Choreography    |

### 노드 표시 정보

```
패턴 이름
3축 속성
간단한 설명
```

예

```
Parallel Saga

Async
Eventual
Orchestration
```

---

# 5. 패턴 상세 화면

패턴 노드를 클릭하면 상세 패널이 열립니다.

### 구성

```
패턴 이름
특성 요약 (3축 속성)
장점
단점
추천 사용 상황
복잡도 (Low / Medium / High)
확장성 (Low / Medium / High)
```

### 패턴별 복잡도/확장성 매트릭스

| Pattern              | 복잡도   | 확장성   |
| -------------------- | -------- | -------- |
| Epic Saga            | Low      | Low      |
| Phone Tag Saga       | Medium   | Low      |
| Fairy Tale Saga      | Medium   | Medium   |
| Time Travel Saga     | High     | Medium   |
| Fantasy Fiction Saga | Medium   | Medium   |
| Horror Story Saga    | High     | Medium   |
| Parallel Saga        | Medium   | High     |
| Anthology Saga       | High     | High     |

### 예

**Parallel Saga**

특징

```
비동기
최종 일관성
오케스트레이션
```

장점

* 높은 확장성
* 명확한 워크플로 제어
* 비교적 낮은 복잡도

단점

* 중앙 오케스트레이터 필요

---

# 6. 시퀀스 다이어그램

각 패턴에는 **동일한 시나리오 기반 시퀀스 다이어그램**이 존재합니다.

### 공통 시나리오

```
주문 생성
결제 승인
재고 예약
배송 생성
주문 완료
```

### 표시 모드

사용자는 다음을 선택할 수 있습니다.

```
Happy Path
Failure Path
Combined View
```

Combined View는

```
alt success
alt failure
```

형태로 표시됩니다.

---

# 7. 시뮬레이션 기능

사용자는 실패 상황을 직접 주입할 수 있습니다.

### 실패 지점

```
Payment 실패
Inventory 실패
Shipping 실패
```

### UI

```
Failure Injection
[ Payment ]
[ Inventory ]
[ Shipping ]
```

실패를 선택하면

* 시퀀스 다이어그램 변경
* 보상 트랜잭션 표시

### 보상 트랜잭션 규칙

실패 발생 시, 이미 성공한 단계를 **역순**으로 보상합니다.

```
실패 지점별 보상 순서:

Payment 실패  → 보상 없음 (첫 단계)
Inventory 실패 → Payment 취소
Shipping 실패  → Inventory 해제 → Payment 취소
```

패턴별 보상 방식 차이:

* Orchestration → 오케스트레이터가 보상 명령을 순서대로 발행
* Choreography → 각 서비스가 실패 이벤트를 수신하여 자체 보상
* Atomic → 즉시 롤백 (동기적 보상)
* Eventual → 비동기 보상 (최종적 일관성 복구)

---

# 8. 패턴 비교 기능

사용자는 두 패턴을 비교할 수 있습니다.

### 비교 요소

| 항목  | 비교                            |
| --- | ----------------------------- |
| 통신  | Sync vs Async                 |
| 일관성 | Atomic vs Eventual            |
| 조율  | Orchestration vs Choreography |
| 복잡도 | Low / Medium / High           |
| 확장성 | Low / Medium / High           |

### 비교 화면

```
Parallel Saga  vs  Anthology Saga
```

---

# 9. 시각화 규칙

### 색상 규칙

```
정상 흐름 → 파랑 (#3B82F6)
보상 트랜잭션 → 빨강 (#EF4444)
이벤트 → 보라 (#8B5CF6)
실패 지점 → 주황 (#F59E0B)
선택된 노드 → 초록 (#10B981)
비선택 노드 → 회색 (#6B7280)
큐브 엣지 → 밝은 회색 (#D1D5DB)
```

### 큐브 노드 상태

```
기본 → 반투명 구체 + 패턴 이름 라벨
호버 → 구체 확대 + 하이라이트 + 3축 속성 툴팁
선택 → 구체 색상 변경 + 상세 패널 열림
```

---

# 10. 기술 스택

### Frontend

```
React 18+
TypeScript 5+
Vite (빌드 도구)
```

### 3D Visualization

```
React Three Fiber (@react-three/fiber)
@react-three/drei (헬퍼 컴포넌트)
```

### Diagram Rendering

```
Mermaid.js
```

### State Management

```
Zustand
```

### Styling

```
Tailwind CSS
```

### 배포

```
정적 사이트 (GitHub Pages 또는 Vercel)
```

---

# 11. 데이터 모델

패턴 정의

```ts
type SagaPattern = {
  id: string
  name: string
  communication: "sync" | "async"
  consistency: "atomic" | "eventual"
  coordination: "orchestration" | "choreography"
  description: string
  advantages: string[]
  disadvantages: string[]
}
```

---

시나리오

```ts
type SagaScenario = {
  steps: SagaStep[]
}
```

---

Saga Step

```ts
type SagaStep = {
  actor: string
  action: string
  target: string
  type: "command" | "event" | "compensation"
  isAsync: boolean
}
```

---

# 11.1 UI 레이아웃

```
┌─────────────────────────────────────────────────┐
│  Header: Saga Pattern Explorer                  │
├────────────────────────┬────────────────────────┤
│                        │                        │
│    3D Cube View        │    Detail Panel        │
│    (60%)               │    (40%)               │
│                        │    - 패턴 정보          │
│                        │    - 시퀀스 다이어그램   │
│                        │    - 실패 주입 버튼     │
│                        │                        │
├────────────────────────┴────────────────────────┤
│  Footer: 축 범례 / 색상 범례                      │
└─────────────────────────────────────────────────┘
```

### 반응형

* Desktop (1024px+): 좌우 분할 레이아웃
* Tablet (768px~1023px): 큐브 상단 + 패널 하단
* Mobile (< 768px): 큐브 전체 화면 + 패널 드로어

---

# 12. MVP 범위

### MVP

* 3D 큐브
* 8개 패턴 노드
* 패턴 상세 설명
* 시퀀스 다이어그램
* 성공/실패 토글

### V2

* 시뮬레이션 애니메이션
* 패턴 비교

### V3

* 실시간 상태 머신 시각화
* 이벤트 로그 타임라인
* 패턴 추천 시스템

---

# 13. 성공 지표

### 학습 효과

사용자가 다음 질문에 답할 수 있어야 합니다.

* Saga 패턴은 몇 가지인가?
* 각 패턴의 차이는 무엇인가?
* 언제 어떤 패턴을 써야 하는가?

---

# 14. 확장 가능성

향후 기능

```
EDA 시각화
Workflow Engine 시각화
Kafka 이벤트 흐름 시뮬레이션
Saga Trace Viewer
```