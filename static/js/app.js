/**
 * Scan2SQL — Complete Frontend Controller (Phases 1–5)
 */

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

let currentDocumentId = null;
let currentFilename = "extracted_document";
let currentPages = [];
let currentPageIndex = 0;
let currentBillItems = [];
let pendingDeleteAction = null;

async function checkDatabaseAndDashboardStats() {
  const summaryEl = document.getElementById("dbConnectionSummary");
  const statusEl = document.getElementById("dbStatusLabel");
  const statUploaded = document.getElementById("statTotalUploaded");
  const statProcessed = document.getElementById("statTotalProcessed");
  const statBills = document.getElementById("statTotalBills");
  const statSpending = document.getElementById("statTotalSpending");

  try {
    const [healthRes, statsRes] = await Promise.all([
      fetch("/api/health"),
      fetch("/api/dashboard/stats"),
    ]);
    const health = await healthRes.json();
    const stats = await statsRes.json();

    if (health.database_connected) {
      statusEl.textContent = "PostgreSQL Connected (" + (health.database_name || "scan2sql_db") + ")";
      statusEl.className = "fw-semibold text-success small font-monospace";
      summaryEl.innerHTML =
        `FastAPI + OpenCV + Tesseract (eng+hin) + Hybrid Bill Parser + OpenPyXL active.`;
    } else {
      statusEl.textContent = "PostgreSQL Connection Pending";
      statusEl.className = "fw-semibold text-danger small font-monospace";
      summaryEl.innerHTML = `Check PostgreSQL service and <code>.env</code> configuration.`;
    }

    if (statsRes.ok) {
      statUploaded.textContent = String(stats.total_uploaded_documents ?? 0);
      statProcessed.textContent = String(stats.total_processed_documents ?? 0);
      statBills.textContent = String(stats.total_bills ?? 0);
      statSpending.textContent = `Rs. ${Number(stats.total_spending || 0).toFixed(2)}`;
    }
  } catch (err) {
    statusEl.textContent = "API Reachability Error";
    statusEl.className = "fw-semibold text-danger small font-monospace";
  }
}

