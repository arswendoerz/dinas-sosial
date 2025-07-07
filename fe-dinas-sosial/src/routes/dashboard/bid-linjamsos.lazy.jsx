import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/bid-linjamsos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/bid-linjamsos"!</div>
}
