# Quick Reference - Shree Guhan Steels UI Components

## Header/Navbar

### Features
✅ Sticky white header with blue bottom border  
✅ Logo with icon and text (responsive)  
✅ Navigation menu with dropdowns  
✅ Right-side action buttons (blue & red)  
✅ Search icon button  
✅ Mobile hamburger menu  
✅ Hover underline animations  
✅ Smooth dropdown animations  

### Key Props/States
- `isMenuOpen`: Toggle mobile menu visibility
- `activeDropdown`: Track which dropdown is open (About Us, Products, Resources)
- `handleDropdown()`: Toggle dropdown state

### Usage
```jsx
import Header from "./components/Header/Header";

<Header />
```

---

## Hero Section

### Features
✅ Full-width (100vh) banner  
✅ "22 Years of Excellence" badge with spinning icon  
✅ Large gradient title  
✅ Description text  
✅ Two CTA buttons (Primary + Outline)  
✅ Statistics section (Happy Customers, Projects, Satisfaction)  
✅ Decorative floating shapes  
✅ Fade-in animations  
✅ Scroll indicator at bottom  

### Key Elements
- `.excellence-badge`: "22 Years" badge
- `.hero-title`: Main heading
- `.hero-highlight`: "Built with Strength..." text
- `.hero-buttons`: CTA buttons container
- `.hero-stats`: Statistics row
- `.scroll-indicator`: Bouncing down arrow

### Animation Delays
- Badge: 0s
- Title: 0.1s
- Highlight: 0.2s
- Description: 0.3s
- Buttons: 0.4s
- Stats: 0.5s

---

## Color Reference

### Primary Colors
```
--primary-blue: #0F4C75
--primary-blue-dark: #0a3554
--primary-blue-light: #1565a0
```

### Accent Colors
```
--accent-red: #E63946
--accent-red-dark: #d62828
--industrial-gold: #D4A017
```

### Neutral
```
--white: #FFFFFF
--light-gray: #F5F5F5
--dark-gray: #3A3A3A
--charcoal-black: #1C1C1C
```

---

## Button Styles

### Primary Blue Button
```jsx
<Link to="/products" className="btn btn-primary btn-lg">
  View Products
</Link>
```

### Outline Button
```jsx
<Link to="/contact" className="btn btn-outline btn-lg">
  Enquire Now
</Link>
```

### Red Button
```jsx
<button className="btn btn-red customer-care">
  Customer Care
</button>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|-----------|-------|---------|
| Desktop | 1024px+ | Full nav, all buttons, shapes visible |
| Tablet | 768px - 1023px | Smaller buttons, reduced spacing |
| Mobile | 480px - 767px | Mobile menu, stacked buttons |
| Small Mobile | <480px | Minimal layout, icon-only logo |

---

## Spacing Scale

| Variable | Value |
|----------|-------|
| --spacing-xs | 8px |
| --spacing-sm | 16px |
| --spacing-md | 24px |
| --spacing-lg | 32px |
| --spacing-xl | 48px |
| --spacing-xxl | 64px |

---

## Typography Scale

| Element | Size |
|---------|------|
| Hero Title | 4rem (desktop) |
| Section Title | 2.8rem |
| Heading 1 | 3rem |
| Heading 2 | 2.5rem |
| Heading 3 | 2rem |
| Body Text | 1rem |
| Small Text | 0.9rem |

---

## Animation Timings

```css
--transition-fast: 0.2s ease      /* Quick interactions */
--transition-normal: 0.3s ease    /* Default animations */
--transition-slow: 0.5s ease      /* Large movements */
```

---

## Common CSS Classes

### Containers
```css
.container          /* 1200px max-width wrapper */
.hero               /* Full-width hero section */
.features           /* Feature cards section */
.cta-section        /* Call-to-action section */
```

### Text
```css
.text-center        /* Center align text */
.logo-brand         /* Brand name styling */
.logo-subtext       /* Subtext styling */
```

### Components
```css
.btn                /* Base button */
.btn-primary        /* Blue button */
.btn-outline        /* Border button */
.btn-lg             /* Large button */

.nav                /* Navigation menu */
.dropdown           /* Dropdown container */
.dropdown-content   /* Dropdown items */

