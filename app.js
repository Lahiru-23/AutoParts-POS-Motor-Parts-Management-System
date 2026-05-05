
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


//  NAVIGATION

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  customers:    'Customer Management',
  parts:        'Parts Inventory',
  orders:       'New Order',
  orderhistory: 'Order History',
  invoices:     'Invoices'
};

function navigateTo(sectionId) {
  // Switch visible section
  $('.page-section').removeClass('active');
  $(`#section-${sectionId}`).addClass('active');

  // Highlight active sidebar link
  $('.sidebar-link').removeClass('active');
  $(`.sidebar-link[data-section="${sectionId}"]`).addClass('active');

  // Update top-bar title
  $('#pageTitle').text(PAGE_TITLES[sectionId] || '');

  // Per-section refresh hooks
  switch (sectionId) {
    case 'dashboard':
      refreshDashboard();
      break;
    case 'customers':
      loadCustomerTable();
      break;
    case 'parts':
      loadItemTable();
      break;
    case 'orders':
      syncOrderCustomers();
      syncAvailableItems();
      generateNextOrderId();
      break;
    case 'orderhistory':
      renderOrderHistory();
      break;
    case 'invoices':
      renderInvoiceList();
      break;
  }
}


window.posNavigateTo = navigateTo;


$(document).on('click', '.sidebar-link', function () {
  navigateTo($(this).data('section'));
});

// ── Order ID helper
function generateNextOrderId() {
  const nextId = 'ORD-' + String(order_db.length + 1).padStart(4, '0');
  $('#orderIdDisplay').val(nextId);
}


//  LOGIN

const CREDENTIALS = { username: 'admin', password: 'admin123' };

$('#passToggle').on('click', function () {
  const inp = $('#loginPassword');
  const show = inp.attr('type') === 'password';
  inp.attr('type', show ? 'text' : 'password');
  $(this).find('i').toggleClass('bi-eye bi-eye-slash');
});

function attemptLogin() {
  const u = $('#loginUsername').val().trim();
  const p = $('#loginPassword').val().trim();

  if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
    $('#login-page').fadeOut(300, function () {
      $('#main-app').fadeIn(300);
      navigateTo('dashboard');
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid username or password. Try admin / admin123.',
      background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00'
    });
  }
}

$('#loginBtn').on('click', attemptLogin);
$('#loginPassword').on('keyup', function (e) {
  if (e.key === 'Enter') attemptLogin();
});

