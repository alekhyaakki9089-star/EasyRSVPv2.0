# Template Upload Guide for EasyRSVP

## How to Upload Your Own Templates

### Method 1: Using the Admin Interface (Recommended)
1. Open `admin-templates.html` in your browser
2. Drag and drop your JPG/PNG files or click to browse
3. Fill in template details (name, category, description)
4. Click "Upload Template"

### Method 2: Manual File Upload
1. **Prepare your images:**
   - Format: JPG, PNG, or WebP
   - Size: Recommended 800x600px or 1200x900px
   - File size: Under 5MB each
   - Name format: `category-templatename.jpg` (e.g., `wedding-elegant-garden.jpg`)

2. **Upload to the images folder:**
   ```
   images/
   └── templates/
       ├── wedding-elegant-garden.jpg
       ├── wedding-modern-minimal.jpg
       ├── party-birthday-fun.jpg
       ├── corporate-conference.jpg
       └── baby-shower-sweet.jpg
   ```

3. **Update templates.html:**
   Add your template card following this structure:
   ```html
   <div class="template-card" data-category="wedding">
       <div class="template-preview" data-template="wedding-elegant-garden">
           <img src="images/templates/wedding-elegant-garden.jpg" 
                alt="Elegant Garden Wedding Template" 
                class="template-image" 
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
           <div class="template-fallback wedding-elegant">
               <!-- Fallback content if image fails -->
           </div>
       </div>
       <div class="template-info">
           <h4>Elegant Garden Wedding</h4>
           <p>Perfect for outdoor wedding celebrations</p>
           <button class="use-template-btn">Use Template</button>
       </div>
   </div>
   ```

### Template Categories
- `wedding` - Wedding invitations
- `party` - Birthday parties, celebrations
- `corporate` - Business events, conferences
- `baby` - Baby showers, gender reveals

### Image Guidelines
- **Resolution:** 800x600px minimum (4:3 ratio preferred)
- **Quality:** High resolution for crisp display
- **Content:** Should show the full invitation design
- **Text:** Make sure text is readable in preview
- **Colors:** Use web-safe colors for best display

### File Naming Convention
Use descriptive names with category prefix:
- `wedding-elegant-floral.jpg`
- `party-birthday-colorful.jpg`
- `corporate-modern-blue.jpg`
- `baby-shower-pink-elephant.jpg`

### After Upload
1. Test the template page: `templates.html`
2. Verify images load correctly
3. Test filtering functionality
4. Check mobile responsiveness

### Deployment
After adding templates:
1. `git add .`
2. `git commit -m "Add new custom templates"`
3. `git push`
4. Vercel will auto-deploy in 1-2 minutes

### Troubleshooting
- **Image not showing:** Check file path and name
- **Slow loading:** Optimize image size (use tools like TinyPNG)
- **Mobile issues:** Ensure images are responsive
- **Filter not working:** Check `data-category` attribute matches exactly

### Future Enhancements
- Automatic image optimization
- Bulk upload functionality
- Template editor integration
- User-generated template uploads
- Template analytics and usage tracking