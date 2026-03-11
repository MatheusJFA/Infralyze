# Histórico de Commits Atômicos - Infralyze

Este documento contém os blocos de commit organizados e focados nas últimas grandes atualizações que fizemos (Internacionalização, UI Tooltips, Cache, APIs Reais e Refatoração do Dashboard). 

Execute cada bloco abaixo no seu terminal, na raiz do projeto (`/var/home/aguiar/workspace/Infralyze`), sequencialmente para registrar um histórico do Git perfeito.

---

### 1. APIs de Cloud (Fetch, Rotas e Lógica de Nuvem)
Integração com preços ao vivo para GCP e Oracle, mantendo arquitetura mock base para fallback.
```bash
git add src/app/api/aws/route.ts src/app/api/azure/route.ts src/app/api/gcp/route.ts src/app/api/oracle/route.ts
git commit -m "feat(api): expande endpoints de pricing com GCP e Oracle live-fetch"
```

### 2. Motor de Tradução e Suporte a PT/EN
Criação do Context de i18n Nativo e arquivos separados por idioma (`en.ts`, `pt.ts`).
```bash
git add src/lib/i18n/ src/app/layout.tsx src/components/LanguageSwitcher.tsx
git commit -m "feat(i18n): adiciona motor de internacionalizacao client-side estrutural em PT/EN"
```

### 3. Melhorias no Formulário e Tipagem (Sliders, Presets e Tooltips)
Injeção de Tooltips com lucide-react (HelpCircle) e presets de Megabytes rápidos.
```bash
git add src/components/forms/MetricsForm.tsx src/components/InfoTooltip.tsx src/lib/i18n/locales/en.ts src/lib/i18n/locales/pt.ts
git commit -m "feat(ui): adiciona controles unificados, presets rapidos e tooltips explicativos nos inputs"
```

### 4. Dashboards Vivos, Caching e Botão de Calcular
Controle de exibição dos gráficos via opacidade, estado de loading e caching de 24h em localStorage.
```bash
git add src/app/dashboard/page.tsx src/components/charts/CostEstimation.tsx
git commit -m "feat(dashboard): integra calculo sob-demanda, animacoes e tabelas de cloud com cache local"
```
