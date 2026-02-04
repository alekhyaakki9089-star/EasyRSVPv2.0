# 🎨 EasyRSVP Design Specifications & Guidelines

## 📊 **Color Palette**

### Primary Colors
- **Primary**: `#6366f1` (Indigo 500) - Main brand color
- **Primary Dark**: `#4f46e5` (Indigo 600) - Hover states, emphasis
- **Primary Light**: `#a5b4fc` (Indigo 300) - Subtle accents

### Secondary Colors
- **Secondary**: `#ec4899` (Pink 500) - Call-to-action accents
- **Secondary Light**: `#f472b6` (Pink 400) - Highlights
- **Secondary Dark**: `#be185d` (Pink 700) - Deep accents

### Accent Colors
- **Accent**: `#06b6d4` (Cyan 500) - Information, links
- **Success**: `#10b981` (Emerald 500) - Success states
- **Warning**: `#f59e0b` (Amber 500) - Warning states
- **Error**: `#ef4444` (Red 500) - Error states

### Neutral Colors
- **Text Dark**: `#0f172a` (Slate 900) - Primary text
- **Text Medium**: `#334155` (Slate 700) - Secondary text
- **Text Light**: `#64748b` (Slate 500) - Tertiary text
- **Text Muted**: `#cbd5e1` (Slate 300) - Disabled text

### Background Colors
- **White**: `#ffffff` - Primary background
- **Light**: `#f8fafc` (Slate 50) - Section backgrounds
- **Lighter**: `#f1f5f9` (Slate 100) - Card backgrounds

### Gradient Combinations
```css
--gradient-primary: linear-gradient(135deg, #6366f1, #ec4899)
--gradient-hero: linear-gradient(135deg, #6366f1 0%, #4f46e5 35%, #ec4899 100%)
--gradient-success: linear-gradient(135deg, #10b981, #06b6d4)
--gradient-warm: linear-gradient(135deg, #f59e0b, #ec4899)
--gradient-cool: linear-gradient(135deg, #06b6d4, #6366f1)
```

## 🔤 **Typography System**

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Font Scale
- **XS**: 0.75rem (12px)
- **SM**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **LG**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)
- **6XL**: 3.75rem (60px)

### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800
- **Black**: 900

### Line Heights
- **Tight**: 1.25
- **Snug**: 1.375
- **Normal**: 1.5
- **Relaxed**: 1.625
- **Loose**: 2.0

## 🎯 **Icon & Illustration Guidelines**

### Feature Section Icons
1. **Premium Templates**: Star icon with gradient background
2. **Mobile-First Design**: Monitor/device icon
3. **Real-time Analytics**: Trending chart icon
4. **Multi-Channel Delivery**: Mail/message icon
5. **Enterprise Security**: Lock/shield icon
6. **Advanced Features**: Settings/gear icon

### Template Category Icons
1. **Weddings**: Heart icon
2. **Parties**: Chat bubble icon
3. **Corporate**: Package/box icon
4. **Baby Showers**: Clipboard icon

### Icon Specifications
- **Size**: 32px × 32px (in 80px × 80px wrapper)
- **Stroke Width**: 2px
- **Color**: White (on gradient background)
- **Style**: Outline/stroke icons (Lucide/Feather style)

## 📐 **Layout & Spacing**

### Spacing Scale
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)
- **3XL**: 4rem (64px)
- **4XL**: 5rem (80px)
- **5XL**: 6rem (96px)

### Border Radius
- **SM**: 0.375rem (6px)
- **MD**: 0.5rem (8px)
- **LG**: 0.75rem (12px)
- **XL**: 1rem (16px)
- **2XL**: 1.5rem (24px)
- **3XL**: 2rem (32px)
- **Full**: 9999px (pill shape)

### Container Widths
- **Mobile**: 100% (with 16px padding)
- **Tablet**: 720px
- **Desktop**: 1280px

## 🎨 **Section Layouts**

### Hero Section
```
Layout: Split-screen (Desktop) / Stacked (Mobile)
Left: Content (60%) | Right: Visual (40%)
Background: Gradient with particle animation
Elements:
- Trust badge
- Headline with highlighted text
- Subtitle
- CTA buttons (primary + secondary)
- Feature bullets
- Floating invitation cards (3)
```

### Features Section
```
Layout: 3×2 Grid (Desktop) / 2×3 Grid (Tablet) / 1×6 Grid (Mobile)
Background: White
Elements:
- Section header with description
- Feature cards with:
  - Icon wrapper (gradient background)
  - Title
  - Description
  - Highlight badge
```

### Templates Section
```
Layout: 2×2 Grid (Desktop) / 2×2 Grid (Tablet) / 1×4 Grid (Mobile)
Background: Light gray
Elements:
- Section header
- Category cards with:
  - Icon wrapper
  - Title
  - Description
  - Stats badge
- CTA button
```

