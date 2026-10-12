import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// FontAwesome - tree-shaking enabled imports
import { library } from '@fortawesome/fontawesome-svg-core'
// Import only the icons you actually use
import {
  faPerson,
  faPersonBiking,
  faHandFist,
  faCircleCheck,
  faCalendarWeek,
  faListCheck,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faClock,
  faHourglassStart,
  faFire,
  faMugHot,
  faRotateRight,
  faPlay,
  faPause,
  faVideoSlash,
  faCrosshairs,
  faDumbbell,
  faShoePrints,
  faShieldHalved,
  faWind,
  faSpa,
  faPersonRunning,
  faFistRaised,
  faEye,
  faTrophy,
  faCircleInfo,
  faRotate,
  faToolbox,
  faLightbulb,
  faPenToSquare,
  faCirclePlay,
  faBan,
  faBan as faBanIcon,
  faUser,
  faHeartPulse,
  faBolt,
  faBullseye,
  faMedal,
} from '@fortawesome/free-solid-svg-icons'

// Brand icons (YouTube, etc.)
import {
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(
  faPerson,
  faPersonBiking,
  faHandFist,
  faCircleCheck,
  faCalendarWeek,
  faListCheck,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faClock,
  faHourglassStart,
  faFire,
  faMugHot,
  faRotateRight,
  faPlay,
  faPause,
  faVideoSlash,
  faCrosshairs,
  faDumbbell,
  faShoePrints,
  faShieldHalved,
  faWind,
  faSpa,
  faPersonRunning,
  faFistRaised,
  faEye,
  faTrophy,
  faCircleInfo,
  faRotate,
  faToolbox,
  faLightbulb,
  faPenToSquare,
  faCirclePlay,
  faBan,
  faYoutube,
  faUser,
  faHeartPulse,
  faBolt,
  faBullseye,
  faMedal,
)

// Make FontAwesomeIcon globally available (optional, for convenience)
// Or import it directly in components: import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)