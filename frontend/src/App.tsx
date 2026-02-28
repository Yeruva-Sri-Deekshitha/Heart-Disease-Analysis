import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataStory from './pages/DataStory';
import DataExplorer from './pages/DataExplorer';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story',
  component: DataStory,
});

const explorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explorer',
  component: DataExplorer,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  storyRoute,
  explorerRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
