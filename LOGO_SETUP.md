# Logo Implementation Guide

## Logo File Setup

### Where to Place the Logo
Place the `logo.png` file in:
```
src/assets/images/logo.png
```

### Logo Specifications

#### Recommended Dimensions
- **Aspect Ratio**: 4:1 to 1:1 (landscape or square recommended)
- **Dimensions**: 
  - Desktop: Should look good at max-height 60px
  - Tablet: Should look good at max-height 55px
  - Mobile: Should look good at max-height 45px
- **Format**: PNG with transparent background (recommended)
- **File Size**: Keep under 50KB for performance

#### Design Guidelines
- **Background**: Transparent background recommended
- **Padding**: No padding needed (image-only)
- **Logo Style**: Should match brand identity
- **Text/Icons**: Can include company name, initials, or symbol

### Example Dimensions
- **PNG File Size**: 400×100px (landscape) or 200×200px (square)
- **Actual Rendering**: Will scale to fit max-height constraints

---

## Implementation Details

### HTML Structure
```jsx
<Link to="/" className="logo" onClick={closeMenu}>
  <img 
    src="/src/assets/images/logo.png" 
    alt="Shree Guhan Steels Logo" 
    className="logo-image"
  />
</Link>
```

### CSS Styling
```css
.logo {
  display: flex;
  align-items: center;      /* Vertical centering */
  gap: var(--spacing-sm);   /* Spacing from nav */
  text-decoration: none;
  flex-shrink: 0;
  transition: var(--transition-normal);
  height: 100%;
}

.logo:hover {
  transform: translateY(-2px);  /* Subtle lift on hover */
}

.logo-image {
  max-height: 60px;         /* Desktop: max height */
  height: auto;             /* Maintain aspect ratio */
  width: auto;
  display: block;
  object-fit: contain;      /* No distortion */
  transition: transform var(--transition-normal);
}
```

### Responsive Sizing
| Breakpoint | Max-Height |
|-----------|-----------|
| Desktop (1024px+) | 60px |
| Tablet (768px) | 55px |
| Mobile (480px) | 45px |

---

## Header Layout

### Current Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  [Navigation Menu...]  [Action Buttons...]           │
│ (60px)                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Flexbox Properties
```
.header-container {
  display: flex;
  align-items: center;      /* Vertically center all items */
  justify-content: space-between;
  height: 80px;
  gap: var(--spacing-lg);   /* Spacing between sections */
}
```

### Logo Positioning
- **Position**: Far left
- **Alignment**: Vertically centered (flexbox)
- **Flex Behavior**: `flex-shrink: 0` (doesn't shrink)
- **Hover Effect**: Slight upward movement (-2px)

---

## Mobile Behavior

### Mobile Header (< 768px)
```
┌──────────────────────────────┐
│ [Logo]  ☰  [Action Buttons]  │
│ (55px)                       │
└──────────────────────────────┘
```

### Small Mobile (< 480px)
```
┌──────────────────────┐
│ [Logo]  ☰  [Buttons] │
│ (45px)               │
└──────────────────────┘
```

- Navigation menu hidden behind hamburger
- Logo scales down to fit smaller screens
- Maintains aspect ratio

---

## Testing Checklist

- [ ] Logo file exists at `src/assets/images/logo.png`
- [ ] Logo displays on desktop (60px height)
- [ ] Logo displays on tablet (55px height)
- [ ] Logo displays on mobile (45px height)
- [ ] Logo is vertically centered
- [ ] Logo maintains aspect ratio (no distortion)
- [ ] Logo has proper spacing from navigation menu
- [ ] Logo hover effect works (slight lift)
- [ ] Logo link works (navigates to home)
- [ ] Alt text displays in browser DevTools
- [ ] No layout shifts when logo loads
- [ ] Logo transparent background shows correctly

---

## Troubleshooting

### Logo Not Showing
**Issue**: Image path incorrect
**Solution**: 
- Verify file exists at `src/assets/images/logo.png`
- Check browser DevTools Network tab for 404 errors
- Ensure correct import path in Header.jsx

### Logo Distorted
**Issue**: Aspect ratio not maintained
**Solution**:
- Ensure `height: auto` and `width: auto` in CSS
- Verify original logo image is correct aspect ratio
- Check `object-fit: contain` is applied

### Logo Not Centered Vertically
**Issue**: Alignment issue
**Solution**:
- Verify `.logo` has `display: flex`
- Check `.logo` has `align-items: center`
- Verify `.header-container` has `align-items: center`
- Check logo height doesn't exceed container

### Logo Too Large/Small
**Issue**: Sizing needs adjustment
**Solution**:
- Adjust `max-height` values in CSS
- Desktop: Try 55px, 60px, or 65px
- Tablet: Try 50px or 55px
- Mobile: Try 40px or 45px

---

## Future Customization

### If You Want to Change Logo Size
Edit `Header.css`:
```css
.logo-image {
  max-height: 65px;  /* Increase from 60px */
}

@media (max-width: 768px) {
  .logo-image {
    max-height: 60px;  /* Adjust tablet */
  }
}

@media (max-width: 480px) {
  .logo-image {
    max-height: 50px;  /* Adjust mobile */
  }
}
```

### If You Want to Add Spacing
Edit `Header.css`:
```css
.logo {
  gap: 24px;  /* Increase spacing from navigation */
}
```

### If You Want to Add Logo Text
Update `Header.jsx`:
```jsx
<Link to="/" className="logo" onClick={closeMenu}>
  <img 
    src="/src/assets/images/logo.png" 
    alt="Shree Guhan Steels Logo" 
    className="logo-image"
  />
  <span className="logo-text">Shree Guhan Steels</span>
</Link>
```

Then add CSS:
```css
.logo-text {
  font-weight: 700;
  color: var(--primary-blue);
  font-size: 1.1rem;
}
```

---

## Performance Notes

✅ **Image Optimization**:
- Use PNG format for transparent background
- Compress using online tools (TinyPNG, etc.)
- Recommended file size: < 50KB
- Can use WEBP format for better compression

✅ **Loading Strategy**:
- Logo loads immediately (no lazy loading needed)
- Uses standard `<img>` tag
- No additional JavaScript

---

## Browser Support

✅ All modern browsers support:
- `<img>` element
- Flexbox alignment
- `object-fit: contain`
- `max-height` CSS property
- `:hover` pseudo-class

---

**Logo Implementation Version**: 1.0.0  
**Last Updated**: February 4, 2026

