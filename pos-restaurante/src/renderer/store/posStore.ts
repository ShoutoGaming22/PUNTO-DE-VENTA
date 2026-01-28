import { create } from 'zustand'

export interface User {
  id: number
  username: string
  name: string
  role: 'admin' | 'cashier' | 'waiter' | 'kitchen'
}

export interface Table {
  id: number
  table_number: number
  section: string
  capacity: number
  status: 'free' | 'occupied' | 'reserved'
  current_order_id?: number
}

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  table_id: number
  user_id: number
  status: 'open' | 'closed' | 'pending_payment'
  subtotal: number
  tax: number
  total: number
  items: OrderItem[]
  created_at: string
}

interface POSStore {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  // Table state
  tables: Table[]
  setTables: (tables: Table[]) => void
  selectedTable: Table | null
  selectTable: (table: Table | null) => void
  
  // Order state
  currentOrder: Order | null
  setCurrentOrder: (order: Order | null) => void
  
  // UI state
  isOnline: boolean
  setIsOnline: (online: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const usePOSStore = create<POSStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  tables: [],
  setTables: (tables) => set({ tables }),
  selectedTable: null,
  selectTable: (table) => set({ selectedTable: table }),
  
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
  
  isOnline: true,
  setIsOnline: (online) => set({ isOnline: online }),
  
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}))