### Pricing Section
```
Layout: 3×1 Grid (Desktop) / 2+1 Grid (Tablet) / 1×3 Grid (Mobile)
Background: Gradient light
Elements:
- Section header
- Pricing cards with:
  - Popular badge (featured)
  - Plan name
  - Price
  - Feature list
  - CTA button
- Footer with guarantee
```

## 📱 **Responsive Breakpoints**

### Breakpoint System
- **Mobile Small**: < 480px
- **Mobile Large**: 481px - 767px
- **Tablet Portrait**: 768px - 1023px
- **Tablet Landscape**: 1024px - 1199px
- **Desktop**: 1200px+

### Key Responsive Changes
1. **Hero**: Split → Stacked layout
2. **Navigation**: Horizontal → Hamburger menu
3. **Grids**: 3-column → 2-column → 1-column
4. **Typography**: Fluid scaling with clamp()
5. **Spacing**: Reduced padding/margins
6. **Buttons**: Full-width on mobile

## ✨ **Animation & Interaction Guidelines**

### Animation Principles
- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Stagger**: 100ms delay between elements
- **Respect**: prefers-reduced-motion

### Key Animations
1. **Floating Cards**: Continuous float with rotation
2. **Feature Cards**: Hover lift + shimmer effect
3. **Buttons**: Ripple effect + magnetic hover
4. **Scroll**: Parallax + intersection observer
5. **Page Load**: Staggered fade-in animations

### Hover Effects
- **Cards**: translateY(-8px) + enhanced shadow
- **Buttons**: translateY(-2px) + color change
- **Icons**: scale(1.1) + rotate(5deg)

## 🎯 **CTA Button Specifications**

### Button Variants
1. **Primary**: Gradient background, white text
2. **Secondary**: Transparent with border
3. **Featured**: Enhanced gradient with glow

### Button Sizes
- **Default**: 16px × 32px padding
- **Large**: 20px × 40px padding
- **Mobile**: Full width, 16px × 24px padding

### Button States
- **Default**: Base styling
- **Hover**: Lift + color change
- **Focus**: Outline ring
- **Active**: Slight press down
- **Loading**: Spinner animation
- **Disabled**: Reduced opacity

## 🔧 **Accessibility Features**

### WCAG Compliance
- **Color Contrast**: 4.5:1 minimum ratio
- **Focus Indicators**: Visible outline rings
- **Keyboard Navigation**: Tab order support
- **Screen Readers**: ARIA labels and descriptions
- **Motion**: Respect prefers-reduced-motion

### Inclusive Design
- **Touch Targets**: Minimum 44px × 44px
- **Text Scaling**: Support up to 200% zoom
- **High Contrast**: Alternative color scheme
- **Dark Mode**: System preference support

## 📊 **Performance Optimizations**

### Loading Strategy
- **Critical CSS**: Inline above-the-fold styles
- **Font Loading**: font-display: swap
- **Images**: Lazy loading + WebP format
- **Animations**: GPU acceleration with transform

### Bundle Optimization
- **CSS**: Minification + purging
- **JavaScript**: Tree shaking + compression
- **Assets**: Compression + CDN delivery

## 🎨 **Brand Guidelines**

### Logo Usage
- **Primary**: Gradient text treatment
- **Minimum Size**: 120px width
- **Clear Space**: 0.5x logo height on all sides
- **Backgrounds**: White or dark only

### Voice & Tone
- **Professional**: Yet approachable
- **Confident**: Without being arrogant
- **Helpful**: Solution-oriented
- **Modern**: Contemporary language

### Photography Style
- **Bright**: Well-lit, vibrant colors
- **Diverse**: Inclusive representation
- **Authentic**: Real people, genuine moments
- **Consistent**: Unified color grading

## 🚀 **Implementation Checklist**

### Phase 1: Foundation
- [ ] Color system implementation
- [ ] Typography scale setup
- [ ] Spacing system
- [ ] Component library basics

### Phase 2: Components
- [ ] Button variants
- [ ] Card components
- [ ] Icon system
- [ ] Form elements

### Phase 3: Layouts
- [ ] Hero section
- [ ] Feature grid
- [ ] Template showcase
- [ ] Pricing table

### Phase 4: Interactions
- [ ] Hover effects
- [ ] Scroll animations
- [ ] Mobile menu
- [ ] Loading states

### Phase 5: Optimization
- [ ] Performance audit
- [ ] Accessibility testing
- [ ] Cross-browser testing
- [ ] Mobile optimization

## 📈 **Success Metrics**

### User Experience
- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Mobile Usability**: 100% score

### Accessibility
- **WCAG AA**: Full compliance
- **Lighthouse**: 100% accessibility score
- **Screen Reader**: Full compatibility
- **Keyboard Navigation**: Complete support

### Conversion Optimization
- **CTA Visibility**: Above-the-fold placement
- **Button Contrast**: High visibility
- **Form Completion**: Streamlined flow
- **Trust Signals**: Prominent display

---

*This design system ensures consistency, accessibility, and optimal user experience across all devices and use cases.*