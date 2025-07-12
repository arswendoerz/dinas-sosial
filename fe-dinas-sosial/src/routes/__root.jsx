import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import Sidebar from '@/components/sidebar/sidebar';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const hideLayout = currentPath === '/' || currentPath === '/auth/login';

  return (
    <div className="min-h-screen bg-gray-100">
      {hideLayout ? (
        <>
          <Outlet />
        </>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </div>
      )}

      <TanStackRouterDevtools />
      
      {/* React Hot Toast Container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}