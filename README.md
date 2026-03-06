# Saga Pattern Explorer

8가지 Saga 패턴을 3D 큐브로 시각화하여 학습하는 인터랙티브 웹 애플리케이션.

**Live Demo**: https://taehyoungkwon.github.io/saga-pattern-3d-cube-simulation/

## Overview

Saga 패턴은 3개의 축 조합으로 이해됩니다:

| Axis | Values |
|------|--------|
| Communication | Sync / Async |
| Consistency | Atomic / Eventual |
| Coordination | Orchestration / Choreography |

이 3축의 조합으로 생성되는 **8개의 Saga 패턴**을 3D 큐브의 꼭짓점으로 배치하여, 패턴 간 구조적 관계를 직관적으로 탐색할 수 있습니다.

### 8 Patterns

| Pattern | Code | Communication | Consistency | Coordination |
|---------|------|---------------|-------------|--------------|
| Epic Saga | sao | Sync | Atomic | Orchestration |
| Phone Tag Saga | sac | Sync | Atomic | Choreography |
| Fairy Tale Saga | seo | Sync | Eventual | Orchestration |
| Time Travel Saga | sec | Sync | Eventual | Choreography |
| Fantasy Fiction Saga | aao | Async | Atomic | Orchestration |
| Horror Story Saga | aac | Async | Atomic | Choreography |
| Parallel Saga | aeo | Async | Eventual | Orchestration |
| Anthology Saga | aec | Async | Eventual | Choreography |

## Features

- **3D Cube Visualization** - 마우스 드래그로 회전, 스크롤로 줌
- **Pattern Detail Panel** - 패턴 설명, 장단점, 사용사례, 복잡도/확장성
- **Sequence Diagram** - Mermaid.js 기반 시퀀스 다이어그램 (전체화면 + 줌 지원)
- **Failure Simulation** - Payment / Inventory / Shipping 실패 주입 및 보상 트랜잭션 시각화
- **View Modes** - Happy Path / Failure / Combined 뷰 전환
- **Pattern Search** - `/` 키로 패턴 검색
- **Dark / Light Mode** - 테마 토글 (localStorage 저장)
- **Responsive Layout** - Desktop 좌우 분할 / Tablet 상하 분할 / Mobile 드로어

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| 3D | React Three Fiber + drei |
| Diagram | Mermaid.js |
| State | Zustand |
| Styling | Tailwind CSS |
| Deploy | GitHub Pages + GitHub Actions |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root layout + theme management
├── components/
│   ├── cube/
│   │   ├── CubeScene.tsx             # R3F Canvas + camera + lighting
│   │   ├── CubeEdges.tsx             # Cube wireframe (highlight on select)
│   │   ├── CubeSearch.tsx            # Pattern search overlay
│   │   ├── PatternNode.tsx           # Vertex sphere + label + dimming
│   │   └── AxisLabels.tsx            # Axis labels (highlight on select)
│   ├── detail/
│   │   ├── DetailPanel.tsx           # Detail panel container
│   │   ├── PatternInfo.tsx           # Pattern info card
│   │   ├── SequenceDiagram.tsx       # Mermaid sequence diagram + fullscreen
│   │   └── FailureInjector.tsx       # Failure injection buttons
│   └── layout/
│       ├── Header.tsx                # Header + theme toggle
│       └── Legend.tsx                # Axis/color legend
├── data/
│   ├── patterns.ts                   # 8 pattern definitions
│   └── scenarios.ts                  # Pattern sequence scenarios
├── store/
│   └── useStore.ts                   # Zustand store
├── types/
│   └── index.ts                      # TypeScript types
└── utils/
    └── mermaid.ts                    # Mermaid diagram generator
```

## Documentation

- [PRD](docs/PRD.md) - Product Requirements Document
- [SPEC](docs/SPEC.md) - Technical Specification
