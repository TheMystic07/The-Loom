import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import LoomApp from './LoomApp' 
import HangarApp from './HangarApp'
import {ArweaveWalletKit} from 'arweave-wallet-kit'
import Home from './pages/Home'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import { AuthProvider } from './store/auth.jsx'
import Vid from './components/Vid.jsx'
import NavMap from './components/NavMap.jsx'


import './index.css'
import TestingAoTemp from './pages/TestingAoTemp'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,//Change back to Home After Testing
  },
  {
    path: "/loom",
    element: <LoomApp />,
  },
  {
    path: "/hangar",
    element: <HangarApp />,
  },
  {
    path: "/custom",
    element: <App />,
  },
  {
    path: "/videChat",
    element: <Vid />,
  },
  {
    path: "/map",
    element: <NavMap />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <React.StrictMode>
    
   <ArweaveWalletKit
   config={{
      permissions: ["ACCESS_ADDRESS" , "ACCESS_ALL_ADDRESSES", "DISPATCH" , "SIGN_TRANSACTION" ],
      ensurePermissions: true,
      
       }}
   
   >
      <RouterProvider  router={router}/>
    </ArweaveWalletKit>
  </React.StrictMode></AuthProvider>,
)
