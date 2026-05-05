
import { customer_db, item_db, order_db } from './db/db.js';
import CustomerModel                        from './model/CustomerModel.js';
import ItemModel                            from './model/ItemModel.js';


import { loadCustomerTable }  from './Controllers/CustomerController.js';
import { loadItemTable }      from './Controllers/ItemController.js';
import {
  syncOrderCustomers,
  syncAvailableItems,
  renderOrderHistory
}                             from './Controllers/orderController.js';
import { refreshDashboard }   from './Controllers/DashboardController.js';
import {
  renderInvoiceList,
  showInvoice
}                             from './Controllers/InvoiceController.js';

