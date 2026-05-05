
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



