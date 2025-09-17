import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './Router/Router'

import FootballCursor from './Components/FootballCursor'
import { Toaster } from 'sonner'
import { QueryProvider } from './Provider/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryProvider>
     <Toaster position="bottom-right" />
      <FootballCursor/>
    <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
