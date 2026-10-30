/* ===========================================================
   login.js — Validasi form, autentikasi, dan modal halaman login
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Jika sudah ada sesi aktif, langsung arahkan ke dashboard
  if (getActiveUser()) {
    window.location.href = "dashboard.html";
    return;
  }

  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldId, hasError) {
    document.getElementById(fieldId).classList.toggle("has-error", hasError);
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailValid = EMAIL_PATTERN.test(email);
    const passwordValid = password.length > 0;

    setFieldError("field-email", !emailValid);
    setFieldError("field-password", !passwordValid);

    if (!emailValid || !passwordValid) {
      showToast("Lengkapi form dengan benar sebelum masuk.");
      return;
    }

    // Validasi terhadap data pengguna (dataPengguna berasal dari data.js)
    const matchedUser = dataPengguna.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser || matchedUser.password !== password) {
      setFieldError("field-email", true);
      setFieldError("field-password", true);
      showToast("email/password yang anda masukkan salah");
      return;
    }

    setActiveUser(matchedUser);
    showToast("Login berhasil. Mengalihkan...", "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  });

  // ---- Modal: Lupa Password ----
  document.getElementById("link-forgot").addEventListener("click", (e) => {
    e.preventDefault();
    openModal("modal-forgot");
  });

  document.getElementById("forgot-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("forgot-email");
    const valid = EMAIL_PATTERN.test(input.value.trim());
    setFieldError("field-forgot-email", !valid);
    if (!valid) return;
    closeModal("modal-forgot");
    input.value = "";
    showToast("Tautan atur ulang kata sandi telah dikirim.", "success");
  });

  // ---- Modal: Daftar ----
  document.getElementById("link-register").addEventListener("click", (e) => {
    e.preventDefault();
    openModal("modal-register");
  });

  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("reg-nama");
    const email2 = document.getElementById("reg-email");
    const lokasi = document.getElementById("reg-lokasi");

    const namaValid = nama.value.trim().length > 0;
    const emailValid2 = EMAIL_PATTERN.test(email2.value.trim());
    const lokasiValid = lokasi.value.trim().length > 0;

    setFieldError("field-reg-nama", !namaValid);
    setFieldError("field-reg-email", !emailValid2);
    setFieldError("field-reg-lokasi", !lokasiValid);

    if (!namaValid || !emailValid2 || !lokasiValid) return;

    closeModal("modal-register");
    [nama, email2, lokasi].forEach((f) => (f.value = ""));
    showToast("Permohonan pendaftaran telah terkirim.", "success");
  });
});
