# STEM Tutor - Component Documentatie

Gedetailleerde documentatie van alle 7 basiscomponenten.

## 1. ExplanationBlock

**Functie:** Uitleg geven met afbeeldingen en praktische voorbeelden

**Wanneer gebruiken:**
- Concepten introduceren
- Context geven
- Real-world voorbeelden

**Props:**
```tsx
interface ExplanationBlockProps {
  title: string;              // Titel van de uitleg
  content: string;            // Hoofdtekst
  imageUrl?: string;          // URL naar afbeelding
  practicalExample?: string;  // Real-world voorbeeld
}
```

**Voorbeeld:**
```tsx
<ExplanationBlock
  title="Procenten in de winkel"
  content="Procenten geven aan welk deel van 100 iets is. Ze worden overal gebruikt."
  imageUrl="/procenten.jpg"
  practicalExample="Je ziet in een winkel: artikel €80 met 30% korting. Hoeveel betaal je eigenlijk?"
/>
```

---

## 2. InteractiveSlider

**Functie:** Waarden veranderen en resultaat live zien

**Wanneer gebruiken:**
- Simulaties
- Grafieken aanpassen
- Variabelen experimenteren
- Praktische formules

**Props:**
```tsx
interface InteractiveSliderProps {
  title: string;                              // Titel
  label: string;                              // Label van slider
  min: number;                                // Minimale waarde
  max: number;                                // Maximale waarde
  step?: number;                              // Stapgrootte (default: 1)
  initialValue?: number;                      // Beginwaarde
  unit?: string;                              // Eenheid (€, °C, %)
  onValueChange: (value: number) => void;    // Callback
  formula?: (value: number) => string;        // Berekening tonen
  visualization?: (value: number) => ReactNode; // Custom visualisatie
}
```

**Voorbeeld:**
```tsx
<InteractiveSlider
  title="Korting berekenen"
  label="Kortingspercentage"
  min={0}
  max={100}
  step={5}
  unit="%"
  onValueChange={(v) => console.log(v)}
  formula={(v) => `€80 - (€80 × ${v}%) = €${(80 - (80 * v / 100)).toFixed(2)}`}
/>
```

---

## 3. Quiz

**Functie:** Interactieve vragen met feedback

**Wanneer gebruiken:**
- Kennis testen
- Oefenvragen
- Socratische methode (hints)
- Voortgang meten

**Interfaces:**
```tsx
interface QuizQuestion {
  id: string;                 // Unieke ID
  question: string;           // De vraag
  options: string[];          // Antwoordopties
  correctAnswer: number;      // Index van correct antwoord (0-3)
  explanation: string;        // Waarom is dit correct?
  hint?: string;              // Optional hint voor Socratische methode
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}
```

**Voorbeeld:**
```tsx
<Quiz
  title="Rekenen met procenten"
  questions={[
    {
      id: '1',
      question: 'Wat is 25% van €200?',
      options: ['€25', '€50', '€75', '€100'],
      correctAnswer: 1,
      explanation: '25% van €200 = 0.25 × 200 = €50',
      hint: 'Deel €200 door 4'
    },
    {
      id: '2',
      question: 'Hoeveel is 10% van €500?',
      options: ['€10', '€50', '€100', '€150'],
      correctAnswer: 1,
      explanation: '10% van €500 = 0.10 × 500 = €50',
      hint: 'Verplaats de komma één plaats naar links'
    }
  ]}
  onComplete={(score) => console.log(`Score: ${score}`)}
/>
```

---

## 4. Calculator

**Functie:** Berekeningen live uitvoeren

**Wanneer gebruiken:**
- Formules visualiseren
- Meerdere getallen combineren
- Real-world berekeningen
- Simulaties

**Interfaces:**
```tsx
interface CalculatorField {
  id: string;           // Unieke ID
  label: string;        // Label
  placeholder?: string; // Placeholder tekst
  unit?: string;        // Eenheid (kg, km, etc.)
  type?: 'number' | 'text'; // Input type
}

interface CalculatorProps {
  title: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, string | number>) => {
    result: number;
    explanation: string;
  };
  unit?: string;        // Eenheid van resultaat
}
```

**Voorbeeld:**
```tsx
<Calculator
  title="Afgiftekostenberekening"
  fields={[
    { id: 'weight', label: 'Gewicht', unit: 'kg', type: 'number' },
    { id: 'distance', label: 'Afstand', unit: 'km', type: 'number' }
  ]}
  calculate={(values) => {
    const cost = (Number(values.weight) * Number(values.distance) * 0.5);
    return {
      result: cost,
      explanation: `${values.weight}kg × ${values.distance}km × €0.50 = €${cost.toFixed(2)}`
    };
  }}
  unit="€"
/>
```