.feature-card       /* Feature card */
.stat               /* Statistics item */
```

---

## Animations Available

### Fade-In-Up
```css
animation: fadeInUp 0.8s ease-out;
```
Used for: Hero content, section titles

### Float
```css
animation: float 15s ease-in-out infinite;
```
Used for: Decorative shapes, feature icons

### Bounce
```css
animation: bounce 2s ease-in-out infinite;
```
Used for: Scroll indicator

### Spin
```css
animation: spin 3s linear infinite;
```
Used for: Badge star icon

### SlideDown
```css
animation: slideDown 0.3s ease;
```
Used for: Dropdown menus

---

## Dropdown Menu Structure

```jsx
<div className="dropdown">
  <button className="dropbtn" onClick={() => handleDropdown('products')}>
    Products <span className="dropdown-icon">▼</span>
  </button>
  <div className={`dropdown-content ${activeDropdown === 'products' ? 'show' : ''}`}>
    <Link to="/products">All Products</Link>
    <Link to="/products/doors">Doors</Link>
    <Link to="/products/windows">Windows</Link>
  </div>
</div>
```

---

## Mobile Menu Behavior

### Desktop (1024px+)
- Navigation always visible
- Dropdowns on hover
- Action buttons visible

### Tablet (768px - 1023px)
- Navigation visible with compact spacing
- Dropdowns on hover
- Some buttons may hide

### Mobile (480px - 767px)
- Hamburger menu toggle
- Mobile menu overlays page
- Dropdowns on click
- Full-width navigation items
- Buttons stack vertically

---

## Adding New Menu Items

1. Add link to Header.jsx nav section:
```jsx
<Link to="/new-page" className="nav-link" onClick={closeMenu}>
  New Item
</Link>
```

2. Or add dropdown:
```jsx
<div className="dropdown">
  <button className="dropbtn" onClick={() => handleDropdown('name')}>
    New Dropdown <span className="dropdown-icon">▼</span>
  </button>
  <div className={`dropdown-content ${activeDropdown === 'name' ? 'show' : ''}`}>
    <Link to="/page1">Item 1</Link>
    <Link to="/page2">Item 2</Link>
  </div>
</div>
```

---

## Modifying Colors

All colors are CSS variables in `index.css`. To change brand colors:

1. Update `:root` variables:
```css
:root {
  --primary-blue: #NEW_COLOR;
  --accent-red: #NEW_COLOR;
}
```

2. Colors automatically update across entire site

---

## Common Tasks

### Change Hero Title Color
Edit `Home.css`:
```css
.hero-title {
  background: linear-gradient(to bottom, var(--primary-blue), var(--accent-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Adjust Hero Section Height
Edit `Home.css`:
```css
.hero {
  min-height: 120vh;  /* Change from 100vh */
}
```

### Modify Button Size
Edit component CSS:
```css
.btn-lg {
  padding: 20px 50px;  /* Larger padding */
  font-size: 1.2rem;   /* Larger font */
}
```

### Change Transition Speed
Edit `index.css`:
```css
:root {
  --transition-normal: 0.5s ease;  /* From 0.3s */
}
```

---

## Browser DevTools Tips

### Test Responsive Breakpoints
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or custom width

### Inspect Animations
1. Open DevTools Animations panel
2. Perform action to trigger animation
3. Pause, slow down, or replay

### Check Color Contrast
1. Inspect element with DevTools
2. Check accessibility panel
3. Verify WCAG AA compliance

---

## Performance Notes

- ✅ Uses GPU-accelerated properties (transform, opacity)
- ✅ Smooth 60fps animations
- ✅ Minimal repaints/reflows
- ✅ CSS variables for efficient theming
- ✅ Responsive images ready (when added)

---

## Accessibility Features

✅ Semantic HTML structure  
✅ WCAG AA color contrast  
✅ Keyboard navigation support  
✅ Focus states visible  
✅ Alt text ready for images  
✅ ARIA labels for icons  
✅ Touch-friendly (44x44px minimum)  

---

## Troubleshooting

### Dropdowns not showing
- Check `activeDropdown` state
- Verify onClick handler fires
- Check CSS z-index (should be 1001+)

### Animations not smooth
- Check GPU acceleration (use transform)
- Verify transition duration > 0.2s
- Reduce animation complexity

### Mobile menu not closing
- Check `closeMenu()` is called
- Verify `isMenuOpen` state updates
- Test on actual mobile device

### Colors not updating
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS variable names
- Verify `:root` syntax

---

**Version**: 1.0.0  
**Last Updated**: February 4, 2026
