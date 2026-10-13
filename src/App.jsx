import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home/Home'
import Sets from './pages/Sets/Sets'
import Catalog from './pages/Catalog/Catalog'
import MyBowl from './pages/MyBowl/MyBowl'
import Cart from './pages/Cart/Cart'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile/Profile'
import Checkout from './pages/Checkout/Checkout'
import Admin from './pages/Admin/Admin'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sets" element={<Sets />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/my-bowl" element={
            <ProtectedRoute>
              <MyBowl />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App