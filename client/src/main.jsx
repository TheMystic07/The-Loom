import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {ArweaveWalletKit} from 'arweave-wallet-kit'
import Home from './pages/Home'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

import './index.css'
import TestingAoTemp from './pages/TestingAoTemp'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,//Change back to Home After Testing
  },
  {
    path: "/loom",
    element: <App />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
   <ArweaveWalletKit
   config={{
      permissions: ["ACCESS_ADDRESS" , "ACCESS_ALL_ADDRESSES", "DISPATCH" , "SIGN_TRANSACTION" ],
      ensurePermissions: true,
      
       }}
   
   >
      <RouterProvider  router={router}/>
    </ArweaveWalletKit>
  </React.StrictMode>,
)
