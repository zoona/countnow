# Design Guidelines: CountNow (즉카) - Real-Time Counting Web App

## Design Approach

**Selected Framework:** Custom Playful Utility Design
- Reference inspiration: Casual gaming interfaces (Kahoot, Jackbox) meets productivity apps (Splitwise)
- Rationale: Fun, social gaming experience requiring instant clarity and tactile satisfaction
- Core principle: **Joyful utility** - make counting feel like playing while maintaining precision and clarity

## Color Palette

**Player Colors (Bright Pastels - High Saturation for Differentiation)**
- Player 1: 350 85% 75% (Coral Pink)
- Player 2: 195 85% 75% (Sky Blue)  
- Player 3: 165 75% 70% (Mint Green)
- Player 4: 280 70% 75% (Soft Purple)
- Player 5: 35 85% 70% (Peach Orange)
- Player 6: 260 65% 75% (Lavender)

**Background & UI (Neutral Foundation)**
- Dark Mode Primary: 240 15% 12% (Deep charcoal)
- Dark Mode Surface: 240 12% 18% (Elevated cards)
- Light Mode Primary: 210 20% 98% (Soft white)
- Light Mode Surface: 0 0% 100% (Pure white cards)

**Accent & Status**
- Success/Winner: 145 65% 55% (Vibrant green)
- Warning/Timer: 35 95% 60% (Orange alert)
- Error/Penalty: 0 75% 60% (Red warning)
- Neutral Text Dark: 240 8% 95% 
- Neutral Text Light: 240 12% 25%

## Typography

**Font Stack:** 'Pretendard Variable', 'Inter', system-ui, sans-serif
- Display/Counts: 800 weight, 48-72px (mobile), 64-96px (tablet+)
- Headings: 700 weight, 24-32px  
- Body/Labels: 500 weight, 16-18px
- Small/Meta: 400 weight, 14px

**Hierarchy Rules:**
- Player counts: Massive, bold numbers dominating button space
- Names: Medium size, always paired with color chip/emoji
- Timer: Large, prominent in sticky header
- Logs: Small, subtle, non-intrusive

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Consistent padding: p-4 for cards, p-6 for sections, p-8 for screens
- Button spacing: gap-4 in grids, gap-6 between major sections
- Touch targets: Minimum 14 units (56px) height/width for all interactive elements

**Grid Strategy:**
- 2 players: Single column (full width buttons)
- 3-4 players: 2-column grid (grid-cols-2)
- 5-6 players: 2-column grid with scroll
- 7+ players: 3-column grid (grid-cols-3) compact mode

## Component Library

**Primary Buttons (Counting Buttons)**
- Size: min-h-28 (112px) on mobile, expandable based on grid
- Shape: rounded-3xl (24px border radius)
- Content: Centered name + emoji + large count number
- States: Active (scale-95 transform), Long-press (pulsing ring animation)
- Shadow: shadow-lg with colored glow matching player color

**Secondary Actions**
- Size: h-12 standard, h-14 for primary CTAs
- Shape: rounded-xl (12px radius)
- Variants: Solid (colored bg), Outline (border + transparent), Ghost (text only)

**Cards/Surfaces**
- Elevation: shadow-md for elevated content
- Padding: p-6 standard, p-8 for important content
- Borders: rounded-2xl (16px) for main cards
- Dividers: Subtle 1px with 10% opacity of text color

**Input Fields**
- Height: h-14 for text inputs
- Style: Outline with focus ring (ring-2 ring-offset-2)
- Color chips: h-10 w-10 rounded-full with checkmark for selected

**Timer Display**
- Position: Sticky top header with backdrop-blur-md
- Style: Monospaced numbers, bold weight
- Warning state: Pulsing animation + color shift when <30s

**Result Cards**
- Ranking: Large medal emoji/icon + position number
- Score bars: Horizontal bars with player color, proportional width
- Stats grid: 3-column layout for total/avg/max metrics

## Interaction Patterns

**Tap Behaviors:**
- Single tap: +1 with haptic pulse and scale animation
- Long press (500ms): Continuous +1 every 200ms with persistent haptic
- Swipe left: Undo last action (-1) with slide-out animation

**Real-time Updates:**
- New counts: Fade-in with gentle bounce
- Ranking changes: Smooth reordering with stagger animation
- Concurrent edits: Ripple effect from source button

**Modals/Overlays:**
- Entry: Slide-up from bottom (mobile), center fade (desktop)
- Backdrop: backdrop-blur-sm with 40% opacity dark overlay
- Dismissal: Tap outside or swipe down

## Screen-Specific Guidelines

**Home Screen:**
- Hero: Large app name with playful icon/emoji
- Primary CTA: Full-width gradient button "Start New Game"
- Recent rooms: Card list with room name, participant count, timestamp

**Participant Registration:**
- Add form: Sticky bottom sheet with name input + color picker
- Player list: Sortable cards with drag handles, swipe to delete
- Color picker: Grid of 8 color chips (6 player + 2 extras)

**Counting Interface:**
- Header: Timer (left), Pause button (center), Reset (right) 
- Grid: Responsive player buttons filling viewport
- Footer: Mini event log with last 3 actions, subtle and collapsible

**Results Screen:**
- Winner spotlight: Large card with confetti animation (CSS particle effect)
- Rankings: Stacked cards with medal colors (gold/silver/bronze)
- Share CTA: Prominent button generating results image

**Penalty Generator:**
- Roulette: Spinning text animation cycling through penalties
- Result: Large text card with playful emoji
- Action: "Accept" or "Re-roll" buttons

## Images & Visual Elements

**No Hero Images** - This is an app interface, not a marketing page
**Icon System:** Use Heroicons for UI controls, emoji for player representation and game states
**Illustrations:** Minimal, use emoji or simple SVG icons for empty states and celebrations

## Accessibility Features

- Color pairs with emoji/icon for every player (colorblind support)
- High contrast mode: Increase all color luminosity differences by 20%
- Touch targets: Strict 56px minimum, prefer 64-72px for primary actions
- Focus indicators: 3px ring with player/accent color
- Reduced motion: Disable animations, keep functional feedback only

## Animation Budget

**Essential Only:**
- Count increment: Scale pulse (150ms)
- Timer warning: Gentle pulse when <30s
- Result reveal: Stagger fade-in (100ms delay per item)
- Winner celebration: Single confetti burst
- **Avoid:** Continuous loops, complex transitions, decorative motion

## Responsive Breakpoints

- Mobile (base): 320px-640px - Primary target
- Tablet (md): 641px-1024px - Landscape games
- Desktop (lg): 1024px+ - Multi-device viewing

**Mobile-first adjustments:**
- Base: Single column layouts, full-width buttons
- md: 2-column grids, side-by-side controls
- lg: Max-width container (1024px), centered with breathing room