function validateSelectedFile(file) {
  const errorAlert = document.getElementById("uploadErrorAlert");
  errorAlert.classList.add("d-none");

  if (!file) return "Please choose a file to upload.";
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Unsupported file extension '.${ext}'. Allowed formats: JPG, JPEG, PNG, PDF.`;
  }
  if (file.size <= 0) return "The selected file is empty (0 bytes).";
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return `File size (${sizeMb} MB) exceeds the maximum allowed 25 MB limit.`;
  }
  return null;
}

function renderCurrentPagePreview() {
  if (!currentPages.length) return;

  const pageData = currentPages[currentPageIndex];
  const imgOrig = document.getElementById("imgOriginalPreview");
  const imgProc = document.getElementById("imgProcessedPreview");
  const emptyOrig = document.getElementById("emptyOriginalState");
  const emptyProc = document.getElementById("emptyProcessedState");
  const origDim = document.getElementById("origDimensionsLabel");
  const procDim = document.getElementById("procDimensionsLabel");
  const metricsSummary = document.getElementById("cvMetricsSummary");
  const stepsList = document.getElementById("cvStepsList");
  const pdfControls = document.getElementById("pdfPageControls");
  const pageIndicator = document.getElementById("pageIndicator");

  const cacheBust = "?t=" + Date.now();
  imgOrig.src = pageData.original_preview_url + cacheBust;
  imgProc.src = pageData.processed_preview_url + cacheBust;

  imgOrig.classList.remove("d-none");
  imgProc.classList.remove("d-none");
  emptyOrig.classList.add("d-none");
  emptyProc.classList.add("d-none");

  const m = pageData.cv_metrics || {};
  if (m.original_dimensions) {
    origDim.textContent = `${m.original_dimensions.width} × ${m.original_dimensions.height} px`;
  }
  if (m.processed_dimensions) {
    procDim.textContent = `${m.processed_dimensions.width} × ${m.processed_dimensions.height} px`;
  }

  metricsSummary.textContent = `Skew: ${m.skew_angle_deg ?? 0}° · Perspective Warp: ${
    m.perspective_warped ? "Yes" : "No"
  } · Time: ${m.processing_time_ms ?? 0} ms`;

  stepsList.textContent = (m.steps_applied || []).join(" → ") || "Standard OpenCV pipeline";

  if (currentPages.length > 1) {
    pdfControls.classList.remove("d-none");
    pdfControls.classList.add("d-flex");
    pageIndicator.textContent = `Page ${currentPageIndex + 1} / ${currentPages.length}`;
  } else {
    pdfControls.classList.add("d-none");
    pdfControls.classList.remove("d-flex");
  }
}

function renderOCRAndClassification(ocrResult, docRecord) {
  if (!ocrResult) return;

  const editor = document.getElementById("extractedTextEditor");
  const detectedHeading = document.getElementById("detectedTypeHeading");
  const confidenceLabel = document.getElementById("detectedConfidenceLabel");
  const confirmedSelect = document.getElementById("confirmedDocTypeSelect");
  const signalsList = document.getElementById("classificationSignalsList");
  const statsFooter = document.getElementById("ocrStatsFooter");
  const methodLabel = document.getElementById("ocrExtractionMethodLabel");
  const warningAlert = document.getElementById("ocrWarningAlert");

  editor.value = ocrResult.extracted_text || "";

  const cls = ocrResult.classification || {};
  const isBill = cls.detected_type === "shop_bill";
  detectedHeading.textContent = isBill
    ? "Shop Bill / Receipt Detected"
    : "Normal Document Detected";
  detectedHeading.className = isBill ? "h5 fw-bold mb-1 text-success" : "h5 fw-bold mb-1 text-dark";

  const confPct = Math.round((cls.confidence || 0) * 100);
  confidenceLabel.textContent = `Confidence: ${confPct}% · Score: ${cls.score_points || 0} pts`;

  if (docRecord && docRecord.document_type) {
    confirmedSelect.value = docRecord.document_type;
  } else if (cls.detected_type) {
    confirmedSelect.value = cls.detected_type;
  }

  const signals = cls.matched_signals || [];
  signalsList.innerHTML = signals.length
    ? signals.map((s) => `<li>${s}</li>`).join("")
    : "<li>Standard text layout</li>";

  statsFooter.textContent = `Pages: ${ocrResult.page_count || 1} · Words: ${
    ocrResult.total_words || 0
  } · Characters: ${ocrResult.total_characters || 0}`;

  const methods = (ocrResult.pages_ocr || []).map((p) => p.extraction_method);
  const uniqueMethods = Array.from(new Set(methods));
  methodLabel.textContent = `Method: ${uniqueMethods.join(" + ") || "tesseract_ocr"}`;

  if (ocrResult.warnings && ocrResult.warnings.length > 0) {
    warningAlert.textContent = ocrResult.warnings.join(" | ");
    warningAlert.classList.remove("d-none");
  } else {
    warningAlert.classList.add("d-none");
  }
}

function renderBillItemsTable() {
  const tbody = document.getElementById("billItemsTableBody");
  if (!tbody) return;

  if (!currentBillItems.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3 small">No line items. Click "+ Add Item Row" to add items manually.</td></tr>`;
    return;
  }

  tbody.innerHTML = currentBillItems
    .map(
      (item, idx) => `
      <tr>
        <td class="ps-3 font-monospace text-secondary">${idx + 1}</td>
        <td>
          <input type="text" class="form-control form-control-sm item-name-input" data-index="${idx}" value="${
        item.item_name || ""
      }" />
        </td>
        <td>
          <input type="number" step="0.001" class="form-control form-control-sm font-monospace item-qty-input" data-index="${idx}" value="${
        item.quantity ?? 1
      }" />
        </td>
        <td>
          <input type="number" step="0.01" class="form-control form-control-sm font-monospace item-unit-input" data-index="${idx}" value="${
        item.unit_price ?? 0
      }" />
        </td>
        <td>
          <input type="number" step="0.01" class="form-control form-control-sm font-monospace item-total-input" data-index="${idx}" value="${
        item.total_price ?? 0
      }" />
        </td>
        <td class="pe-3 text-end">
          <button type="button" class="btn btn-outline-danger btn-sm py-0 px-2 btn-remove-item" data-index="${idx}">
            Remove
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  tbody.querySelectorAll(".item-name-input").forEach((el) =>
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.index);
      currentBillItems[i].item_name = e.target.value;
    })
  );
  tbody.querySelectorAll(".item-qty-input").forEach((el) =>
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.index);
      const qty = parseFloat(e.target.value) || 0;
      currentBillItems[i].quantity = qty;
      currentBillItems[i].total_price = Number((qty * (parseFloat(currentBillItems[i].unit_price) || 0)).toFixed(2));
      renderBillItemsTable();
    })
  );
  tbody.querySelectorAll(".item-unit-input").forEach((el) =>
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.index);
      const unit = parseFloat(e.target.value) || 0;
      currentBillItems[i].unit_price = unit;
      currentBillItems[i].total_price = Number(((parseFloat(currentBillItems[i].quantity) || 0) * unit).toFixed(2));
      renderBillItemsTable();
    })
  );
  tbody.querySelectorAll(".item-total-input").forEach((el) =>
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.index);
      currentBillItems[i].total_price = parseFloat(e.target.value) || 0;
    })
  );
  tbody.querySelectorAll(".btn-remove-item").forEach((el) =>
    el.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.dataset.index);
      currentBillItems.splice(i, 1);
      renderBillItemsTable();
    })
  );
}

function renderBillDraft(billDraft) {
  if (!billDraft) return;

  document.getElementById("billShopName").value = billDraft.shop_name || "";
  document.getElementById("billInvoiceNumber").value = billDraft.invoice_number || "";
  document.getElementById("billDate").value = billDraft.bill_date || "";
  document.getElementById("billSubtotal").value = billDraft.subtotal ?? "";
  document.getElementById("billTaxAmount").value = billDraft.tax_amount ?? "";
  document.getElementById("billGrandTotal").value = billDraft.grand_total ?? "";

  currentBillItems = (billDraft.items || []).map((it) => ({
    item_name: it.item_name,
    quantity: Number(it.quantity),
    unit_price: Number(it.unit_price),
    total_price: Number(it.total_price),
  }));
  renderBillItemsTable();

  const v = billDraft.validation || {};
  const msgEl = document.getElementById("billValidationMessages");
  const passedHtml = (v.checks_passed || [])
    .map((c) => `<div class="text-success">✓ ${c}</div>`)
    .join("");
  const warnHtml = (v.warnings || [])
    .map((w) => `<div class="text-warning-emphasis">! ${w}</div>`)
    .join("");
  msgEl.innerHTML = passedHtml + warnHtml || "Bill draft ready for review.";
}

async function handleUploadFormSubmit(event) {
  event.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const errorAlert = document.getElementById("uploadErrorAlert");
  const btnSubmit = document.getElementById("btnUploadProcess");
  const btnReprocess = document.getElementById("btnReprocess");
  const subtitle = document.getElementById("previewSubtitle");

  const file = fileInput.files[0];
  const validationError = validateSelectedFile(file);
  if (validationError) {
    errorAlert.textContent = validationError;
    errorAlert.classList.remove("d-none");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", document.getElementById("optDocType").value);
  formData.append("ocr_lang", document.getElementById("optOcrLang").value);
  formData.append("use_ollama", document.getElementById("optUseOllama").checked);
  formData.append("perspective_correction", document.getElementById("optPerspective").checked);
  formData.append("rotation_correction", document.getElementById("optRotation").checked);
  formData.append("shadow_removal", document.getElementById("optShadow").checked);
  formData.append("denoise", document.getElementById("optDenoise").checked);
  formData.append("threshold_mode", document.getElementById("optThresholdMode").value);

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Running OpenCV, OCR & Hybrid Parser...";

  try {
    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Upload failed.");

    currentDocumentId = data.document.id;
    currentFilename = data.stored_original_filename || file.name;
    currentPages = data.pages || [];
    currentPageIndex = 0;

    subtitle.innerHTML = `Document <code>#${data.document.id}</code> stored as <code>${data.stored_original_filename}</code>`;
    btnReprocess.classList.remove("d-none");

    renderCurrentPagePreview();
    renderOCRAndClassification(data.ocr_result, data.document);
    renderBillDraft(data.bill_draft);
    checkDatabaseAndDashboardStats();
    loadHistoryRecords();
  } catch (err) {
    errorAlert.textContent = err.message || String(err);
    errorAlert.classList.remove("d-none");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Upload, Run OpenCV, OCR & Parse";
  }
}

