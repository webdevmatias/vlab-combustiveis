# Painel de Combustíveis — Frota Nacional

> Desafio Técnico Frontend · V-LAB
> Mini-painel gerencial para visualização de dados de consumo e preço de combustíveis da frota nacional, seguindo o Padrão Digital de Governo (Gov.br / DSGOV).

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) **≥ 18**
- [Angular CLI](https://angular.io/cli) **≥ 16**

```bash
npm install -g @angular/cli
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/<seu-usuario>/painel-combustiveis.git
cd painel-combustiveis

# Instale as dependências
npm install
```

### Executar em desenvolvimento

```bash
ng serve
```

Acesse `http://localhost:4200`. A aplicação redireciona automaticamente para `/dashboard`.

> Não é necessário rodar nenhum servidor de mock separado. Os dados são gerados em memória pelo `FuelDataService`.

### Build de produção

```bash
ng build --configuration production
```

Os artefatos ficam em `dist/`.

---

## Decisões Arquiteturais

### 1. Padrão Facade

Cada feature possui um `*.facade.ts` que age como a única interface entre os componentes e a camada de dados:

- `DashboardFacade` — agrega KPIs (preço médio de gasolina/diesel, volume total) e agrupa consumo por UF usando `computed signals`.
- `ConsultaFacade` — gerencia filtros, paginação e busca por ID, tudo reativamente via `signal` + `computed`.

Os componentes **nunca injetam** o `FuelDataService` diretamente. Toda leitura de estado passa pelo Facade, garantindo um ponto único de verdade e facilitando testes unitários (basta mockar o Facade).

### 2. Signals e Computed em vez de RxJS nos componentes

A aplicação usa a API de Signals do Angular (estabilizada no Angular 17, retrocompatível com 16+) para estado reativo nos Facades. Os `computed()` derivam automaticamente dados filtrados, paginados e agregados sem necessidade de operadores RxJS nos templates. O `HttpClient` (simulado) ainda usa `Observable`, mas o resultado é imediatamente convertido para signal via `.subscribe()` no Facade.

### 3. Mock de dados em memória

`FuelDataService` gera **150 registros** aleatórios cobrindo **9 UFs** (SP, RJ, MG, PR, RS, BA, CE, GO, PE) e os **3 tipos de combustível** (Gasolina, Etanol, Diesel). O `of()` com `delay(600ms)` simula a latência de uma chamada HTTP real. `shareReplay(1)` garante que múltiplos subscribers não disparem a geração novamente.

### 4. Standalone Components (Angular 16+)

Todos os componentes são `standalone: true`, eliminando `NgModule`. O bootstrap usa `bootstrapApplication` + `appConfig`, alinhado com a arquitetura moderna do Angular.

### 5. Estilização com Tailwind CSS

Tailwind foi escolhido pela velocidade de prototipagem e pela facilidade de replicar fielmente as cores e espaçamentos do DSGOV:

- `--gov-blue: #1351B4` — cor primária em toda a interface
- `--gov-navy: #071D41` — títulos e header
- Tipografia: **Montserrat** (Google Fonts) como substituto visual do Rawline

### 6. Chart.js para visualizações

Chart.js via registro global (`Chart.register(...registerables)`) foi escolhido pela leveza e API direta com Canvas, sem dependências adicionais de wrappers Angular. O gráfico de barras exibe os **Top 8 estados** por volume abastecido.

### 7. Acessibilidade (WCAG / Gov.br)

- **Skip link** `"Ir para o conteúdo principal"` visível apenas no foco por teclado
- **Alto contraste** via toggle: aplica `filter: invert(1) hue-rotate(180deg)` na tag `<html>`, com exceção para imagens/SVGs (reinversão)
- `aria-label`, `aria-current`, `role="dialog"`, `aria-modal` aplicados nos componentes relevantes
- Tabela com `scope="col"` nos cabeçalhos
- Botões de paginação com `disabled` semântico

---

## O que ficou pronto

| Funcionalidade                                                              | Status |
| --------------------------------------------------------------------------- | ------ |
| Layout Gov.br (barra superior, header, pesquisa)                            | ✅     |
| Navegação com menu desktop e mobile                                         | ✅     |
| Breadcrumbs em todas as rotas                                               | ✅     |
| Dashboard `/dashboard` com 3 KPI cards                                      | ✅     |
| Gráfico de barras — Consumo por UF (Top 8)                                  | ✅     |
| Consulta `/consulta` com tabela completa                                    | ✅     |
| Filtro por UF e por Tipo de Combustível                                     | ✅     |
| Paginação (anterior / próximo)                                              | ✅     |
| Arquitetura Facade (`dashboard.facade.ts`, `consulta.facade.ts`)            | ✅     |
| Mock com 150 registros, 9 UFs, 3 combustíveis                               | ✅     |
| **[Bônus]** Tela de Detalhe e CPF mascarado `/consulta/:id` (`CpfMaskPipe`) | ✅     |
| **[Bônus]** Toggle de Alto Contraste funcional                              | ✅     |
| Modal de "Reportar Erro" na tela de detalhe                                 | ✅     |
| Skip link de acessibilidade por teclado                                     | ✅     |
| Lazy loading das rotas                                                      | ✅     |

---

## O que ficou de fora

| Funcionalidade                                       | Motivo                                                                                                                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Segundo gráfico — Evolução de Preço (linha temporal) | A lógica `priceEvolution` está implementada no `DashboardFacade`, mas o canvas correspondente não foi adicionado ao template do `DashboardComponent` dentro do prazo. É o próximo passo mais simples de concluir. |
| Rota 404 customizada                                 | Não implementada no prazo; seria uma rota `{ path: '**', component: NotFoundComponent }` no final do array de rotas.                                                                                              |
| Testes unitários                                     | Fora do escopo do desafio de 3h; a arquitetura Facade facilita a adição futura (os componentes dependem apenas de interfaces, sem acoplamento ao serviço de dados).                                               |

---

## Estrutura de pastas

```
src/
├── app/
│   ├── core/
│   │   ├── facades/
│   │   │   ├── dashboard.facade.ts
│   │   │   └── consulta.facade.ts
│   │   └── services/
│   │       └── fuel-data.service.ts
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── abastecimentos/
│   │   │   └── abastecimentos.component.ts
│   │   └── detalhes/
│   │       └── detalhe.component.ts
│   └── shared/
│       ├── components/
│       │   ├── gov-header.component.ts
│       │   ├── breadcrumb.component.ts
│       │   └── kpi-card.component.ts
│       ├── interfaces/
│       │   └── fuel.interfaces.ts
│       └── pipes/
│           └── cpf-mask.pipe.ts
├── index.html
├── main.ts
└── styles.css
```

---

## Tecnologias utilizadas

| Tecnologia                | Versão | Uso                 |
| ------------------------- | ------ | ------------------- |
| Angular                   | 16+    | Framework principal |
| TypeScript                | 5.x    | Linguagem           |
| Tailwind CSS              | 3.x    | Estilização         |
| Chart.js                  | 4.x    | Gráficos            |
| Font Awesome              | 6.5    | Ícones              |
| Montserrat (Google Fonts) | —      | Tipografia          |

---

## Uso de IA

O projeto contou com o apoio de ferramentas de inteligência artificial (como Claude, Gemini e ChatGPT), além de consultas a tutoriais e à documentação oficial das tecnologias utilizadas. Essas ferramentas foram empregadas como suporte à pesquisa e à resolução de dúvidas pontuais, ajustes, e dicas, sem substituição do processo de análise.
