import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import Sidebar from '@/components/sidebar/sidebar';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const hideLayout = currentPath === '/' || currentPath === '/auth/login';

  return hideLayout ? (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ) : (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  );
}
