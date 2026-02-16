export interface Template {
  name: string;
  category: string;
  code: string;
}

export const TEMPLATES: Template[] = [
  {
    name: "Flowchart",
    category: "Basic",
    code: `flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process A]
  B -->|No| D[Process B]
  C --> E[End]
  D --> E`,
  },
  {
    name: "Sequence",
    category: "Basic",
    code: `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob
  Bob-->>Alice: Hi Alice
  Alice->>Bob: How are you?
  Bob-->>Alice: Great!`,
  },
  {
    name: "Class Diagram",
    category: "Basic",
    code: `classDiagram
  class Animal {
    +String name
    +int age
    +makeSound()
  }
  class Dog {
    +fetch()
  }
  class Cat {
    +purr()
  }
  Animal <|-- Dog
  Animal <|-- Cat`,
  },
  {
    name: "ER Diagram",
    category: "Data",
    code: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  CUSTOMER {
    string name
    string email
  }
  ORDER {
    int id
    date created
  }
  LINE-ITEM {
    string product
    int quantity
  }`,
  },
  {
    name: "State Diagram",
    category: "Basic",
    code: `stateDiagram-v2
  [*] --> Idle
  Idle --> Loading : fetch
  Loading --> Success : resolve
  Loading --> Error : reject
  Error --> Loading : retry
  Success --> [*]`,
  },
  {
    name: "Pie Chart",
    category: "Data",
    code: `pie title Browser Market Share
  "Chrome" : 65
  "Safari" : 19
  "Firefox" : 4
  "Edge" : 4
  "Other" : 8`,
  },
  {
    name: "Gantt Chart",
    category: "Project",
    code: `gantt
  title Sprint Plan
  dateFormat YYYY-MM-DD
  section Backend
    API Design      :a1, 2026-03-01, 3d
    Implementation  :a2, after a1, 5d
  section Frontend
    UI Mockups      :b1, 2026-03-01, 2d
    Components      :b2, after b1, 5d
  section QA
    Testing         :after a2, 3d`,
  },
  {
    name: "Git Graph",
    category: "Project",
    code: `gitGraph
  commit
  commit
  branch feature
  checkout feature
  commit
  commit
  checkout main
  merge feature
  commit`,
  },
  {
    name: "Mindmap",
    category: "Basic",
    code: `mindmap
  root((Project))
    Frontend
      React
      CSS
      TypeScript
    Backend
      API
      Database
      Auth
    DevOps
      CI/CD
      Monitoring`,
  },
];
