/* ===========================================================
   dashboard.js — Logika halaman dashboard
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth();
  if (!user) return;

  // Sapaan & identitas pengguna
  document.getElementById("greeting-text").textContent = `${getGreeting()}, ${user.nama.split(" ")[0]}`;
  document.getElementById("user-name").textContent = user.nama;
  document.getElementById("user-avatar").textContent = getInitials(user.nama);

  // Kartu ringkasan dihitung dari dataBahanAjar & dataTracking (data.js)
  const totalJudul = dataBahanAjar.length;
  const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
  const totalPengiriman = Object.keys(dataTracking).length;
  const dalamPerjalanan = Object.values(dataTracking).filter(
    (t) => t.status !== "Selesai Antar" && t.status !== "Diterima"
  ).length;

  const cards = [
    { label: "Judul Bahan Ajar", value: totalJudul, cls: "navy" },
    { label: "Total Stok Keseluruhan", value: totalStok.toLocaleString("id-ID"), cls: "navy" },
    { label: "Delivery Order Tercatat", value: totalPengiriman, cls: "amber" },
    { label: "Masih Dalam Proses Kirim", value: dalamPerjalanan, cls: "amber" },
  ];

  const statWrap = document.getElementById("stat-cards");
  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.innerHTML = `<div class="label">${c.label}</div><div class="value ${c.cls}">${c.value}</div>`;
    statWrap.appendChild(div);
  });

  // Tabel ringkas lima stok tertinggi
  const tbody = document.getElementById("dashboard-stok-body");
  const topFive = [...dataBahanAjar].sort((a, b) => b.stok - a.stok).slice(0, 5);
  topFive.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.namaBarang}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.kodeLokasi}</td>
      <td>${item.stok.toLocaleString("id-ID")}</td>
    `;
    tbody.appendChild(tr);
  });

  // Submenu Laporan
  const toggle = document.getElementById("laporan-toggle");
  const submenu = document.getElementById("laporan-submenu");
  toggle.addEventListener("click", () => submenu.classList.toggle("open"));

  // Menu yang belum tersedia pada cakupan Tugas Praktik 1
  document.querySelectorAll("[data-coming-soon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Fitur ini berada di luar cakupan Tugas Praktik 1.");
    });
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearActiveUser();
    window.location.href = "index.html";
  });
});