async function handleSaveBillToSql() {
  if (!currentDocumentId) return;

  const saveAlert = document.getElementById("billSaveSuccessAlert");
  const payload = {
    document_id: currentDocumentId,
    extracted_text: document.getElementById("extractedTextEditor").value,
    shop_name: document.getElementById("billShopName").value.trim() || null,
    invoice_number: document.getElementById("billInvoiceNumber").value.trim() || null,
    bill_date: document.getElementById("billDate").value || null,
    subtotal: document.getElementById("billSubtotal").value
      ? Number(document.getElementById("billSubtotal").value)
      : null,
    tax_amount: document.getElementById("billTaxAmount").value
      ? Number(document.getElementById("billTaxAmount").value)
      : null,
    grand_total: document.getElementById("billGrandTotal").value
      ? Number(document.getElementById("billGrandTotal").value)
      : null,
    items: currentBillItems.filter((it) => (it.item_name || "").trim().length > 0),
  };

  const response = await fetch("/api/bills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (response.ok) {
    saveAlert.textContent = `Saved Bill #${data.id} (${data.shop_name || "Unnamed Shop"}) with ${
      data.items.length
    } item(s) into PostgreSQL.`;
    saveAlert.classList.remove("d-none");
    setTimeout(() => saveAlert.classList.add("d-none"), 5000);
    checkDatabaseAndDashboardStats();
    loadHistoryRecords();
  }
}

