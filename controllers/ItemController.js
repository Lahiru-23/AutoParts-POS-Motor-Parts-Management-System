

import ItemModel              from '../model/itemModel.js';
import { item_db }            from '../db/db.js';
import { syncAvailableItems } from './OrderController.js';

let selectedItemIndex   = null;
let currentItemImageUrl = '';



function showFieldError(id, msg) {
  $(`#${id}`).addClass('is-invalid').removeClass('is-valid');
  $(`#${id}-err`).text(msg);
}

function clearFieldError(id) {
  $(`#${id}`).addClass('is-valid').removeClass('is-invalid');
  $(`#${id}-err`).text('');
}

function getNextPartCode() {
  return 'P' + String(item_db.length + 1).padStart(3, '0');
}


function validateItem() {
  let valid = true;

  const desc  = $('#iDesc').val().trim();
  const price = parseFloat($('#iPrice').val());
  const qty   = parseInt($('#iQty').val());

  if (!desc) {
    showFieldError('iDesc', 'Part name / description is required');
    valid = false;
  } else { clearFieldError('iDesc'); }

  if (!price || price <= 0) {
    showFieldError('iPrice', 'Price must be greater than 0');
    valid = false;
  } else { clearFieldError('iPrice'); }

  if (isNaN(qty) || qty < 0) {
    showFieldError('iQty', 'Quantity cannot be negative');
    valid = false;
  } else { clearFieldError('iQty'); }

  return valid;
}



export function loadItemTable(filter = '') {
  const tbody = $('#itemTableBody');
  tbody.empty();

  const data = filter
    ? item_db.filter(i =>
      i.description.toLowerCase().includes(filter.toLowerCase()) ||
      (i.category || '').toLowerCase().includes(filter.toLowerCase()))
    : item_db;

  if (data.length === 0) {
    tbody.html(`<tr><td colspan="6">
            <div class="empty-state">
                <i class="bi bi-box-seam"></i>
                <p>No parts found. Add your first part.</p>
            </div>
        </td></tr>`);
    return;
  }

  data.forEach(item => {
    const orig     = item_db.indexOf(item);
    const qty      = parseInt(item.quantity);
    const stockClass = qty <= 0  ? 'badge-danger'
      : qty <= 5  ? 'badge-warning'
        : 'badge-success';

    tbody.append(`
            <tr data-index="${orig}">
                <td style="font-family:'Rajdhani',sans-serif;color:var(--primary);font-weight:700">
                    ${item.id || 'P' + String(orig + 1).padStart(3, '0')}
                </td>
                <td style="font-weight:600">${item.description}</td>
                <td><span class="badge-pos badge-orange">${item.category || 'Other'}</span></td>
                <td style="font-family:'Rajdhani',sans-serif;font-weight:700">
                    Rs. ${parseFloat(item.unitPrice).toFixed(2)}
                </td>
                <td><span class="badge-pos ${stockClass}">${item.quantity}</span></td>
                <td>
                    ${item.picture
      ? `<img src="${item.picture}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">`
      : '<i class="bi bi-image text-muted"></i>'}
                </td>
            </tr>
        `);
  });
}



function resetItemForm() {
  $('#itemForm')[0].reset();
  $('#iId').val('');
  $('.form-control-pos').removeClass('is-valid is-invalid');
  selectedItemIndex   = null;
  currentItemImageUrl = '';
  $('#iSaveBtn').html('<i class="bi bi-floppy"></i> Save');
  $('#partFormTitle').text('Add Part');
  $('#itemImgPreview').html('<i class="bi bi-image" style="color:var(--text-muted);font-size:1.5rem"></i>');
  $('#itemTableBody tr').removeClass('selected-row');
  loadItemTable();
  syncAvailableItems();
}
// ── Events ───────────────────────────────────────────────────


$('#itemTableBody').on('click', 'tr', function () {
  const idx = parseInt($(this).data('index'));
  if (isNaN(idx)) return;

  selectedItemIndex = idx;
  const item = item_db[idx];

  $('#iId').val(item.id || 'P' + String(idx + 1).padStart(3, '0'));
  $('#iDesc').val(item.description);
  $('#iPrice').val(item.unitPrice);
  $('#iQty').val(item.quantity);
  $('#iCategory').val(item.category || 'Other');

  currentItemImageUrl = item.picture || '';
  $('#itemImgPreview').html(
    item.picture
      ? `<img src="${item.picture}">`
      : '<i class="bi bi-image" style="color:var(--text-muted);font-size:1.5rem"></i>'
  );

  $('.form-control-pos').removeClass('is-valid is-invalid');
  $('#iSaveBtn').html('<i class="bi bi-pencil-square"></i> Update');
  $('#partFormTitle').text('Edit Part');

  $('#itemTableBody tr').removeClass('selected-row');
  $(this).addClass('selected-row');
});

// Image file change → preview
$('#iImage').on('change', function () {
  const file = this.files[0];
  if (file && file.type.match('image.*')) {
    currentItemImageUrl = URL.createObjectURL(file);
    $('#itemImgPreview').html(`<img src="${currentItemImageUrl}">`);
  }
});

// Real-time input validation
$('#iDesc').on('input', function () {
  if ($(this).val().trim()) clearFieldError('iDesc'); else showFieldError('iDesc', 'Required');
});
$('#iPrice').on('input', function () {
  const v = parseFloat($(this).val());
  if (v > 0) clearFieldError('iPrice'); else showFieldError('iPrice', 'Must be > 0');
});
$('#iQty').on('input', function () {
  const v = parseInt($(this).val());
  if (!isNaN(v) && v >= 0) clearFieldError('iQty'); else showFieldError('iQty', 'Cannot be negative');
});


$(document).ready(function () {
  loadItemTable();
});
