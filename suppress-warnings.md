# Option 1: Add inline suppressions

## For dangerouslySetInnerHTML in app/layout.tsx:
```tsx
{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Static theme script, no user input */}
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){...})()`,
  }}
/>
```

## For ScrollRail span:
```tsx
{/* biome-ignore lint/a11y/useSemanticElements: Span needed for layout, fully accessible with role/tabIndex/onKeyDown */}
<span
  role="button"
  tabIndex={0}
  onClick={...}
  onKeyDown={...}
>
```

# Option 2: Disable these rules in biome.json:
```json
{
  "linter": {
    "rules": {
      "security": {
        "noDangerouslySetInnerHtml": "off"  // or keep as "warn"
      },
      "a11y": {
        "useSemanticElements": "off"  // or keep as "warn"
      }
    }
  }
}
```

Recommendation: Keep them as warnings. They're good reminders for future code!