function buildFilterQueryString() {
  const q = document.getElementById("filterQueryInput")?.value.trim() || "";
  const startDate = document.getElementById("filterStartDate")?.value || "";
  const endDate = document.getElementById("filterEndDate")?.value || "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  return params.toString();
}

async function loadHistoryRecords() {
  const docsBody = document.getElementById("savedDocumentsTableBody");
  const billsBody = document.getElementById("savedBillsTableBody");
  const qs = buildFilterQueryString();

  try {
    const [docsRes, billsRes] = await Promise.all([
      fetch(`/api/documents${qs ? "?" + qs : ""}`),
      fetch(`/api/bills${qs ? "?" + qs : ""}`),
    ]);
    const docs = await docsRes.json();
    const bills = await billsRes.json();

    if (docsBody) {
      docsBody.innerHTML = docs.length
        ? docs
            .map(
              (d) => `
          <tr>
            <td class="ps-3 font-monospace">#${d.id}</td>
            <td class="font-monospace text-truncate" style="max-width: 160px;">${d.filename}</td>
            <td>${d.document_type}</td>
            <td class="pe-3 text-end">
              <button class="btn btn-outline-dark btn-sm py-0 px-2" onclick="viewDocumentDetails(${d.id})">View</button>
              <a class="btn btn-outline-secondary btn-sm py-0 px-2" href="/api/documents/${d.id}/export-txt">TXT</a>
              <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="promptDeleteRecord('document', ${d.id}, '${d.filename}')">Del</button>
            </td>
          </tr>`
            )
            .join("")
        : `<tr><td colspan="4" class="text-center text-muted py-3 small">No matching documents</td></tr>`;
    }

    if (billsBody) {
      billsBody.innerHTML = bills.length
        ? bills
            .map(
              (b) => `
          <tr>
            <td class="ps-3 font-monospace">#${b.id}</td>
            <td>${b.shop_name || "—"}</td>
            <td class="font-monospace">${b.bill_date || "—"}</td>
            <td class="font-monospace fw-semibold">${b.grand_total ?? "0.00"}</td>
            <td class="pe-3 text-end">
              <button class="btn btn-outline-dark btn-sm py-0 px-2" onclick="viewBillDetails(${b.id})">View</button>
              <a class="btn btn-outline-success btn-sm py-0 px-2" href="/api/export/bills/${b.id}/excel">XLSX</a>
              <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="promptDeleteRecord('bill', ${b.id}, '${b.shop_name || "Bill"}')">Del</button>
            </td>
          </tr>`
            )
            .join("")
        : `<tr><td colspan="5" class="text-center text-muted py-3 small">No matching bills</td></tr>`;
    }
  } catch (err) {
    console.error("Failed to load history records:", err);
  }
}

