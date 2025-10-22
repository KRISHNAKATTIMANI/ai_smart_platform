# 🎨 AI Platform - Visual Component Guide

## 🏠 Home Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  AI Platform Logo                        [Dashboard] →  │ ← Navbar
├─────────────────────────────────────────────────────────┤
│                                                         │
│            Welcome to AI Platform                       │
│     Powerful AI tools for text, image, voice...        │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   📄 Icon   │  │   🖼️ Icon   │  │   📷 Icon   │   │
│  │             │  │             │  │             │   │
│  │ Text→Text  │  │ Text→Image  │  │ Image→Text │   │
│  │             │  │             │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                     │
│  │   🎤 Icon   │  │   🔊 Icon   │                     │
│  │             │  │             │                     │
│  │ Voice→Text │  │ Text→Audio  │                     │
│  │             │  │             │                     │
│  └─────────────┘  └─────────────┘                     │
│                                                         │
│             Powered by Gemini AI                       │
└─────────────────────────────────────────────────────────┘
```

### Hover Effects
- **Scale**: Card grows slightly (1.05x)
- **Shadow**: Drop shadow increases
- **Border**: Changes to primary color (#4F46E5)
- **Transform**: Moves up 8px (-translate-y-2)

---

## 📷 Image → Text Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Home              Image → Text               │ ← Header
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│  Upload Image                │  Recent Searches         │
│  ┌────────────────────────┐  │  ┌──────────────────┐  │
│  │                        │  │  │ image1.jpg       │  │
│  │   📸 Click to upload   │  │  │ Oct 22, 2025     │  │
│  │   or drag & drop       │  │  └──────────────────┘  │
│  │                        │  │  ┌──────────────────┐  │
│  └────────────────────────┘  │  │ photo.png        │  │
│                              │  │ Oct 21, 2025     │  │
│  Preview:                    │  └──────────────────┘  │
│  ┌────────────────────────┐  │  ┌──────────────────┐  │
│  │   [Image Preview]      │  │  │ scan.jpg         │  │
│  └────────────────────────┘  │  │ Oct 20, 2025     │  │
│                              │  └──────────────────┘  │
│  Custom Prompt (Optional):   │                          │
│  ┌────────────────────────┐  │  Last 5 searches         │
│  │ Enter custom prompt... │  │  displayed here          │
│  └────────────────────────┘  │                          │
│                              │                          │
│  [ ✨ Process Image ]        │                          │
│                              │                          │
│  Results:                    │                          │
│  ┌────────────────────────┐  │                          │
│  │ Extracted Content:     │  │                          │
│  │ [Text from image]      │  │                          │
│  └────────────────────────┘  │                          │
│  ┌────────────────────────┐  │                          │
│  │ AI Analysis:           │  │                          │
│  │ [AI response]          │  │                          │
│  └────────────────────────┘  │                          │
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
       Main Content (75%)            Sidebar (25%)
```

---

## 📊 Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Home                Dashboard                │ ← Header
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Statistics Cards:                                      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  │ T→T │ │ T→I │ │ I→T │ │ V→T │ │ T→A │             │
│  │ 45  │ │ 23  │ │ 67  │ │ 12  │ │ 34  │             │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘             │
│                                                         │
│  Usage Chart:                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  Feature Usage Statistics                        │ │
│  │                                                   │ │
│  │  ▇▇▇▇▇▇                                         │ │
│  │  ▇▇▇                                             │ │
│  │  ▇▇▇▇▇▇▇▇▇                                      │ │
│  │  ▇▇                                              │ │
│  │  ▇▇▇▇▇                                           │ │
│  │  T→T  T→I  I→T  V→T  T→A                        │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Recent Activity (Last 10 Searches):                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Feature  │ Details        │ Date        │ Action │ │
│  ├──────────┼────────────────┼─────────────┼────────┤ │
│  │ I→T      │ image1.jpg     │ Oct 22 10am │ [View] │ │
│  │ T→T      │ "Analyze..."   │ Oct 22 9am  │ [View] │ │
│  │ I→T      │ photo.png      │ Oct 21 5pm  │ [View] │ │
│  │ ...                                              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
```
Primary (Indigo):  #4F46E5  ███████
Background:        #F9FAFB  ███████ (Light Gray)
White:             #FFFFFF  ███████
```

### Text Colors
```
Heading:           #111827  ███████ (Gray-900)
Body:              #4B5563  ███████ (Gray-600)
Muted:             #9CA3AF  ███████ (Gray-400)
```

### Feature Icon Colors
```
Text → Text:       #3B82F6  ███████ (Blue-500)
Text → Image:      #A855F7  ███████ (Purple-500)
Image → Text:      #22C55E  ███████ (Green-500)
Voice → Text:      #EF4444  ███████ (Red-500)
Text → Audio:      #EAB308  ███████ (Yellow-500)
```

