# FarmCS: India's First Smart Sprinkler System

A modern web application for intelligent agricultural irrigation management using Vue.js, Supabase, and real-time data analytics.

## 🌾 Features

- **Smart Irrigation Control**: Automated sprinkler system management
- **Real-time Analytics**: Comprehensive crop data visualization and weather monitoring
- **Multi-language Support**: Support for 9 Indian languages (English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi)
- **User Authentication**: Secure login and signup system
- **Dashboard**: Centralized control panel for system monitoring
- **Weather Integration**: Real-time weather data and forecasting
- **Crop Data Management**: Detailed crop production analytics across Indian states
- **Alert System**: Notifications for system status and weather events
- **Invoice Management**: Billing and subscription management
- **Settings Configuration**: Customizable system preferences

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3
- **Backend**: Supabase (Authentication & Database)
- **Styling**: CSS3 with Google Fonts (Poppins)
- **Icons**: Font Awesome 6.4.0
- **Animations**: AOS (Animate On Scroll)
- **Translation**: Google Translate API
- **Data Visualization**: Custom chart implementations
- **Maps**: India geoJSON for regional data

## 📁 Project Structure

```
FarmCS/
├── index.html              # Main application entry point
├── login.html              # User authentication page
├── signup.html             # User registration page
├── background.html         # Background component
├── home.html               # Home page component
├── package.json            # Project dependencies and scripts
├── supabase.config.js      # Supabase configuration
├── auth.css               # Authentication styles
├── home.css               # Main application styles
├── pages/                 # Application pages
│   ├── about.html         # About page
│   ├── dashboard.html     # Main dashboard
│   ├── weather.html       # Weather monitoring
│   ├── cropdata.html      # Crop data analytics
│   ├── system_control.html # Sprinkler control
│   ├── settings.html      # System settings
│   ├── alerts.html        # Alert management
│   ├── analytics.html     # Data analytics
│   ├── contact.html       # Contact page
│   ├── learn-more.html    # Information page
│   └── invoice.html       # Billing management
├── css/                   # Additional stylesheets
├── js/                    # JavaScript utilities
├── images/                # Application assets
├── India-map-cropdata/    # Geographic crop data
└── all-graph-data/        # Analytics datasets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhishekmauryafarmcs/FarmCS-react.git
   cd FarmCS-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Update `supabase.config.js` with your Supabase project credentials
   - Set up authentication tables in your Supabase project

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run preview` - Preview production build
- `npm test` - Run tests (placeholder)

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your Project URL and Anonymous Key
3. Update the configuration in `supabase.config.js`

### Environment Variables

For production deployment, use environment variables instead of hardcoding credentials:

```javascript
window.__SUPABASE_URL__ = process.env.SUPABASE_URL;
window.__SUPABASE_ANON_KEY__ = process.env.SUPABASE_ANON_KEY;
```

## 📊 Data Sources

- **Crop Production Data**: State-wise agricultural production statistics
- **Weather Data**: Real-time meteorological information
- **Geographic Data**: India states and districts mapping
- **Analytics**: Historical performance metrics

## 🌍 Multi-language Support

The application supports translation to:
- English (en)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Tamil (ta)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)

## 🔐 Security Features

- Supabase-based authentication
- Secure API key management
- Environment variable support for production
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Progressive enhancement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.

## 📞 Contact

- **Project Maintainer**: Abhishek Maurya
- **GitHub**: [@abhishekmauryafarmcs](https://github.com/abhishekmauryafarmcs)
- **Repository**: [FarmCS-react](https://github.com/abhishekmauryafarmcs/FarmCS-react)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Supabase for the backend services
- Google Fonts for typography
- Font Awesome for icons
- AOS for scroll animations
- Google Translate for multi-language support

---

**FarmCS** - Smart Irrigation for Sustainable Agriculture 🌱💧