---

## 5. StepByStep

**Functie:** Procedures stap-voor-stap uitleggen

**Wanneer gebruiken:**
- Complexe processen
- How-to's
- Procedures leren
- Algoritmes

**Interfaces:**
```tsx
interface Step {
  title: string;       // Staptitel
  description: string; // Gedetailleerde uitleg
  example?: string;    // Praktisch voorbeeld
  tip?: string;        // Tips/waarschuwingen
}

interface StepByStepProps {
  title: string;
  steps: Step[];
}
```

**Voorbeeld:**
```tsx
<StepByStep
  title="Hoe schrijf je een goede samenvatting?"
  steps={[
    {
      title: 'Stap 1: Lees goed',
      description: 'Lees de hele tekst zorgvuldig door. Probeer het thema te begrijpen.',
      tip: 'Onderstreep of markeer belangrijke passages',
      example: 'Bij een artikel: wie, wat, waar, wanneer, waarom'
    },
    {
      title: 'Stap 2: Noteer kernpunten',
      description: 'Schrijf op wat de 3-5 hoofdpunten zijn.',
      tip: 'Gebruik eigen woorden, kopieer niet',
      example: 'Niet: "De revolutie was groot". Wel: "Grote politieke verandering"'
    },
    {
      title: 'Stap 3: Schrijf samenvatting',
      description: 'Zet kernpunten in eigen woorden samen.',
      tip: 'Controleer op grammatica en spelling'
    }
  ]}
/>
```

---

## 6. Diagram

**Functie:** Visualisaties tonen (SVG)

**Wanneer gebruiken:**
- Anatomie
- Schematische voorstellingen
- Structuren
- Proces-diagrammen

**Interfaces:**
```tsx
interface Label {
  id: string;         // Unieke ID
  label: string;      // Label naam
  description: string; // Uitleg
}

interface DiagramProps {
  title: string;
  svgContent: string; // Raw SVG HTML
  description?: string; // Beschrijving
  labels?: Label[];
}
```

**Voorbeeld:**
```tsx
<Diagram
  title="Wateratoom (H₂O)"
  svgContent={`
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="20" fill="#ff6b6b"/>
      <circle cx="70" cy="80" r="12" fill="#4ecdc4"/>
      <circle cx="130" cy="80" r="12" fill="#4ecdc4"/>
      <line x1="85" y1="90" x2="100" y2="100" stroke="#333" stroke-width="2"/>
      <line x1="115" y1="90" x2="100" y2="100" stroke="#333" stroke-width="2"/>
    </svg>
  `}
  labels={[
    { id: 'o', label: 'Zuurstof (O)', description: 'Centrale atoom, rood' },
    { id: 'h', label: 'Waterstof (H)', description: 'Twee waterstofatomen, blauw' }
  ]}
/>
```

---

## 7. ProgressTracker

**Functie:** Voortgang en behaalde doelen tonen

**Wanneer gebruiken:**
- Motivatie verhogen
- Voortgang visualiseren
- Behaalde doelen tonen
- Level-up systeem

**Interfaces:**
```tsx
interface Achievement {
  id: string;          // Unieke ID
  title: string;       // Naam achievement
  description: string; // Beschrijving
  completed: boolean;  // Is voltooid?
  percentage: number;  // Progress 0-100
}

interface ProgressTrackerProps {
  studentName: string;
  level: number;        // Huigelevel
  progress: number;     // % voltooid (0-100)
  totalPoints: number;  // Totale punten
  achievements: Achievement[];
}
```

**Voorbeeld:**
```tsx
<ProgressTracker
  studentName="Janssen"
  level={3}
  progress={65}
  totalPoints={250}
  achievements={[
    {
      id: 'proc',
      title: 'Procenten Meester',
      description: 'Alle procenten-oefeningen voltooid',
      completed: true,
      percentage: 100
    },
    {
      id: 'algebra',
      title: 'Algebra Expert',
      description: 'Werk aan algebra-vaardigheden',
      completed: false,
      percentage: 60
    }
  ]}
/>
```

---

## Tips voor optimaal gebruik

✅ **Combineer componenten** - Maak een complete les van meerdere componenten
✅ **Lovable genereert data** - Jij vult het in de componenten
✅ **Praktische voorbeelden** - Echte scenario's zijn veel effectiever
✅ **Progressie** - Bouw op van makkelijk naar moeilijk
✅ **Feedback** - Geef directe, constructieve feedback
✅ **Socratische methode** - Gebruik hints in Quiz component
