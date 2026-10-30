/* ===========================================================
   utils.js — Fungsi bantu bersama (session, greeting, UI kecil)
   =========================================================== */

const SITTA_SESSION_KEY = "sittaActiveUser";

/** Mengembalikan sapaan sesuai waktu lokal perangkat: pagi/siang/sore/malam */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Menyimpan data pengguna yang berhasil login ke session (localStorage) */
function setActiveUser(user) {
  const safeUser = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    lokasi: user.lokasi,
  };
  localStorage.setItem(SITTA_SESSION_KEY, JSON.stringify(safeUser));
}

/** Mengambil data pengguna aktif, atau null jika belum login */
function getActiveUser() {
  const raw = localStorage.getItem(SITTA_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function clearActiveUser() {
  localStorage.removeItem(SITTA_SESSION_KEY);
}

/** Mengarahkan kembali ke halaman login apabila belum ada sesi aktif */
function requireAuth() {
  const user = getActiveUser();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}

/** Inisial dari nama, dipakai pada avatar kecil di topbar */
function getInitials(nama) {
  if (!nama) return "?";
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Menampilkan pop-up/alert ringan di bagian atas layar (pengganti alert() bawaan) */
function showToast(message, type) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className = "alert-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "alert-toast" + (type === "success" ? " success" : "");
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/** Membuka modal box berdasarkan id elemen backdrop-nya */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

/** Memasang listener umum: tombol [data-close-modal] dan klik di luar modal-box menutup modal */
function initModalDismissers() {
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  });
}

/** Memformat angka menjadi format Rupiah sederhana, mis. 180000 -> "Rp 180.000" */
function formatRupiah(value) {
  const n = typeof value === "number" ? value : Number(String(value).replace(/\D/g, ""));
  if (Number.isNaN(n)) return String(value);
  return "Rp " + n.toLocaleString("id-ID");
}

document.addEventListener("DOMContentLoaded", initModalDismissers);
