import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/bid-resos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/bid-resos"!</div>
}
