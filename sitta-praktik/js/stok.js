/* ===========================================================
   stok.js — Tabel dinamis Informasi Bahan Ajar + tambah stok baru
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  document.getElementById("user-name").textContent = user.nama;
  document.getElementById("user-avatar").textContent = getInitials(user.nama);

  const tbody = document.getElementById("stok-body");
  const emptyMsg = document.getElementById("empty-msg");
  const filterInput = document.getElementById("filter-input");

  function stokBadgeClass(stok) {
    if (stok < 200) return "low";
    if (stok < 400) return "mid";
    return "ok";
  }

  function renderRow(item) {
    const tr = document.createElement("tr");
    tr.className = "row-clickable";
    tr.title = "Klik untuk melihat detail";
    tr.innerHTML = `
      <td><img class="cover-thumb" src="${item.cover || ""}" alt="Sampul ${item.namaBarang}" onerror="this.style.visibility='hidden'"></td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.kodeLokasi}</td>
      <td><span class="badge ${stokBadgeClass(item.stok)}">${item.stok.toLocaleString("id-ID")}</span></td>
    `;
    tr.addEventListener("click", () => showDetail(item));
    return tr;
  }

  // Menampilkan peragaan data satu bahan ajar secara dinamis dari dataBahanAjar
  function showDetail(item) {
    const detail = document.getElementById("detail-content");
    detail.innerHTML = `
      <h3>Informasi Bahan Ajar</h3>
      <p class="sub">Peragaan Data Bahan Ajar</p>
      <img class="detail-cover" src="${item.cover || ""}" alt="Sampul ${item.namaBarang}" onerror="this.style.display='none'">
      <div class="detail-field"><div class="label">Kode Lokasi</div><div class="val">${item.kodeLokasi}</div></div>
      <div class="detail-field"><div class="label">Kode Barang</div><div class="val">${item.kodeBarang}</div></div>
      <div class="detail-field"><div class="label">Nama Barang</div><div class="val">${item.namaBarang}</div></div>
      <div class="detail-field"><div class="label">Jenis Barang</div><div class="val">${item.jenisBarang}</div></div>
      <div class="detail-field"><div class="label">Edisi</div><div class="val">${item.edisi}</div></div>
      <div class="detail-field"><div class="label">Stok</div><div class="val">${item.stok.toLocaleString("id-ID")}</div></div>
      <div class="modal-actions">
        <button type="button" class="btn-ghost" data-close-modal="modal-detail">Tutup</button>
      </div>
    `;
    detail.querySelector("[data-close-modal]").addEventListener("click", () => closeModal("modal-detail"));
    openModal("modal-detail");
  }

  function renderTable(keyword = "") {
    tbody.innerHTML = "";
    const kw = keyword.trim().toLowerCase();
    const filtered = dataBahanAjar.filter(
      (item) =>
        !kw ||
        item.namaBarang.toLowerCase().includes(kw) ||
        item.kodeBarang.toLowerCase().includes(kw)
    );

    filtered.forEach((item) => tbody.appendChild(renderRow(item)));
    emptyMsg.style.display = filtered.length === 0 ? "block" : "none";
  }

  renderTable();

  filterInput.addEventListener("input", (e) => renderTable(e.target.value));

  // ---- Tambah stok baru ----
  document.getElementById("add-btn").addEventListener("click", () => openModal("modal-add"));

  const fields = ["kodeLokasi", "kodeBarang", "namaBarang", "edisi", "stok"];

  document.getElementById("add-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const values = {};
    let valid = true;

    fields.forEach((f) => {
      const input = document.getElementById("f-" + f);
      const val = input.value.trim();
      const fieldOk = f === "stok" ? val !== "" && Number(val) >= 0 : val !== "";
      document.getElementById("field-" + f).classList.toggle("has-error", !fieldOk);
      if (!fieldOk) valid = false;
      values[f] = val;
    });

    if (!valid) {
      showToast("Lengkapi semua kolom dengan benar.");
      return;
    }

    dataBahanAjar.push({
      kodeLokasi: values.kodeLokasi,
      kodeBarang: values.kodeBarang,
      namaBarang: values.namaBarang,
      jenisBarang: "BMP",
      edisi: values.edisi,
      stok: Number(values.stok),
      cover: "",
    });

    renderTable(filterInput.value);
    closeModal("modal-add");
    e.target.reset();
    showToast("Stok bahan ajar baru berhasil ditambahkan.", "success");
  });

  // Submenu laporan & logout (konsisten dengan halaman lain)
  const toggle = document.getElementById("laporan-toggle");
  const submenu = document.getElementById("laporan-submenu");
  toggle.addEventListener("click", () => submenu.classList.toggle("open"));
  document.querySelectorAll("[data-coming-soon]").forEach((btn) => {
    btn.addEventListener("click", () => showToast("Fitur ini berada di luar cakupan Tugas Praktik 1."));
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearActiveUser();
    window.location.href = "index.html";
  });
});
