import { useApp } from './context/AppContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import ReviewModal from './components/ReviewModal.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ReportProblem from './pages/ReportProblem.jsx'
import FacilityConcerns from './pages/FacilityConcerns.jsx'
import RepairStatus from './pages/RepairStatus.jsx'
import StaffAssignments from './pages/StaffAssignments.jsx'
import Analytics from './pages/Analytics.jsx'
const pages = { dashboard: Dashboard, report: ReportProblem, concerns: FacilityConcerns, status: RepairStatus, staff: StaffAssignments, analytics: Analytics }
export default function App() {
  const { user, page } = useApp()
  if (!user) return <AuthPage />
  const Page = pages[page] || Dashboard
  return <AppLayout><Page /><ReviewModal /></AppLayout>
}
