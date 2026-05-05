
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


function seedSampleData() {
  // Customers
  customer_db.push(
    new CustomerModel('Kamal Perera',   '0712345678', 'kamal@email.com',  '198512345678', 'No.12, Galle Road, Colombo 03'),
    new CustomerModel('Nimal Silva',    '0751234567', 'nimal@email.com',  '199023456789', '45, Kandy Road, Kandy'),
    new CustomerModel('Sunil Fernando', '0779876543', 'sunil@email.com',  '198734567890', '78, High Level Road, Nugegoda')
  );

  // Parts
  item_db.push(
    new ItemModel('P001', 'Toyota Corolla Brake Pad Set',      3500,  15, 'Brake',        ''),
    new ItemModel('P002', 'Honda Civic Air Filter',             850,  20, 'Filter',       ''),
    new ItemModel('P003', 'Mitsubishi Engine Oil 10W40 (4L)',  2800,   8, 'Engine',       ''),
    new ItemModel('P004', 'Universal Wiper Blade 16"',          650,  30, 'Other',        ''),
    new ItemModel('P005', '12V Car Battery 60Ah',             18500,   4, 'Electrical',   ''),
    new ItemModel('P006', 'Shock Absorber Front — Nissan',    7200,   6, 'Suspension',   ''),
    new ItemModel('P007', 'Spark Plug Set NGK (4pcs)',         1200,  25, 'Engine',       ''),
    new ItemModel('P008', 'Timing Belt — Toyota',              3200,   3, 'Engine',       ''),
    new ItemModel('P009', 'Radiator Coolant 1L',                450,  50, 'Engine',       ''),
    new ItemModel('P010', 'Head Light Bulb H4 12V 60/55W',      380,  40, 'Electrical',   '')
  );
}

