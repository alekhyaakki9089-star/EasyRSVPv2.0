# Admin Access Control - EasyRSVP

## 🔐 Security Overview

The EasyRSVP template management system now includes authentication to prevent unauthorized template uploads.

## Access Levels

### **Public Users**
- ✅ Can view all templates
- ✅ Can filter by language and category
- ✅ Can use templates for invitations
- ❌ Cannot upload templates
- ❌ Cannot access admin panel

### **Admin Users**
- ✅ All public user permissions
- ✅ Can upload new templates
- ✅ Can manage existing templates
- ✅ Can access admin panel
- ✅ Can set template language and category

## Authentication System

### **Login Process**
1. Visit `/admin-login.html`
2. Enter admin credentials
3. System validates credentials
4. Session is created for authenticated user
5. Redirect to admin panel

### **Demo Credentials**
- **Username**: `admin`
- **Password**: `easyrsvp2026`

### **Session Management**
- Uses browser `sessionStorage` for authentication state
- Session expires when browser is closed
- Automatic logout after inactivity
- Secure redirect to login if not authenticated

## Admin Panel Features

### **Template Upload**
- Drag & drop file upload
- Language selection (English, Telugu, Hindi, Gujarati, Tamil)
- Category selection (Wedding, Party, Corporate, Baby Shower)
- Template metadata (name, description, tags)
- Image preview before upload
- File validation (format, size)

### **Template Management**
- View existing templates
- Delete templates
- Edit template information
- Bulk operations

## Security Features

### **Frontend Protection**
- Authentication check on admin pages
- Automatic redirect to login
- Session validation
- Logout functionality

### **File Upload Security**
- File type validation (JPG, PNG, WebP only)
- File size limits (5MB max)
- Filename sanitization
- Preview generation

## Production Recommendations

### **Enhanced Security (For Production)**
1. **Server-side Authentication**
   - Replace client-side auth with server validation
   - Use JWT tokens or session cookies
   - Implement password hashing (bcrypt)
   - Add rate limiting for login attempts

2. **User Management**
   - Multiple admin accounts
   - Role-based permissions (Super Admin, Editor, Viewer)
   - User registration/invitation system
   - Password reset functionality

3. **File Upload Security**
   - Server-side file validation
   - Virus scanning
   - Cloud storage integration (AWS S3, Cloudinary)
   - Image optimization and resizing
   - CDN integration

4. **Database Integration**
   - Store template metadata in database
   - User management system
   - Audit logs for admin actions
   - Template approval workflow

## Current Implementation

### **Files**
- `admin-login.html` - Login page
- `admin-templates.html` - Protected admin panel
- `templates.html` - Public templates page (updated with secure links)

### **Authentication Flow**
```
User visits admin-templates.html
    ↓
Check sessionStorage for 'adminAuthenticated'
    ↓
If not authenticated → Redirect to admin-login.html
    ↓
User enters credentials
    ↓
Validate credentials (client-side demo)
    ↓
Set session and redirect to admin panel
```

### **Access Control**
- **Public**: Anyone can view templates
- **Admin**: Only authenticated users can upload/manage templates
- **Session-based**: Authentication persists during browser session

## Usage Instructions

### **For Site Owners**
1. Change default admin credentials
2. Access admin panel via `/admin-login.html`
3. Upload templates with proper language/category tags
4. Monitor template usage and user feedback

### **For Developers**
1. Implement server-side authentication for production
2. Add database integration for scalability
3. Enhance security with proper validation
4. Add user management features

## Testing the System

1. **Public Access**: Visit `/templates.html` - should work without login
2. **Admin Access**: Visit `/admin-templates.html` - should redirect to login
3. **Login**: Use demo credentials to access admin panel
4. **Upload**: Test template upload with different languages
5. **Logout**: Test logout functionality and session clearing

The system now properly restricts admin access while keeping templates publicly viewable!