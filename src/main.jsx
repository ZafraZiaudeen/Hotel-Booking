import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from './pages/home.page';
import SignInPage from './pages/sign-in.page';
import SignUpPage from './pages/sign-up.page';
import HotelPage from './pages/hotel.page';
import HotelsPage from './pages/hotels.page';
import CreateHotelPage from './pages/create-hotel.page';
import AccountPage from './pages/account.page';
import AISearchResults from './components/AISearchResult';

import RootLayout from './layouts/root-layout.layout';
import MainLayout from './layouts/main.layout';
import {store} from './lib/store';
import {Provider} from 'react-redux'; 
import { ClerkProvider } from '@clerk/clerk-react';
import ProtectedLayout from './layouts/protected.layout';
import AdminProtectedLayout from './layouts/admin-protected.layout';
import AboutUs from './components/AboutUs';
import FavouritePage from './pages/favourite.page';
import PaymentPage from "./pages/payment.page";
import CompletePage from "./pages/complete.page";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY){
  throw new Error("Add your Clerk Publishable Key to .env file");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage/>}/>
            <Route path="/hotels/:id" element={<HotelPage />} />
            <Route path="/about" element={<AboutUs/>} />


            <Route element={<ProtectedLayout />}> 
            <Route path="/account" element={<AccountPage />}  />
            <Route path="/favorites" element={<FavouritePage/>} />
            <Route path="/booking/payment" element={<PaymentPage />} />
            <Route path="/booking/complete" element={<CompletePage />} />
            <Route element={<AdminProtectedLayout/>}>
            <Route path="/hotels/create" element={<CreateHotelPage />} />
            </Route>
           </Route>

          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
    </ClerkProvider>
  </StrictMode>
)
