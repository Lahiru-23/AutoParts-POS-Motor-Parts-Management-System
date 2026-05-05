
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


// Update and save
$('#cSaveBtn').on('click', function () {
  if (!validateCustomer()) return;

  const obj = new CustomerModel(
    $('#cName').val().trim(),
    $('#cPhone').val().trim(),
    $('#cEmail').val().trim(),
    $('#cNic').val().trim(),
    $('#cAddress').val().trim()
  );

  if (selectedCustomerIndex !== null) {
    customer_db[selectedCustomerIndex] = obj;
    Swal.fire({ icon: 'success', title: 'Updated!', text: 'Customer record updated.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00', timer: 1500, showConfirmButton: false });
  } else {
    customer_db.push(obj);
    Swal.fire({ icon: 'success', title: 'Added!', text: 'New customer registered.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00', timer: 1500, showConfirmButton: false });
  }

  resetCustomerForm();
});

// Delete
$('#cDeleteBtn').on('click', function () {
  if (selectedCustomerIndex === null) {
    Swal.fire({ icon: 'warning', title: 'No selection', text: 'Click a row to select a customer first.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00' });
    return;
  }

  Swal.fire({
    title: 'Delete Customer?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Yes, Delete',
    background: '#151820', color: '#e8eaf0'
  }).then(result => {
    if (result.isConfirmed) {
      customer_db.splice(selectedCustomerIndex, 1);
      resetCustomerForm();
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Customer removed.', background: '#151820', color: '#e8eaf0', confirmButtonColor: '#FF6B00', timer: 1200, showConfirmButton: false });
    }
  });
});

// Reset button
$('#cResetBtn').on('click', resetCustomerForm);

// Live search
$('#customerSearch').on('input', function () {
  loadCustomerTable($(this).val());
});



$(document).ready(function () {
  loadCustomerTable();
});
