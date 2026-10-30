/* ===========================================================
   tracking.js — Pencarian & tampilan status pengiriman
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  document.getElementById("user-name").textContent = user.nama;
  document.getElementById("user-avatar").textContent = getInitials(user.nama);

  const doInput = document.getElementById("do-input");
  const resultArea = document.getElementById("result-area");

  function renderEmpty(message) {
    resultArea.innerHTML = `<div class="panel empty-state">${message}</div>`;
  }

  function renderResult(doNumber, data) {
    // Mencocokkan kode lokasi tujuan paket dengan nama bahan ajar terkait
    const paketInfo = dataBahanAjar.find((b) => b.kodeLokasi === data.paket);
    const namaPaket = paketInfo ? paketInfo.namaBarang : data.paket;

    const timelineItems = data.perjalanan
      .map((p, idx) => {
        const isLatest = idx === data.perjalanan.length - 1;
        return `
          <li class="${isLatest ? "latest" : ""}">
            <div class="time">${p.waktu}</div>
            <div class="desc">${p.keterangan}</div>
          </li>`;
      })
      .join("");

    resultArea.innerHTML = `
      <section class="panel">
        <h2>${data.nama}</h2>
        <p class="panel-sub">Nomor DO ${doNumber}</p>

        <div class="track-summary">
          <div class="item"><div class="label">Status</div><div class="val">${data.status}</div></div>
          <div class="item"><div class="label">Ekspedisi</div><div class="val">${data.ekspedisi}</div></div>
          <div class="item"><div class="label">Tanggal Kirim</div><div class="val">${data.tanggalKirim}</div></div>
          <div class="item"><div class="label">Jenis Paket</div><div class="val">${namaPaket}</div></div>
          <div class="item"><div class="label">Total Pembayaran</div><div class="val">${data.total}</div></div>
        </div>

        <h2 style="font-size:1rem;">Perjalanan Paket</h2>
        <ul class="timeline">${timelineItems}</ul>
      </section>
    `;
  }

  function doSearch() {
    const key = doInput.value.trim();
    if (!key) {
      showToast("Masukkan nomor DO terlebih dahulu.");
      return;
    }
    const data = dataTracking[key];
    if (!data) {
      showToast("Nomor DO tidak ditemukan.");
      renderEmpty("Data pengiriman untuk nomor DO tersebut tidak ditemukan. Periksa kembali nomor DO Anda.");
      return;
    }
    renderResult(key, data);
  }

  document.getElementById("search-btn").addEventListener("click", doSearch);
  doInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  // Submenu laporan & logout (konsisten dengan dashboard)
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
