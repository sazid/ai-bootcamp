# Design system

Use these tokens in CSS variables. Do not add new values without asking.

## Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#F7F7F4` | `#17181A` | Page |
| `--surface` | `#FFFFFF` | `#222427` | Cards, columns |
| `--text` | `#1C1D1F` | `#F2F2EF` | Main text |
| `--muted` | `#5C6066` | `#A9ADB3` | Second text |
| `--border` | `#DCDDD8` | `#3A3D42` | Lines |
| `--accent` | `#1F5FBF` | `#7FB0F5` | Links, focus, main button |

Never use color alone to show meaning. Add an icon or a label.

## Type

- Font: Inter, then system-ui
- Sizes: 12, 14, 16, 20, 28 px
- Weights: 400, 600

## Space and shape

- Spacing steps: 4, 8, 12, 16, 24, 32 px
- Corner radius: 6 px for controls, 10 px for cards
- Touch targets: at least 44 by 44 px

## States

Each interactive element needs default, hover, focus, active and disabled styles.
Focus must be clearly visible: 2 px outline in `--accent`.

## Motion

Keep motion under 200 ms. Respect `prefers-reduced-motion`.
