import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AccessibilityEnhancements } from './components/AccessibilityEnhancements'
import { PricingStateSynchronizer } from './components/PricingStateSynchronizer'
import { QuoteProvider } from './context/QuoteContext'
import './styles.css'
import './styles.override.css'
import './styles.accessibility.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuoteProvider><AccessibilityEnhancements /><PricingStateSynchronizer /><App /></QuoteProvider>
  </StrictMode>,
)
