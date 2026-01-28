import { Router } from 'express'
import { ordersRouter } from './orders.js'
import { tablesRouter } from './tables.js'
import { productsRouter } from './products.js'
import { inventoryRouter } from './inventory.js'
import { usersRouter } from './users.js'
import { reportsRouter } from './reports.js'

export const apiRoutes = Router()

apiRoutes.use('/orders', ordersRouter)
apiRoutes.use('/tables', tablesRouter)
apiRoutes.use('/products', productsRouter)
apiRoutes.use('/inventory', inventoryRouter)
apiRoutes.use('/users', usersRouter)
apiRoutes.use('/reports', reportsRouter)
