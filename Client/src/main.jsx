import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from '@/context/AuthContext'
import App from '@/App.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
