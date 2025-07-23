import { createRoot } from 'react-dom/client'
import { ConfigContextProvider } from '@/context/ConfigContext'
import { AuthContextProvider } from '@/context/AuthContext'
import App from '@/App.jsx'

createRoot(document.getElementById('root')).render(
  <ConfigContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ConfigContextProvider>
)
