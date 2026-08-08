import { OptionsPanel } from '../features/services/OptionsPanel'
import { ServiceCatalog } from '../features/services/ServiceCatalog'
import { PriceModeBar } from '../features/quote/PriceModeBar'
import { QuoteSummary } from '../features/quote/QuoteSummary'
import { StepNavigation } from '../components/StepNavigation'

interface SimulatorPageProps {
  onCustomer: () => void
  onSaved: () => void
  onPreview: (print?: boolean) => void
}

export const SimulatorPage = ({ onCustomer, onSaved, onPreview }: SimulatorPageProps) => {
  const onStep = (step: number) => {
    if (step === 1) onCustomer()
    if (step === 2) document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (step === 3) document.getElementById('options')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (step === 4) onPreview(false)
    if (step === 5) onPreview(true)
  }
  return (
    <main className="simulator-page">
      <StepNavigation onStep={onStep} />
      <div className="simulator-grid">
        <div className="simulator-workspace">
          <PriceModeBar />
          <ServiceCatalog />
          <OptionsPanel />
        </div>
        <QuoteSummary onEditCustomer={onCustomer} onSaved={onSaved} onPreview={onPreview} />
      </div>
    </main>
  )
}
