# Architectuur - STEM Tutor

## Overzicht

```
┌─────────────────────┐
│  Lovable AI Tool    │
│  (Generaert data)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Je React Website   │
│  (Toont componenten)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  STEM Tutor Component Library       │
│  (Deze 7 componenten)               │
│                                     │
│  1. ExplanationBlock                │
│  2. InteractiveSlider               │
│  3. Quiz                            │
│  4. Calculator                      │
│  5. StepByStep                      │
│  6. Diagram                         │
│  7. ProgressTracker                 │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│   Student leert     │
│  via praktische     │
│   oefeningen        │
└─────────────────────┘
```

## Workflow

### 1. Lovable genereert lesmateriaal

**Input (jij geeft in):**
```
Vak: Wiskunde
Niveau: 4 VMBO
Underwerp: Procenten
Type: Interactieve les
```

**Output (Lovable genereert):**
```json
{
  "title": "Procenten in de winkel",
  "explanation": "Procenten geven aan welk deel van 100 iets is...",
  "practicalExample": "Je ziet: artikel €80 met 30% korting...",
  "slider": {
    "min": 0,
    "max": 100,
    "formula": "€80 - (€80 × {value}%) = €{result}"
  },
  "quiz": [
    {
      "question": "Wat is 25% van €200?",
      "options": ["€25", "€50", "€75", "€100"],
      "correctAnswer": 1,
      "explanation": "25% van €200 = 0.25 × 200 = €50"
    }
  ]
}
```

### 2. Jij vult dit in je React component

```tsx
import { ExplanationBlock, InteractiveSlider, Quiz } from 'stem-tutor/components';

function PercentenLes() {
  const data = /* Lovable generated JSON */;

  return (
    <>
      <ExplanationBlock
        title={data.title}
        content={data.explanation}
        practicalExample={data.practicalExample}
      />
      
      <InteractiveSlider
        title="Korting berekenen"
        label="Kortingspercentage"
        min={data.slider.min}
        max={data.slider.max}
        formula={(v) => `€80 - (€80 × ${v}%) = €${(80 - 80*v/100).toFixed(2)}`}
      />
      
      <Quiz
        title="Oefeningen"
        questions={data.quiz}
      />
    </>
  );
}
```

### 3. Student ziet prachtige interactieve les

---

## Waarom deze architectuur?

✅ **Scheidung van verantwoordelijkheden:**
- Lovable = AI/inhoud genereren
- Components = UI/interactiviteit
- Website = alles combineren

✅ **Hergebruik:**
- Dezelfde 7 componenten voor alle vakken
- Dezelfde componenten voor alle niveaus
- Oneindig veel variatie

✅ **Efficiëntie:**
- Snel nieuwe lessen toevoegen
- Makkelijk onderhouden
- Schaalbaar

✅ **Praktisch:**
- Real-world voorbeelden
- Interactief leren
- Directe feedback

---

## Technische stack

```
Frontend:
├── React 18+
├── TypeScript
├── Tailwind CSS
└── Responsive design

Integration:
├── Lovable AI (genereert data)
├── OpenAI API (optional, voor Socratische tutor)
└── Je Website (host alles)
```

---

## Next Steps

1. ✅ **Componenten klaar** (je hebt ze nu!)
2. 🔲 **Lovable tool bouwen** (genereert data)
3. 🔲 **Website integratie** (combineert alles)
4. 🔲 **Testing** (met echte vakken)
5. 🔲 **Deployment** (live zetten)
