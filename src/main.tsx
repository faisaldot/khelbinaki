import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './Router/Router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import FootballCursor from './Components/FootballCursor'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <FootballCursor/>
      <QueryClientProvider client={queryClient} >
    <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
