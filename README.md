# FixTrack — Campus Facility Concern Management

React + Vite + Tailwind CSS static site (mock data, no backend).

    npm install
    npm run dev      # local dev server
    npm run build    # static output in /dist (deploy anywhere)

Demo login: any email starting with `admin` → Admin workspace; any other → Student/Faculty.

    src/
      main.jsx, App.jsx, index.css
      context/AppContext.jsx      auth, page navigation, concerns state
      data/mock.js                static sample data
      components/
        layout/ (AppLayout, Sidebar)
        ui/ (Badge, StatCard)
        ConcernTable.jsx, ReviewModal.jsx
      pages/
        AuthPage, Dashboard, ReportProblem, FacilityConcerns,
        RepairStatus, StaffAssignments, Analytics
# IS104
# IS104
