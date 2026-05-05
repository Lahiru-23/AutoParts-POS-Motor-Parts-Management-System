
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

// ── Parts Grid

function renderPartsGrid(filter = '') {
  const grid = $('#partsGrid');
  grid.empty();

  const available = item_db.filter(i =>
    parseInt(i.quantity) > 0 &&
    (!filter || i.description.toLowerCase().includes(filter.toLowerCase()))
  );

  if (available.length === 0) {
    grid.html(`
            <div class="empty-state" style="grid-column:1/-1">
                <i class="bi bi-box-seam"></i>
                <p>No parts available${filter ? ' matching "' + filter + '"' : '. Add parts in inventory.'}</p>
            </div>
        `);
    return;
  }

  available.forEach(item => {
    const origIdx = item_db.indexOf(item);
    grid.append(`
            <div class="part-card" data-index="${origIdx}">
                ${item.picture
      ? `<img src="${item.picture}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;margin-bottom:0.5rem">`
      : `<div style="width:100%;height:60px;background:var(--dark-bg);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:0.5rem;font-size:1.5rem">⚙️</div>`}
                <div class="part-card-name">${item.description}</div>
                <div class="part-card-price">Rs. ${parseFloat(item.unitPrice).toFixed(2)}</div>
                <div class="part-card-stock"><i class="bi bi-box"></i> ${item.quantity} in stock</div>
                <button class="part-add-btn" data-index="${origIdx}">
                    <i class="bi bi-cart-plus me-1"></i>Add to Cart
                </button>
            </div>
        `);
  });
}



