import HeadingState from '@/components/global-ui/heading-state'
import { ReservationsSection } from '../sections/reservations-section'

export default function ReservationsView() {
  return (
    <div className="space-y-4">
      <HeadingState 
      title='Reservations'
      subtitle='List of your reservations'
      />   

      <ReservationsSection />
    </div>
  )
}
