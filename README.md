# EasyRSVP v2.0 🎉

A modern, multi-language digital invitation platform that rivals Evite and Greetings Island.

> **Latest Update**: Fixed multi-language template system with comprehensive language support and improved filtering.

## ✨ Features

### 🎨 **Template System**
- **20+ Professional Templates** across 4 categories (Wedding, Party, Corporate, Baby Shower)
- **Multi-language Support** - English, Telugu, Hindi, Gujarati, Tamil with native scripts
- **Full Customization** - Colors, fonts, backgrounds, layouts
- **Real-time Preview** - See changes instantly

### 📧 **RSVP Management**
- **Public RSVP Collection** - Beautiful forms for guests
- **Guest Management** - Track responses, dietary restrictions, plus ones
- **Real-time Analytics** - Response rates, attendance tracking
- **Export Functionality** - CSV export for guest lists

### 🔗 **Sharing & Distribution**
- **Multiple Sharing Options** - Email, WhatsApp, Facebook, Twitter
- **Public Invitation Pages** - Beautiful invitation views
- **Direct RSVP Links** - Easy guest access
- **Mobile Optimized** - Perfect on all devices

### 👤 **User System**
- **User Authentication** - Secure signup/signin
- **Personal Dashboard** - Manage all your events
- **Admin Panel** - Template upload and management
- **Data Persistence** - Save and track everything

## 🚀 **Live Demo**

Visit: **[EasyRSVP v2.0 Live Site](https://easyrsvp-v2.vercel.app)**

### Test Accounts:
- **Demo User**: `demo@easyrsvp.com` / `demo123`
- **Admin**: `admin` / `easyrsvp2026`

## 🛠️ **Technology Stack**

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Modern CSS with Glassmorphism effects
- **Fonts**: Inter + Google Fonts for multi-language support
- **Storage**: LocalStorage (easily upgradeable to database)
- **Deployment**: Vercel with GitHub Actions CI/CD

## 📱 **Pages & Features**

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | `/` | Modern homepage with features |
| **Templates** | `/templates.html` | 20+ templates with filters |
| **Editor** | `/template-editor.html` | Full customization suite |
| **RSVP Form** | `/rsvp.html?id=xxx` | Public guest response form |
| **Invitation** | `/invitation.html?id=xxx` | Public invitation view |
| **RSVP Tracker** | `/rsvp-tracker.html` | Guest management dashboard |
| **Dashboard** | `/dashboard.html` | User control panel |
| **Auth** | `/signin.html`, `/signup.html` | User authentication |

## 🔧 **Local Development**

```bash
# Clone the repository
git clone https://github.com/alekhyaakki9089-star/EasyRSVPv2.0.git
cd EasyRSVPv2.0

# Start local server
python -m http.server 8000
# or
npm run dev

# Visit http://localhost:8000
```

## 🚀 **Deployment**

### Automatic Deployment (Recommended)
This project uses GitHub Actions for automatic deployment to Vercel:

1. **Fork/Clone** this repository
2. **Connect to Vercel** - Import your GitHub repository
3. **Set Environment Variables** in Vercel dashboard:
   - `VERCEL_TOKEN` - Your Vercel API token
4. **Push to main branch** - Automatic deployment triggers

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🌍 **Multi-Language Support**

EasyRSVP v2.0 supports 5 languages with native scripts:

- **English** - Default language
- **తెలుగు (Telugu)** - Native Devanagari script
- **हिंदी (Hindi)** - Native Devanagari script  
- **ગુજરાતી (Gujarati)** - Native Gujarati script
- **தமிழ் (Tamil)** - Native Tamil script

## 📊 **Competitive Analysis**

| Feature | EasyRSVP v2.0 | Evite | Greetings Island |
|---------|---------------|-------|------------------|
| **Templates** | 20+ (Growing) | 100+ | 1000+ |
| **Multi-language** | ✅ 5 Languages | ❌ English only | ❌ English only |
| **Template Editor** | ✅ Full editor | ✅ Basic | ✅ Advanced |
| **RSVP Tracking** | ✅ Complete | ✅ Basic | ✅ Basic |
| **Mobile Responsive** | ✅ Perfect | ✅ Good | ✅ Good |
| **Free Tier** | ✅ Full features | ✅ Limited | ✅ Limited |

## 🎯 **Unique Selling Points**

1. **Multi-language Advantage** - Only platform supporting Indian languages
2. **Modern Design** - Contemporary UI with glassmorphism effects
3. **Complete Feature Set** - Everything needed for event management
4. **Mobile-First** - Perfect experience on all devices
5. **Open Source** - Customizable and extensible

## 📁 **Project Structure**

```
EasyRSVPv2.0/
├── 📄 Core Pages
│   ├── index.html              # Landing page
│   ├── templates.html          # Template gallery
│   ├── template-editor.html    # Customization editor
│   ├── rsvp.html              # Public RSVP form
│   ├── invitation.html        # Public invitation view
│   └── rsvp-tracker.html      # Guest management
├── 🔐 Authentication
│   ├── signin.html            # User login
│   ├── signup.html            # User registration
│   ├── dashboard.html         # User dashboard
│   ├── admin-login.html       # Admin access
│   └── admin-templates.html   # Template management
├── 🎨 Styling
│   ├── styles.css             # Main styles
│   ├── auth-styles.css        # Authentication styles
│   ├── editor-styles.css      # Editor-specific styles
│   └── templates.css          # Template gallery styles
├── ⚡ JavaScript
│   ├── template-editor.js     # Editor functionality
│   ├── templates.js           # Template filtering
│   ├── rsvp.js               # RSVP form handling
│   ├── rsvp-tracker.js       # Guest management
│   └── validation.js         # Form validation
├── 🚀 Deployment
│   ├── .github/workflows/     # GitHub Actions
│   ├── vercel.json           # Vercel configuration
│   └── package.json          # Project metadata
└── 📚 Documentation
    ├── README.md             # This file
    ├── ADMIN_ACCESS_CONTROL.md
    └── TEMPLATE_UPLOAD_GUIDE.md
```

## 🔮 **Future Enhancements**

- [ ] **Database Integration** - Replace localStorage with real database
- [ ] **Email Service** - Automated invitation sending
- [ ] **Payment Integration** - Premium features
- [ ] **More Templates** - Expand to 100+ templates
- [ ] **Advanced Analytics** - Detailed event insights
- [ ] **Calendar Integration** - Google Calendar, Outlook sync
- [ ] **Photo Sharing** - Event photo galleries
- [ ] **Guest Check-in** - QR code-based check-in system

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Google Fonts for multi-language typography
- Modern CSS techniques for responsive design
- Vercel for seamless deployment
- GitHub Actions for CI/CD automation

---

**Built with ❤️ for the global community** 🌍