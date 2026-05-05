
import { customer_db, item_db, order_db } from '../db/db.js';
import OrderModel                          from '../model/OrderModel.js';
import OrderDetailsModel                   from '../model/OrderDetailsModel.js';


let cart = [];


export function syncOrderCustomers() {
  const sel = $('#orderCustomer');
  const cur = sel.val();
  sel.empty().append('<option value="">-- Choose Customer --</option>');
  customer_db.forEach(c => sel.append(`<option value="${c.name}">${c.name}</option>`));
  if (cur) sel.val(cur);
}


export function syncAvailableItems() {
  renderPartsGrid($('#orderPartSearch').val() || '');
}

// ── Order ID Generator

function generateNextOrderId() {
  const nextId = 'ORD-' + String(order_db.length + 1).padStart(4, '0');
  $('#orderIdDisplay').val(nextId);
}

