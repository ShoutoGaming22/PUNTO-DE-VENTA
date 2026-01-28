import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    throw error
  }
)

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (tableId: number, userId: number) =>
    api.post('/orders', { table_id: tableId, user_id: userId }),
  addItem: (orderId: number, productId: number, quantity: number, unitPrice: number) =>
    api.post(`/orders/${orderId}/items`, { product_id: productId, quantity, unit_price: unitPrice }),
  close: (id: number) => api.post(`/orders/${id}/close`),
  sendToKitchen: (id: number) => api.post(`/orders/${id}/send-kitchen`),
}

// Tables API
export const tablesAPI = {
  getAll: () => api.get('/tables'),
  getById: (id: number) => api.get(`/tables/${id}`),
  create: (tableNumber: number, section: string, capacity: number) =>
    api.post('/tables', { table_number: tableNumber, section, capacity }),
  updateStatus: (id: number, status: string, orderId?: number) =>
    api.put(`/tables/${id}/status`, { status, current_order_id: orderId }),
}

// Products API
export const productsAPI = {
  getAll: (category?: string) =>
    api.get('/products', { params: { category } }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  addRecipe: (productId: number, ingredientId: number, quantity: number, unit: string) =>
    api.post(`/products/${productId}/recipe`, { ingredient_id: ingredientId, quantity, unit }),
}

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  create: (item: any) => api.post('/inventory', item),
  recordMovement: (
    inventoryId: number,
    type: string,
    quantity: number,
    referenceType?: string,
    referenceId?: number
  ) =>
    api.post(`/inventory/${inventoryId}/movement`, {
      type,
      quantity,
      reference_type: referenceType,
      reference_id: referenceId,
    }),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (user: any) => api.post('/users', user),
  verifyPin: (username: string, pin: string) =>
    api.post('/users/verify-pin', { username, pin }),
}

// Reports API
export const reportsAPI = {
  getSales: (startDate: string, endDate: string) =>
    api.get('/reports/sales', { params: { start_date: startDate, end_date: endDate } }),
  getTopProducts: (limit?: number) =>
    api.get('/reports/top-products', { params: { limit } }),
  getSalesByUser: (startDate: string, endDate: string) =>
    api.get('/reports/sales-by-user', { params: { start_date: startDate, end_date: endDate } }),
  getInventoryValuation: () => api.get('/reports/inventory-valuation'),
}

export default api
