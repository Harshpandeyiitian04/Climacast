# Climacast - Weather Analytics Dashboard

A modern, feature-rich weather analytics dashboard built with React, Redux, and Vite that provides detailed weather information and forecasts with interactive visualizations.

🌐 **Live Demo**: [https://climacast-vtnt.vercel.app/](https://climacast-vtnt.vercel.app/)

## Features

- 🌡️ Real-time weather data display
- 📊 Interactive weather charts and visualizations
  - Temperature trends
  - Humidity and pressure analysis
  - Precipitation forecasts
  - Wind conditions
- 🔍 City search functionality
- ⭐ Favorite locations management
- 📱 Responsive design
- 📈 Detailed weather metrics:
  - Hourly forecasts
  - Daily forecasts
  - Humidity and pressure data
  - Wind speed and direction
- ⚡ Efficient data caching
- ⚙️ Customizable settings panel

## Technology Stack

- **Frontend Framework**: React
- **State Management**: Redux with Redux Toolkit
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: React charting libraries
- **API Integration**: Custom weather API service

## Project Structure

```
├── config/             # Configuration files
├── public/            # Public assets
├── redux/             # Redux store and slices
├── services/          # API services
├── src/
│   ├── components/    # React components
│   │   ├── charts/    # Chart components
│   │   ├── common/    # Shared components
│   │   ├── dashboard/ # Dashboard components
│   │   ├── layout/    # Layout components
│   │   └── settings/  # Settings components
│   └── pages/         # Page components
└── utils/             # Utility functions
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Harshpandeyiitian04/Climacast.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your API keys and configuration.

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Harsh Pandey
