# Component Data Guide

## Overview

Component data files (`.data.md`) allow non-technical users to easily edit component default props without touching Svelte code. Each Property component has a corresponding `.data.md` file that contains default values in YAML format.

## What is a .data.md File?

A `.data.md` file is a markdown file with a YAML frontmatter section that contains default prop values for a component.

**Example: `PropertyAvailableSpaces.data.md`**

```yaml
---
subtitle: Available Now
title: All Available Spaces
showCapacity: true
spaces:
  - name: Ste 117
    floor: 1st Floor
    capacity: "-"
    size: "1,133"
    sizeUnit: SF
    rentalRate: "$4,600"
    rateUnit: /MO
    spaceUse: Office
    available: true
---
```

**Why YAML?**
- ✓ Human-readable format
- ✓ Perfect for nested data (arrays, objects)
- ✓ No JavaScript syntax errors
- ✓ Easy for non-technical users to edit

## How It Works

### Build-Time Injection

When you build your project, the Vite plugin:

1. **Scans** for `.svelte` components in `templates/real-estate/src/lib/components/`
2. **Finds** co-located `.data.md` files
3. **Parses** the YAML frontmatter
4. **Injects** defaults into the component code
5. **Result**: Component works without any runtime overhead

### Component Structure

**Before** (what you edit in `.data.md`):
```yaml
---
subtitle: Available Now
spaces:
  - name: Ste 117
    size: "1,133"
---
```

**After** (automatically injected at build time):
```svelte
<script>
  let {
    subtitle = "Available Now",
    spaces = [
      { name: "Ste 117", size: "1,133" }
    ]
  }: PropertyAvailableSpacesProps = $props();
</script>
```

## Editing Component Data

### File Location

Each Property component has a corresponding `.data.md` file:

```
templates/real-estate/src/lib/components/
├── PropertyAvailableSpaces.svelte
├── PropertyAvailableSpaces.data.md        ← Edit this
├── PropertyNearby.svelte
├── PropertyNearby.data.md                 ← Edit this
└── ... (12 components total)
```

### Basic Properties (Strings, Numbers, Booleans)

```yaml
---
subtitle: "My Subtitle"
title: "My Title"
showCapacity: true
height: "600px"
zoom: 15
---
```

**Rules:**
- Quote string values with spaces: `"My Title"`
- Unquoted values: `true`, `false`, `123`, `"string"`
- No quotes needed for simple values: `showCapacity: true`

### Arrays of Objects (Spaces, Stats, etc.)

```yaml
---
spaces:
  - name: Ste 117
    floor: 1st Floor
    size: "1,133"
    capacity: "4"

  - name: Ste 118
    floor: 1st Floor
    size: "205"
    capacity: "2"
---
```

**Rules:**
- Start with `-` for each array item
- Indent properties under each item (2 spaces)
- Leave blank line between items for readability

### Nested Objects (Address, CTAs, etc.)

```yaml
---
address:
  street: 123 Main St
  city: San Francisco
  state: CA
  zipCode: "94102"
  country: USA

primaryCta:
  text: Inquire Now
  url: "#contact"
---
```

**Rules:**
- Use proper indentation (2 spaces per level)
- No quotes for simple property names
- Quote values with special characters

### Complex Nested Structures (Amenities)

```yaml
---
amenities:
  - name: Restaurants
    icon: restaurant
    places:
      - name: "Jet's Pizza"
        category: Fast Food
        priceLevel: "$"
        distance: 3 min walk

      - name: Wild Tuna
        category: Sushi
        priceLevel: "$$$"
        distance: 3 min walk
---
```

**Rules:**
- Nest arrays within objects with proper indentation
- Each level adds 2 more spaces
- Keep indentation consistent

## Property Components Reference

### PropertyAvailableSpaces

Displays available office spaces in a table.

**Key properties to edit:**
- `subtitle` - Section label
- `title` - Section title
- `showCapacity` - Show/hide capacity column
- `spaces[]` - Array of available spaces

**Example:**
```yaml
---
subtitle: Available Now
title: All Available Spaces
showCapacity: true
spaces:
  - name: Suite Name
    floor: "1st Floor"
    size: "1,000"
    rentalRate: "$5,000"
---
```

### PropertyNearby

Shows transportation options and nearby amenities.

**Key properties to edit:**
- `subtitle` - Section label
- `title` - Section title
- `transportation[]` - Transit options array
- `amenities[]` - Nested amenities with places

