import { createSlice } from '@reduxjs/toolkit'

// Загружаем корзину из localStorage
const loadCart = () => {
  try {
    const saved = localStorage.getItem('cart')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.log('Ошибка загрузки корзины')
  }
  return { items: [], totalCount: 0, totalPrice: 0 }
}

const initialState = loadCart()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload
      const existing = state.items.find(item => 
        item.name === newItem.name && 
        item.ingredients === newItem.ingredients
      )
      
      if (existing) {
        existing.quantity += newItem.quantity || 1
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 })
      }
      
      state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(state))
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      localStorage.setItem('cart', JSON.stringify(state))
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
        state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        
        localStorage.setItem('cart', JSON.stringify(state))
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalCount = 0
      state.totalPrice = 0
      
      localStorage.setItem('cart', JSON.stringify(state))
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer