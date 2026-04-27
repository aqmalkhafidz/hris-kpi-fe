import {
  createRouter,
  createRootRouteWithContext,
  createRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { AuthState } from '../auth/auth-context'

// ─── Route components (lazy imports to keep bundle manageable) ───
import { LoginPage }         from '../routes/login'
import { ForgotPasswordPage } from '../routes/forgot-password'
import { DashboardPage }     from '@features/dashboard/pages/dashboard'
import { SelfAppraisalPage } from '@features/appraisal/pages/self-appraisal'
import { MyAccountPage }     from '@features/account/pages/my-account'
import { SlReviewPage }      from '@features/review/pages/review-sl'
import { HodReviewPage }     from '@features/review/pages/review-hod'
import { HodivReviewPage }   from '@features/review/pages/review-hodiv'
import { AcknowledgePage }   from '@features/appraisal/pages/acknowledge'
import { HrDashboardPage }   from '@features/dashboard/pages/hr-dashboard'
import { HrOrganizationPage } from '@features/org/pages/hr-organization'
import { HrKraTemplatesPage } from '@features/kra/pages/hr-kra-templates'
import { HrCyclesPage }      from '@features/cycles/pages/hr-cycles'
import { HrCycleDetailPage } from '@features/cycles/pages/hr-cycle-detail'
import { HrReportsPage }     from '@features/reports/pages/hr-reports'
import { HrLayout }          from '@shared/layouts/hr-layout'
import { EmployeeLayout }    from '@shared/layouts/employee-layout'

// ─── Router context ───
export interface RouterContext {
  auth: AuthState
}

// ─── Root ───
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
})

// ─── Public routes ───
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
})

// ─── Auth guard layout ───
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_auth',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  component: Outlet,
})

// ─── Employee layout (sidebar wrapper) ───
const employeeLayoutRoute = createRoute({
  getParentRoute: () => authRoute,
  id: '_employee',
  component: EmployeeLayout,
})

// ─── Employee routes ───
const dashboardRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role === 'hr') throw redirect({ to: '/hr/dashboard' })
  },
})

const selfAppraisalRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/self-appraisal',
  component: SelfAppraisalPage,
})

const myAccountRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/my-account',
  component: MyAccountPage,
})

// ─── Review routes ───
const slReviewRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/review/sl/$appraisalId',
  component: SlReviewPage,
  beforeLoad: ({ context }) => {
    const role = context.auth.user?.role
    if (role !== 'sl' && role !== 'hr') throw redirect({ to: '/dashboard' })
  },
})

const hodReviewRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/review/hod/$appraisalId',
  component: HodReviewPage,
  beforeLoad: ({ context }) => {
    const role = context.auth.user?.role
    if (role !== 'hodept' && role !== 'hr') throw redirect({ to: '/dashboard' })
  },
})

const hodivReviewRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/review/hodiv/$appraisalId',
  component: HodivReviewPage,
  beforeLoad: ({ context }) => {
    const role = context.auth.user?.role
    if (role !== 'hodiv' && role !== 'hr') throw redirect({ to: '/dashboard' })
  },
})

const acknowledgeRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/acknowledge/$appraisalId',
  component: AcknowledgePage,
})

// ─── HR layout + routes ───
const hrLayoutRoute = createRoute({
  getParentRoute: () => authRoute,
  id: '_hr',
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== 'hr') throw redirect({ to: '/dashboard' })
  },
  component: HrLayout,
})

const hrDashboardRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/dashboard',
  component: HrDashboardPage,
})

const hrOrganizationRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/organization',
  component: HrOrganizationPage,
})

const hrKraTemplatesRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/kra-templates',
  component: HrKraTemplatesPage,
})

const hrCyclesRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/cycles',
  component: HrCyclesPage,
})

const hrCycleDetailRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/cycles/$cycleId',
  component: HrCycleDetailPage,
})

const hrReportsRoute = createRoute({
  getParentRoute: () => hrLayoutRoute,
  path: '/hr/reports',
  component: HrReportsPage,
})

// ─── Index redirect ───
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.user.role === 'hr') throw redirect({ to: '/hr/dashboard' })
    throw redirect({ to: '/dashboard' })
  },
  component: () => null,
})

// ─── Route tree ───
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  forgotPasswordRoute,
  authRoute.addChildren([
    employeeLayoutRoute.addChildren([
      dashboardRoute,
      selfAppraisalRoute,
      myAccountRoute,
      slReviewRoute,
      hodReviewRoute,
      hodivReviewRoute,
      acknowledgeRoute,
    ]),
    hrLayoutRoute.addChildren([
      hrDashboardRoute,
      hrOrganizationRoute,
      hrKraTemplatesRoute,
      hrCyclesRoute,
      hrCycleDetailRoute,
      hrReportsRoute,
    ]),
  ]),
])

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