### UI Elements
```
Borders:           #E5E7EB  ███████ (Gray-200)
Hover Background:  #F3F4F6  ███████ (Gray-100)
Shadow:            rgba(0,0,0,0.1)
```

---

## 🎯 Icon Mapping

### Heroicons Used
```javascript
import { ... } from '@heroicons/react/24/outline';

DocumentTextIcon    →  Text → Text
PhotoIcon          →  Text → Image
CameraIcon         →  Image → Text
MicrophoneIcon     →  Voice → Text
SpeakerWaveIcon    →  Text → Audio
ChartBarIcon       →  Dashboard
ArrowLeftIcon      →  Back button
SparklesIcon       →  Process/Analyze button
```

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints
```
Mobile:     < 640px    (Default, no prefix)
Tablet:     640px+     (sm:)
Desktop:    1024px+    (lg:)
Wide:       1280px+    (xl:)
```

### Layout Adjustments
```
Home Page Cards:
  Mobile:    1 column   (grid-cols-1)
  Tablet:    2 columns  (md:grid-cols-2)
  Desktop:   3 columns  (lg:grid-cols-3)

Image → Text:
  Mobile:    1 column (stacked)
  Desktop:   4 columns (3 main + 1 sidebar)
```

---

## 🔄 State Flow Diagram

### Image → Text Flow
```
User Uploads Image
       ↓
File Preview Shown
       ↓
User Clicks "Process"
       ↓
POST /api/upload
       ↓
Receive extracted text
       ↓
POST /api/analyze
       ↓
Display AI analysis
       ↓
Save to localStorage
       ↓
Update Recent Searches
```

### Recent Searches Flow
```
User performs action
       ↓
Create search entry
       ↓
Get existing searches from localStorage
       ↓
Add new entry to top
       ↓
Keep only last 5
       ↓
Save to localStorage (recentImageToText)
       ↓
Update UI
```

---

## 🧩 Component Hierarchy

```
App
├── RecentSearchesProvider (Context)
└── Router
    ├── HomePage
    │   └── Navbar
    ├── ImageToTextPage
    │   ├── Header with Back Button
    │   ├── Main Content
    │   │   ├── Upload Section
    │   │   ├── Preview
    │   │   ├── Prompt Input
    │   │   ├── Process Button
    │   │   └── Results Display
    │   └── Sidebar
    │       └── Recent Searches
    ├── TextToTextPage
    │   ├── Header
    │   ├── Input Area
    │   └── Sidebar
    ├── Dashboard
    │   ├── Header
    │   ├── Stats Cards
    │   ├── Bar Chart
    │   └── Activity Table
    ├── TextToImagePage (Placeholder)
    ├── VoiceToTextPage (Placeholder)
    └── TextToAudioPage (Placeholder)
```

---

## 🎬 Animation Classes

### Hover Effects
```css
/* Card Hover */
hover:shadow-xl          /* Larger shadow */
hover:-translate-y-2     /* Move up 8px */
hover:scale-105          /* Grow to 105% */
hover:border-primary     /* Border color change */

/* Button Hover */
hover:bg-indigo-700      /* Darker background */
hover:text-primary       /* Text color change */

/* Transitions */
transition-all           /* Animate all properties */
duration-300            /* 300ms animation */
```

### Loading States
```jsx
// Spinning loader
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />

// Button disabled state
disabled:bg-gray-300
disabled:cursor-not-allowed
```

---

## 📐 Spacing System

### Padding & Margins
```
4px  → p-1, m-1
8px  → p-2, m-2
12px → p-3, m-3
16px → p-4, m-4  ← Most common
24px → p-6, m-6
32px → p-8, m-8
```

### Container Widths
```
max-w-7xl  → 1280px (Main container)
max-w-6xl  → 1152px (Home grid)
max-w-4xl  → 896px  (Feature pages)
```

---

## 🔍 Typography Scale

```
text-xs    → 12px  (Timestamps, small labels)
text-sm    → 14px  (Body text, table)
text-base  → 16px  (Default)
text-lg    → 18px  (Section headings)
text-xl    → 20px  (Page titles)
text-2xl   → 24px  (Main headings)
text-3xl   → 30px  (Hero text)
text-4xl   → 36px  (Large hero)
```

### Font Weights
```
font-normal   → 400
font-medium   → 500  (Navigation, buttons)
font-semibold → 600  (Headings)
font-bold     → 700  (Main titles)
```

---

## 💡 UI Patterns

### Card Pattern
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all">
  {/* Card content */}
</div>
```

### Button Pattern
```jsx
<button className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
  Click Me
</button>
```

### Input Pattern
```jsx
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
```

### Badge Pattern
```jsx
<span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-white">
  Label
</span>
```

---

This visual guide helps you understand the layout and design system of the AI Platform! 🎨
