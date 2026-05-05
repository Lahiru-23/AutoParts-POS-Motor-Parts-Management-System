
import CustomerModel        from '../model/customerModel.js';
import { customer_db }      from '../db/db.js';
import { syncOrderCustomers } from './orderController.js';

let selectedCustomerIndex = null;



function showFieldError(id, msg) {
  $(`#${id}`).addClass('is-invalid').removeClass('is-valid');
  $(`#${id}-err`).text(msg);
}

function clearFieldError(id) {
  $(`#${id}`).addClass('is-valid').removeClass('is-invalid');
  $(`#${id}-err`).text('');
}



function validateCustomer() {
  let valid = true;

  const name    = $('#cName').val().trim();
  const phone   = $('#cPhone').val().trim();
  const email   = $('#cEmail').val().trim();
  const nic     = $('#cNic').val().trim();
  const address = $('#cAddress').val().trim();

  if (!name || name.length < 2) {
    showFieldError('cName', 'Name must be at least 2 characters');
    valid = false;
  } else { clearFieldError('cName'); }

  if (!phone || !/^0\d{9}$/.test(phone)) {
    showFieldError('cPhone', 'Enter a valid Sri Lankan number (e.g. 0712345678)');
    valid = false;
  } else { clearFieldError('cPhone'); }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('cEmail', 'Enter a valid email address');
    valid = false;
  } else { clearFieldError('cEmail'); }

  if (!nic || nic.length < 10) {
    showFieldError('cNic', 'NIC must be at least 10 characters');
    valid = false;
  } else { clearFieldError('cNic'); }

  if (!address) {
    showFieldError('cAddress', 'Address is required');
    valid = false;
  } else { clearFieldError('cAddress'); }

  return valid;
}



export function loadCustomerTable(filter = '') {
  const tbody = $('#customerTableBody');
  tbody.empty();

  const data = filter
    ? customer_db.filter(c =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.email.toLowerCase().includes(filter.toLowerCase()))
    : customer_db;

  if (data.length === 0) {
    tbody.html(`<tr><td colspan="6">
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <p>No customers found</p>
            </div>
        </td></tr>`);
    return;
  }

  data.forEach(c => {
    const orig = customer_db.indexOf(c);
    tbody.append(`
            <tr data-index="${orig}">
                <td style="color:var(--text-muted)">${orig + 1}</td>
                <td style="font-weight:600">${c.name}</td>
                <td>${c.contactNumber}</td>
                <td>${c.email}</td>
                <td style="font-family:'Rajdhani',sans-serif">${c.nic}</td>
                <td>${c.address}</td>
            </tr>
        `);
  });
}

// ── Reset ────────────────────────────────────────────────────

function resetCustomerForm() {
  $('#customerForm')[0].reset();
  $('.form-control-pos').removeClass('is-valid is-invalid');
  selectedCustomerIndex = null;
  $('#cSaveBtn').html('<i class="bi bi-floppy"></i> Save');
  $('#customerFormTitle').text('Add Customer');
  $('#customerTableBody tr').removeClass('selected-row');
  loadCustomerTable();
  syncOrderCustomers();
}

// ── Events ───────────────────────────────────────────────────


$('#customerTableBody').on('click', 'tr', function () {
  const idx = parseInt($(this).data('index'));
  if (isNaN(idx)) return;

  selectedCustomerIndex = idx;
  const c = customer_db[idx];

  $('#cName').val(c.name);
  $('#cPhone').val(c.contactNumber);
  $('#cEmail').val(c.email);
  $('#cNic').val(c.nic);
  $('#cAddress').val(c.address);

  $('.form-control-pos').removeClass('is-valid is-invalid');
  $('#cSaveBtn').html('<i class="bi bi-pencil-square"></i> Update');
  $('#customerFormTitle').text('Edit Customer');

  $('#customerTableBody tr').removeClass('selected-row');
  $(this).addClass('selected-row');
});

// Real-time validation
$('#customerForm .form-control-pos').on('input', function () {
  if ($(this).val().trim()) {
    $(this).addClass('is-valid').removeClass('is-invalid');
    $(`#${this.id}-err`).text('');
  }
});


$(document).ready(function () {
  loadCustomerTable();
});
