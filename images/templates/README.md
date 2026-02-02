# Template Images Folder

This folder contains all the template images for EasyRSVP organized by language and category.

## Multi-Language Structure
```
images/templates/
├── wedding-elegant-english.jpg
├── wedding-elegant-telugu.jpg
├── wedding-elegant-hindi.jpg
├── wedding-elegant-gujarati.jpg
├── wedding-elegant-tamil.jpg
├── party-birthday-english.jpg
├── party-birthday-hindi.jpg
├── corporate-conference-telugu.jpg
└── baby-shower-tamil.jpg
```

## Naming Convention
Use this format: `category-templatename-language.jpg`

Examples:
- `wedding-elegant-garden-english.jpg`
- `wedding-traditional-telugu.jpg`
- `party-birthday-celebration-hindi.jpg`
- `corporate-annual-meeting-gujarati.jpg`
- `baby-shower-sweet-tamil.jpg`

## Supported Languages
- **English**: `english`
- **Telugu**: `telugu` (తెలుగు)
- **Hindi**: `hindi` (हिंदी)
- **Gujarati**: `gujarati` (ગુજરાતી)
- **Tamil**: `tamil` (தமிழ்)

## Template Requirements by Language

### English Templates
- Standard Western invitation layouts
- Left-to-right text flow
- English fonts and typography

### Telugu Templates (తెలుగు)
- Telugu script support
- Traditional South Indian design elements
- Cultural motifs and colors

### Hindi Templates (हिंदी)
- Devanagari script support
- North Indian cultural elements
- Traditional patterns and designs

### Gujarati Templates (ગુજરાતી)
- Gujarati script support
- Western Indian cultural themes
- Regional color preferences

### Tamil Templates (தமிழ்)
- Tamil script support
- South Indian traditional elements
- Cultural symbols and patterns

## Image Guidelines
- Format: JPG, PNG, or WebP
- Resolution: Minimum 800x600px
- Aspect ratio: 4:3 or 16:9 preferred
- File size: Under 5MB
- Quality: High resolution for crisp text display
- Text: Ensure regional language text is clearly readable

## Adding New Language Templates
1. Create template image with appropriate language text
2. Name file using convention: `category-name-language.jpg`
3. Add to this folder
4. Update `templates.html` with new template card
5. Include `data-language="languagecode"` attribute
6. Test language filtering functionality