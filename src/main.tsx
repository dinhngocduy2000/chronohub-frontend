import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { RouteLoadingFallback } from './components/layouts/RouteLoadingFallback'
import { queryClient } from './queries'
import { routeTree } from './routeTree.gen'
import { store } from './stores'

const router = createRouter({
  routeTree,
  defaultPreload: false,
  scrollRestoration: true,
  defaultPendingComponent: RouteLoadingFallback,
  defaultPendingMs: 0,
  defaultPendingMinMs: 200,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>,
  )
}
