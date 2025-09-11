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
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
     <Toaster position="bottom-right" />
      <FootballCursor/>
      <QueryClientProvider client={queryClient} >
    <RouterProvider router={router} />
    </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