window.promptDeleteRecord = function (entity, id, label) {
  pendingDeleteAction = { entity, id };
  const msgEl = document.getElementById("deleteConfirmModalMessage");
  msgEl.innerHTML = `Are you sure you want to permanently delete <strong>${entity} #${id} (${label})</strong> from PostgreSQL?`;
  new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
};

async function executeConfirmedDelete() {
  if (!pendingDeleteAction) return;
  const { entity, id } = pendingDeleteAction;
  const endpoint = entity === "document" ? `/api/documents/${id}` : `/api/bills/${id}`;

  await fetch(endpoint, { method: "DELETE" });
  pendingDeleteAction = null;
  bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal"))?.hide();

  checkDatabaseAndDashboardStats();
  loadHistoryRecords();
}

window.viewDocumentDetails = async function (docId) {
  const res = await fetch(`/api/documents/${docId}`);
  const data = await res.json();
  const d = data.document;
  const titleEl = document.getElementById("recordDetailModalTitle");
  const bodyEl = document.getElementById("recordDetailModalBody");

  titleEl.textContent = `Document #${d.id} Details — ${d.filename}`;
  bodyEl.innerHTML = `
    <div class="mb-3">
      <div><strong>Document Type:</strong> <code>${d.document_type}</code></div>
      <div><strong>File Format:</strong> <code>${d.file_type}</code></div>
      <div><strong>Created At:</strong> <code>${d.created_at}</code></div>
    </div>
    <div class="fw-semibold mb-1">Extracted OCR Text:</div>
    <pre class="p-3 bg-light border rounded font-monospace small">${d.extracted_text || "(No text)"}</pre>
  `;
  new bootstrap.Modal(document.getElementById("recordDetailModal")).show();
};

