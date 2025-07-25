import { createRootRoute, Outlet, useLocation, redirect } from '@tanstack/react-router';
import Sidebar from '@/components/sidebar/sidebar';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from 'react-hot-toast';
import motifKanan from "@/assets/motif-kanan.svg";

const auth = {
  isAuthenticated: false,
};

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const publicPaths = ['/', '/auth/login'];
    const isPublicPath = publicPaths.includes(location.pathname.toLowerCase());

    if (!isPublicPath && !auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }


    if (isPublicPath && auth.isAuthenticated) {
        throw redirect({
            to: '/dashboard',
        });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const hideLayout = currentPath === '/' || currentPath === '/auth/login';
  const showMotif = !hideLayout;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {showMotif && (
        <div className="fixed right-0 top-0 h-full w-auto z-10 pointer-events-none">
          <img
            src={motifKanan}
            alt="Motif Kanan"
            className="h-full w-auto object-contain opacity-30"
          />
        </div>
      )}

      {hideLayout ? (
        <>
          <Outlet />
        </>
      ) : (
        <div className="flex min-h-screen relative z-20">
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