function renderCart() {
  const container = $('#cartItemsContainer');
  container.empty();

  if (cart.length === 0) {
    container.html('<div class="empty-state"><i class="bi bi-cart"></i><p>No items in cart</p></div>');
    $('#cartCount').text('0 items');
    $('#cartSubtotal, #cartTotal').text('Rs. 0.00');
    $('#placeOrderBtn').prop('disabled', true);
    $('#cartCountBadge').hide();
    return;
  }

  let subtotal = 0;

  cart.forEach((item, i) => {
    const lineTotal = item.unitPrice * item.quantity;
    subtotal += lineTotal;

    container.append(`
            <div class="cart-item">
                <div class="cart-item-name">${item.description}</div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn cart-dec" data-i="${i}"><i class="bi bi-dash"></i></button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn cart-inc" data-i="${i}"><i class="bi bi-plus"></i></button>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="cart-item-price">Rs. ${lineTotal.toFixed(2)}</span>
                        <button class="cart-remove cart-del" data-i="${i}">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
  });

  $('#cartCount').text(cart.length + ' item(s)');
  $('#cartSubtotal').text('Rs. ' + subtotal.toFixed(2));
  $('#cartTotal').text('Rs. ' + subtotal.toFixed(2));
  $('#placeOrderBtn').prop('disabled', false);
  $('#cartCountBadge').text(cart.length).show();
}

// Add to cart
$(document).on('click', '.part-add-btn', function (e) {
  e.stopPropagation();
  const idx  = parseInt($(this).data('index'));
  const item = item_db[idx];

  const existing = cart.find(c => c.itemIndex === idx);

  if (existing) {
    if (existing.quantity >= parseInt(item.quantity)) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Reached!',
        html: `Only <strong>${item.quantity}</strong> unit(s) of <em>${item.description}</em> available.`,
        background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00'
      });
      return;
    }
    existing.quantity++;
  } else {
    cart.push({
      itemIndex:   idx,
      description: item.description,
      unitPrice:   parseFloat(item.unitPrice),
      quantity:    1,
      maxQty:      parseInt(item.quantity)
    });
  }

  renderCart();
});

// Increase qty
$(document).on('click', '.cart-inc', function () {
  const i = parseInt($(this).data('i'));
  if (cart[i].quantity >= cart[i].maxQty) {
    Swal.fire({
      icon: 'warning', title: 'Stock Limit!',
      html: `Only <strong>${cart[i].maxQty}</strong> available.`,
      background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00',
      timer: 1500, showConfirmButton: false
    });
    return;
  }
  cart[i].quantity++;
  renderCart();
});

// Decrease qty
$(document).on('click', '.cart-dec', function () {
  const i = parseInt($(this).data('i'));
  if (cart[i].quantity <= 1) {
    cart.splice(i, 1);
  } else {
    cart[i].quantity--;
  }
  renderCart();
});

// Remove item
$(document).on('click', '.cart-del', function () {
  const i = parseInt($(this).data('i'));
  cart.splice(i, 1);
  renderCart();
});

// Part search
$('#orderPartSearch').on('input', function () {
  renderPartsGrid($(this).val());
});

// ── Place Order ──────────────────────────────────────────────

$('#placeOrderBtn').on('click', function () {
  const customerName = $('#orderCustomer').val();

  if (!customerName) {
    Swal.fire({ icon: 'error', title: 'No Customer Selected!', text: 'Please select a customer before placing the order.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00' });
    return;
  }

  if (cart.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Cart is Empty!', text: 'Add at least one part to the cart.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00' });
    return;
  }

  const orderId = $('#orderIdDisplay').val();
  const total   = cart.reduce((s, c) => s + (c.unitPrice * c.quantity), 0);

  // Build order details
  const orderedItems = cart.map(c =>
    new OrderDetailsModel(c.description, c.quantity, c.unitPrice, c.itemIndex)
  );

  Swal.fire({
    icon: 'question',
    title: 'Confirm Order?',
    html: `
            <div style="text-align:left;font-size:0.9rem">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Parts:</strong> ${cart.length} item(s)</p>
                <p><strong>Total:</strong>
                    <span style="color:#FF6B00;font-size:1.1rem;font-weight:700">
                        Rs. ${total.toFixed(2)}
                    </span>
                </p>
            </div>`,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-bag-check"></i> Place Order',
    confirmButtonColor: '#FF6B00',
    cancelButtonColor: '#3b82f6',
    background: '#151820', color: '#e8eaf0'
  }).then(result => {
    if (!result.isConfirmed) return;

    // Deduct stock from item_db
    orderedItems.forEach(detail => {
      if (detail.itemIndex !== undefined && item_db[detail.itemIndex]) {
        item_db[detail.itemIndex].quantity =
          Math.max(0, parseInt(item_db[detail.itemIndex].quantity) - detail.quantity);
      }
    });

// Save order
    const order = new OrderModel(orderId, customerName, orderedItems, total);
    order_db.push(order);

    // Reset UI
    cart = [];
    renderCart();
    generateNextOrderId();
    $('#orderCustomer').val('');
    renderPartsGrid();

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      html: `
                <p><strong>${orderId}</strong> has been placed successfully.</p>
                <p style="color:#FF6B00;font-size:1.2rem;font-weight:700">Total: Rs. ${total.toFixed(2)}</p>
                <p style="color:#7a8099;font-size:0.82rem">Stock has been updated automatically.</p>`,
      background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00'
    });
  });
});

// ── Order History ────────────────────────────────────────────

export function renderOrderHistory() {
  const tbody = $('#orderHistoryBody');
  tbody.empty();

  if (order_db.length === 0) {
    tbody.html(`<tr><td colspan="6">
            <div class="empty-state">
                <i class="bi bi-receipt"></i>
                <p>No orders placed yet</p>
            </div>
        </td></tr>`);
    return;
  }

  [...order_db].reverse().forEach(o => {
    const itemSummary = o.items.slice(0, 2).map(i => `${i.description} ×${i.quantity}`).join(', ')
      + (o.items.length > 2 ? ` +${o.items.length - 2} more` : '');

    tbody.append(`
            <tr>
                <td><span class="order-id-badge">${o.id}</span></td>
                <td style="font-weight:600">${o.customerName}</td>
                <td style="font-size:0.8rem;color:var(--text-muted)">${itemSummary}</td>
                <td style="color:var(--primary);font-weight:700;font-family:'Rajdhani',sans-serif">
                    Rs. ${o.total.toFixed(2)}
                </td>
                <td style="color:var(--text-muted);font-size:0.78rem">${o.date}</td>
                <td>
                    <button class="btn-pos btn-pos-sm btn-pos-secondary view-invoice-btn" data-id="${o.id}">
                        <i class="bi bi-receipt"></i> Invoice
                    </button>
                </td>
            </tr>
        `);
  });
}