**Example:**
```yaml
---
transportation:
  - name: Route 59 Station
    type: rail
    distance: 13 min
    duration: 6.0 mi

amenities:
  - name: Restaurants
    places:
      - name: Pizza Place
        category: Fast Food
        distance: 3 min
---
```

### PropertyContactSection

Agent information and open house events.

**Key properties to edit:**
- `agentName` - Agent's full name
- `agentTitle` - Agent's job title
- `agentPhone` / `agentEmail` - Contact info
- `specialties[]` - Array of specialties
- `events[]` - Open house dates
- `address` - Address object

### PropertyHero

Hero banner with title and call-to-action buttons.

**Key properties to edit:**
- `badge` - Top label
- `title` - Hero title
- `description` - Hero description
- `primaryCta` - Primary button (text & URL)
- `secondaryCta` - Secondary button

### PropertyHighlights

Features/highlights section.

**Key properties to edit:**
- `subtitle` - Section label
- `title` - Section title
- `highlights[]` - Array of feature items

### PropertyStats

Quick statistics display.

**Key properties to edit:**
- `stats[]` - Array of stat cards with value and label

### Other Components

- **PropertyBrochure** - `title`, `description`, `pdfUrl`
- **PropertyGallery** - `images[]`, `floorPlanLevels[]`
- **PropertyLocationSection** - `latitude`, `longitude`, `zoom`, `highlights[]`
- **PropertyOverview** - `title`, `paragraphs[]`
- **PropertyProperty** - `features[]`, `details` object
- **PropertyFooter** - `siteName`, `tagline`, `copyright`

## Common Editing Tasks

### Add a New Space

Edit `PropertyAvailableSpaces.data.md`:

```yaml
spaces:
  # ... existing spaces ...

  - name: New Suite
    floor: 2nd Floor
    size: "2,000"
    rentalRate: "$8,000"
    rateUnit: /MO
    spaceUse: Office
    available: true
```

### Change Transportation Options

Edit `PropertyNearby.data.md`:

```yaml
transportation:
  - name: New Station
    type: rail
    distance: 10 min
    duration: 5.0 mi
```

### Update Agent Information

Edit `PropertyContactSection.data.md`:

```yaml
agentName: John Doe
agentTitle: Senior Real Estate Agent
agentPhone: "+1 (555) 123-4567"
agentEmail: john@example.com
```

### Add Open House Event

Edit `PropertyContactSection.data.md`:

```yaml
events:
  - date: "2025-02-15"
    startTime: "10:00"
    endTime: "12:00"
```

## Troubleshooting

### Build Fails: "Cannot find PropertyX.data.md"

**Problem:** A `.data.md` file is missing for a component.

**Solution:**
- Check that the file exists in the same directory as the component
- File names must match: `PropertyNearby.svelte` → `PropertyNearby.data.md`
- Check for typos in file names

### YAML Parsing Error

**Problem:** Build fails with "YAMLException" message.

**Solution:**
- Check indentation (must be 2 spaces, not tabs)
- Quote strings with special characters: `"Jet's Pizza"`
- Make sure colons are followed by spaces: `name: value` ✓, `name:value` ✗
- Arrays start with `-` and have proper indentation

**Example of incorrect YAML:**
```yaml
# ✗ Wrong: missing space after colon
name:Jet's Pizza

# ✓ Correct:
name: "Jet's Pizza"
```

### Component Not Showing Default Data

**Problem:** Component renders but without data from `.data.md`.

**Solution:**
1. Rebuild the project: `npm run build`
2. Check that `.data.md` file exists
3. Verify YAML syntax is correct
4. Check component is in correct directory

### How to Verify Changes

After editing a `.data.md` file:

1. **Rebuild the project:**
   ```bash
   npm run build
   ```

2. **In development mode:**
   ```bash
   npm run dev
   ```
   Changes will be injected at next build

3. **Check the output:**
   - Inspect built files to see if defaults are included
   - Visit the page and verify changes appear

## Tips for Success

✓ **Keep it simple** - Edit one prop at a time

✓ **Use a code editor** - VS Code or similar helps with YAML syntax highlighting

✓ **Check indentation** - YAML requires proper indentation (2 spaces per level)

✓ **Quote special characters** - Strings with quotes, colons, or special chars need quotes

✓ **Test incrementally** - After editing, rebuild and verify changes

✓ **Keep backups** - Before major edits, save a backup of the `.data.md` file

✓ **Follow the pattern** - Copy existing entries when adding new items (spaces, amenities, etc.)

## Support & Questions

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Look at example files in the template
3. Verify YAML syntax using a YAML validator
4. Check build logs for specific error messages

---

**Happy editing! 🎉**
