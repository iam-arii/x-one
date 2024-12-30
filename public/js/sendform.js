document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#contactForm");
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const phoneInput = document.querySelector("#phone");
  const messageInput = document.querySelector("#message");
  const success = document.querySelector("#submitSuccessMessage");
  const error = document.querySelector("#submitErrorMessage");
  const inputs = form.querySelectorAll("[data-sb-validations]");

  // fungsi utama untuk submit
  form.onsubmit = function (event) {
    event.preventDefault(); // Mencegah halaman melakukan refresh

    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let phone = phoneInput.value.trim();
    let message = messageInput.value.trim();

    // Pengecekkan apakah semua input sudah diisi dengan benar, baru dilanjutkan dengan fetch api
    if (validateForm()) {
      const webhookURL =
        "https://discord.com/api/webhooks/1318479486647406624/VdxysN2cM8qQWnEPlWPWeSuWZVpIL9wHpU2Hsm3jyEVpgfeymuAsxN5LHzsefOQ6NK34"; // Ganti dengan URL webhook Anda

      // mengganti format nomor wa, apabila karater pertamanya '0' maka diganti dengan '62'
      if (phone[0] === "0") {
        phone = "62" + phone.slice(1);
      }

      // ganti ID_DISCORD dengan id akun discord anda
      const pesan = `<@ID_DISCORD>\n**Pesan Baru**\n**Nama**: ${name}\n**email**: ${email}\n**WA**: https://wa.me/${phone}\n**Pesan**: ${message}`;

      // Data JSON yang akan dikirim
      const payload = {
        content: pesan, // Pesan yang akan dikirim ke Discord
      };

      // Kirim data ke webhook menggunakan fetch dengan Promise
      fetch(webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Konversi objek ke JSON string
      })
        .then(function (response) {
          if (response.ok) {
            // mengganti class dan menampilkan pesan sukses
            success.classList.add("d-block");
            success.classList.remove("d-none");
            error.classList.add("d-none");
            error.classList.remove("d-block");
            nameInput.value = ""; // Reset input setelah berhasil
            emailInput.value = "";
            phoneInput.value = "";
            messageInput.value = "";
          } else {
            // mengganti class dan menampilkan pesan error
            error.classList.add("d-block");
            error.classList.remove("d-none");
            success.classList.add("d-none");
            success.classList.remove("d-block");
          }
        })
        .catch(function (err) {
          error.classList.add("d-block");
          error.classList.remove("d-none");
          success.classList.add("d-none");
          success.classList.remove("d-block");
        });
    }
  };

  // Fungsi untuk mengecek validasi
  function validateForm() {
    let isValid = true; // Flag status validasi form

    inputs.forEach((input) => {
      const validations = input.dataset.sbValidations.split(",");
      const feedbacks = form.querySelectorAll(
        `[data-sb-feedback="${input.id}:required"]`
      );

      // Periksa validasi required
      if (validations.includes("required")) {
        if (input.value.trim() === "") {
          // Input kosong -> tampilkan error
          feedbacks.forEach((feedback) => feedback.classList.remove("d-none"));
          input.classList.add("is-invalid");
          isValid = false;
        } else {
          // Input diisi -> sembunyikan error
          feedbacks.forEach((feedback) => feedback.classList.add("d-none"));
          input.classList.remove("is-invalid");
        }
      }
    });

    return isValid;
  }

  const submitButton = document.getElementById("submitButton");

  // Fungsi untuk mengecek input kosong
  function checkInputs() {
    let allFilled = true; // Flag untuk mengecek semua input required

    inputs.forEach((input) => {
      if (input.dataset.sbValidations.includes("required")) {
        if (input.value.trim() === "") {
          allFilled = false;
        }
      }
    });

    // Toggle tombol submit
    submitButton.classList.toggle("disabled", !allFilled);
  }

  // Event listener untuk input (real-time tombol disable)
  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });

  // Inisialisasi awal untuk tombol submit
  checkInputs();
});