window.viewBillDetails = async function (billId) {
  const res = await fetch(`/api/bills/${billId}`);
  const data = await res.json();
  const b = data.bill;
  const d = data.document;
  const titleEl = document.getElementById("recordDetailModalTitle");
  const bodyEl = document.getElementById("recordDetailModalBody");

  titleEl.textContent = `Bill #${b.id} Details — ${b.shop_name || "Shop Receipt"}`;
  bodyEl.innerHTML = `
    <div class="row g-2 mb-3">
      <div class="col-6"><strong>Shop Name:</strong> ${b.shop_name || "—"}</div>
      <div class="col-6"><strong>Invoice #:</strong> <code>${b.invoice_number || "—"}</code></div>
      <div class="col-6"><strong>Bill Date:</strong> <code>${b.bill_date || "—"}</code></div>
      <div class="col-6"><strong>Source File:</strong> <code>${d.filename}</code></div>
      <div class="col-4"><strong>Subtotal:</strong> <code>${b.subtotal ?? "0.00"}</code></div>
      <div class="col-4"><strong>Tax/GST:</strong> <code>${b.tax_amount ?? "0.00"}</code></div>
      <div class="col-4"><strong>Grand Total:</strong> <code class="fw-bold">${b.grand_total ?? "0.00"}</code></div>
    </div>
    <div class="fw-semibold mb-1">Line Items (${b.items.length}):</div>
    <table class="table table-sm table-bordered font-monospace">
      <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        ${b.items
          .map(
            (it) =>
              `<tr><td>${it.item_name}</td><td>${it.quantity}</td><td>${it.unit_price}</td><td>${it.total_price}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
  new bootstrap.Modal(document.getElementById("recordDetailModal")).show();
};

document.addEventListener("DOMContentLoaded", () => {
  checkDatabaseAndDashboardStats();
  loadHistoryRecords();

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const selectedFileName = document.getElementById("selectedFileName");
  const selectedFileMeta = document.getElementById("selectedFileMeta");

  if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      const err = validateSelectedFile(file);
      const errorAlert = document.getElementById("uploadErrorAlert");
      if (err) {
        errorAlert.textContent = err;
        errorAlert.classList.remove("d-none");
        return;
      }
      selectedFileName.textContent = file.name;
      selectedFileMeta.textContent = `${(file.size / 1024).toFixed(1)} KB · Ready for OpenCV, OCR & Hybrid Bill Extraction`;
    });
  }

  document.getElementById("uploadForm")?.addEventListener("submit", handleUploadFormSubmit);
  document.getElementById("btnSaveBillSql")?.addEventListener("click", handleSaveBillToSql);
  document.getElementById("btnAddBillItemRow")?.addEventListener("click", () => {
    currentBillItems.push({ item_name: "", quantity: 1, unit_price: 0, total_price: 0 });
    renderBillItemsTable();
  });
  document.getElementById("btnRecalcBillTotals")?.addEventListener("click", () => {
    const sumItems = currentBillItems.reduce((acc, item) => acc + (parseFloat(item.total_price) || 0), 0);
    document.getElementById("billSubtotal").value = sumItems.toFixed(2);
    const taxVal = parseFloat(document.getElementById("billTaxAmount").value) || 0;
    document.getElementById("billGrandTotal").value = (sumItems + taxVal).toFixed(2);
  });
  document.getElementById("btnApplyFilters")?.addEventListener("click", loadHistoryRecords);
  document.getElementById("btnClearFilters")?.addEventListener("click", () => {
    document.getElementById("filterQueryInput").value = "";
    document.getElementById("filterStartDate").value = "";
    document.getElementById("filterEndDate").value = "";
    loadHistoryRecords();
  });
  document.getElementById("btnExportFilteredExcel")?.addEventListener("click", () => {
    const qs = buildFilterQueryString();
    window.location.href = `/api/export/bills/excel${qs ? "?" + qs : ""}`;
  });
  document.getElementById("btnConfirmDeleteExecute")?.addEventListener("click", executeConfirmedDelete);

  // Theme Toggle (Light / High-Contrast Dark via CSS Variables)
  const themeBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeToggleIcon");
  const themeLabel = document.getElementById("themeToggleLabel");
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("scan2sql_theme", theme);
    if (themeIcon && themeLabel) {
      if (theme === "dark") {
        themeIcon.className = "bi bi-sun-fill text-warning";
        themeLabel.textContent = "Light";
      } else {
        themeIcon.className = "bi bi-moon-stars-fill";
        themeLabel.textContent = "Dark";
      }
    }
  };
  const savedTheme = localStorage.getItem("scan2sql_theme") || "light";
  applyTheme(savedTheme);
  themeBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
});
