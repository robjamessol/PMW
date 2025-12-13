# Design Language

Plan My Workout (PMW) uses a dark theme optimized for gym use (low-light environments).

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#6C63FF` | Buttons, links, active states |
| **Primary Dark** | `#5A52D5` | Pressed states, selected items |
| **Background** | `#1A1A2E` | Main app background |
| **Background Card** | `#25253A` | Card surfaces |
| **Background Light** | `#2D2D44` | Elevated surfaces, inputs |
| **Text** | `#FFFFFF` | Primary text |
| **Text Secondary** | `#B0B0C3` | Subtitles, labels |
| **Text Muted** | `#6B6B80` | Placeholders, disabled |
| **Success** | `#4CAF50` | Completed sets, positive feedback |
| **Warning** | `#FFB800` | BEAT THIS cards, PRs, alerts |
| **Error** | `#FF5252` | Validation errors, destructive actions |
| **Border** | `#3A3A50` | Card borders, dividers |

## Typography

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero | 48px | Bold | Logo, large numbers |
| XXL | 28px | Bold | Screen titles, stats |
| XL | 24px | Bold | Section headers |
| LG | 18px | 600 | Card titles |
| MD | 16px | 400/500 | Body text |
| SM | 14px | 400/500 | Secondary text |
| XS | 12px | 400 | Captions, labels |

## Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing, icon gaps |
| sm | 8px | Between related items |
| md | 16px | Standard padding |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| xxl | 48px | Screen sections |

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| sm | 4px | Small elements |
| md | 8px | Buttons, inputs |
| lg | 12px | Cards |
| xl | 16px | Large cards |
| full | 9999px | Pills, avatars |

## Components

### Button

Three variants:
- **Primary**: Filled purple background, white text
- **Secondary**: Dark background, purple border
- **Outline**: Transparent, purple border

Three sizes:
- **sm**: 36px height, 14px text
- **md**: 48px height, 16px text (default)
- **lg**: 56px height, 18px text

States: Default, Pressed (darker), Disabled (50% opacity), Loading (spinner)

### Card

Three variants:
- **Default**: Dark card background, no border
- **Elevated**: Shadow for depth
- **Outlined**: Border visible

Standard padding: 16px

### Input

Features:
- Optional label above
- Left icon (mail, lock, etc.)
- Right icon or password toggle
- Error state with red border
- Placeholder text (muted color)

### Muscle Selection Card

- 31% width (3 per row)
- Circular icon container (48px)
- Color changes when selected
- Checkmark badge on selection

### Set Card

- Full width
- Shows set number and target reps
- Weight and reps inputs inline
- Checkmark button or completed icon
- Green border when completed

### Rest Timer

- Overlay card at bottom
- Large countdown display (Hero size)
- Skip button below

## Icons

Using Ionicons throughout:
- `home` / `home-outline` - Home tab
- `time` / `time-outline` - History tab
- `settings` / `settings-outline` - Settings tab
- `barbell` - Exercise/workout
- `trophy` - BEAT THIS, PRs
- `checkmark` - Complete action
- `checkmark-circle` - Completed state
- `chevron-back/forward` - Navigation
- `mail` - Email input
- `lock-closed` - Password input
- `eye` / `eye-off` - Password visibility

## Screen Layouts

### Standard Screen
```
SafeAreaView (background color)
├── Header (optional)
├── ScrollView (flex: 1, padding: md)
│   └── Content
└── Bottom Bar (fixed, border-top)
```

### Modal Screen
```
SafeAreaView
├── Content (scrollable)
└── Sticky Bottom Button
```

### Tab Screen
```
Tab Navigator
├── HomeTab (Home icon)
├── HistoryTab (Time icon)
└── SettingsTab (Settings icon)
```

## Animation Guidelines

- Use `activeOpacity={0.7}` for touchables
- Rest timer counts down every second
- Vibration pattern on timer complete: `[0, 500, 200, 500]`
- Pull-to-refresh on lists

## Dark Theme Rationale

1. **Gym Environment**: Often dimly lit, dark theme reduces eye strain
2. **Battery Saving**: OLED screens benefit from dark pixels
3. **Focus**: Dark UI keeps focus on the workout data
4. **Modern Look**: Aligns with fitness app conventions
