# Vue to React Migration Guide

**Project:** funsite - Portfolio/Gallery SPA  
**Started:** December 25, 2025  
**Strategy:** Side-by-side migration with incremental component porting

---

## Migration Strategy

### Structure
```
funsite/
├── vue-app/              # Original Vue 2 app (preserved)
├── src/                  # New React 18 + Vite app
├── package.json          # React dependencies
├── vite.config.js
└── index.html
```

### Tech Stack Migration
| Vue Stack | React Stack |
|-----------|-------------|
| Vue 2.6 | React 18 + TypeScript |
| Vue CLI | Vite |
| Vue Router 3 | React Router 6 |
| Vuetify 2 | Material-UI (MUI) v5 |
| D3.js 5 | D3.js v7 (same - framework agnostic) |
| X3DOM | X3DOM (same - works with React) |

---

## Migration Steps

### Phase 1: Setup ✓
- [x] **Step 1.1:** Create MIGRATION.md (this file)
- [x] **Step 1.2:** Move Vue app to `vue-app/` subdirectory
- [x] **Step 1.3:** Initialize React + Vite at root
- [x] **Step 1.4:** Set up React Router and base layout
- [x] **Step 1.5:** Test both apps run simultaneously

### Phase 2: Core Structure ✓
- [x] **Step 2.1:** Create Gallery (Home) page structure
- [x] **Step 2.2:** Create About page structure
- [x] **Step 2.3:** Implement navigation matching Vue app
- [x] **Step 2.4:** Choose and configure UI library (MUI v7)

### Phase 3: Component Migration
Components are listed by complexity (easy → complex)

#### Simple Components (Pure logic/D3)
- [x] **RandomSinWaveFun.vue** → RandomSinWaveFun.tsx ✓
- [x] **MafsOne.vue** → MafsOne.tsx ✓
- [x] **MafsTwo.vue** → MafsTwo.tsx ✓
- [x] **CarbonForteen.vue** → CarbonForteen.tsx ✓
- [x] **CovidWastewaterPlot.vue** → CovidWastewaterPlot.tsx ✓

#### Medium Components (UI + D3)
- [ ] **TomatoSanky.vue** → TomatoSanky.jsx
- [x] **MapArtBos.vue** → MapArtBos.tsx ✓
- [x] **MapArtNj.vue** → MapArtNj.tsx ✓
- [x] **MapArtRadiohead.vue** → MapArtRadiohead.tsx ✓
- [ ] **GroundwaterBeef.vue** → GroundwaterBeef.jsx
- [ ] **GwDepletionVid.vue** → GwDepletionVid.jsx
- [ ] **GwVolCompareVid.vue** → GwVolCompareVid.jsx
- [x] **Metronome.vue** → Metronome.tsx ✓
- [ ] **TimelineResume.vue** → TimelineResume.jsx

#### Complex Components (3D/Advanced)
- [x] **TriangleLayer.vue** → TriangleLayer.tsx ✓
- [x] **DyeLif.vue** → DyeLif.tsx ✓ (X3DOM integration)
  - [x] DyeLifInput.vue → DyeLifInput.tsx ✓
  - [x] DyeLifLego.vue → DyeLifLego.tsx ✓
  - [x] DyeLifLinear.vue → DyeLifLinear.tsx ✓
  - [x] DyeLifSmooth.vue → DyeLifSmooth.tsx ✓
  - [x] triangleLayer.vue → triangleLayer.tsx ✓

### Phase 4: Utilities & Data
- [ ] **lib/utils/d3Helpers.js** → Port to React utils
- [ ] **lib/utils/hydroCalculations.js** → Port to React utils
- [ ] **lib/Text.js** → Port to React lib
- [ ] **lib/theme.js** → Adapt to React styling system
- [ ] **lib/data/*.json** → Copy to React public/data

### Phase 5: Finalization
- [ ] Test all migrated components
- [ ] Update deployment configuration
- [ ] Archive or remove vue-app/
- [ ] Update README.md with new stack info

---

## Migration Notes & Gotchas

### D3.js Migration Tips
- D3 code is framework-agnostic - mostly copy/paste
- Use `useRef()` for DOM element selection
- Use `useEffect()` for D3 initialization/updates
- Pattern: `d3.select(ref.current)` instead of `d3.select('#id')`

### Vuetify → React UI
**Common Mappings:**
- `<v-container>` → `<Container>` or `<div className="container">`
- `<v-row>` → `<Grid container>` or flexbox
- `<v-col>` → `<Grid item>` or flexbox
- `<v-card>` → `<Card>` component
- `<v-btn>` → `<Button>` component

### X3DOM in React
- Load X3DOM script in index.html
- Use `useEffect` to initialize X3DOM after component mount
- Call `x3dom.reload()` when scene updates

### Router Migration
**Vue Router:**
```javascript
<router-link to="/path">Link</router-link>
<router-view />
```

**React Router:**
```javascript
<Link to="/path">Link</Link>
<Outlet /> or <Routes>
```

---

## Testing Checklist Per Component

For each migrated component, verify:
- [ ] Visual appearance matches original
- [ ] All interactions work (clicks, hovers, inputs)
- [ ] D3 animations/transitions work
- [ ] Data loads correctly
- [ ] Responsive behavior works
- [ ] No console errors

---

## Running Both Apps

**Vue app (for reference):**
```bash
cd vue-app
npm install
npm run serve
# Runs on http://localhost:8080
```

**React app (in development):**
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Current Status

**Phase:** 3 - Component Migration  
**Current Step:** Migrating individual components  
**Components Migrated:** 15 / 18 (Template.vue excluded)  
**Last Updated:** December 25, 2025

### What's Working:
- ✅ React + TypeScript + Vite app running
- ✅ MUI v7 integrated with Grid layout
- ✅ React Router v7 with navigation
- ✅ Gallery page with card grid (matching Vue design)
- ✅ D3.js v7 animations working (RandomSinWaveFun)
- ✅ Image components working (MapArtBos)
- ✅ Routing between gallery and component pages

### Next Steps:
- Migrate more gallery components (MapArtNj, MapArtRadiohead next)
- Populate About page with content
- Copy remaining assets (thumbnails, images)

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------||
| 2025-12-25 | Use side-by-side migration approach | Allows testing both versions, cleaner separation |
| 2025-12-25 | React 18 + Vite + TypeScript | Modern, fast, type-safe, industry standard |
| 2025-12-25 | Material-UI (MUI) v7 | Closest to Vuetify, comprehensive component library |

---

## Resources

- [React Migration Guide](https://react.dev/learn)
- [Vite Guide](https://vitejs.dev/guide/)
- [D3 + React Best Practices](https://2019.wattenberger.com/blog/react-and-d3)
- [React Router v6 Docs](https://reactrouter.com/)


# Follow up TODOs I'm noticing:
- [ ] standardize padding in the gallery
- [ ] decide if text-on-top or not
- [ ] remove css and use sx props
- [ ] transitions on the MAFS things still aint working
- [x] pidgeon logo
- [ ] triangle layer color not showing :(
