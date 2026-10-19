/* Contact form validation: no empty fields, valid email, digits-only phone */
(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");
  var fields = ["name", "email", "phone", "message"];

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var digitsPattern = /^\d+$/;

  var rules = {
    name: function (v) { return v ? "" : "Enter your name."; },
    email: function (v) {
      if (!v) return "Enter your email address.";
      return emailPattern.test(v) ? "" : "Enter a valid email, like name@example.com.";
    },
    phone: function (v) {
      if (!v) return "Enter your phone number.";
      if (!digitsPattern.test(v)) return "Use digits only. Remove spaces, dashes and the + sign.";
      return v.length >= 7 && v.length <= 15 ? "" : "Phone number must be 7 to 15 digits.";
    },
    message: function (v) { return v ? "" : "Write a message."; }
  };

  function check(id) {
    var el = document.getElementById(id);
    var msg = rules[id](el.value.trim());
    document.getElementById(id + "Error").textContent = msg;
    el.classList.toggle("invalid", msg !== "");
    el.classList.toggle("valid", msg === "");
    el.setAttribute("aria-invalid", String(msg !== ""));
    return msg === "";
  }

  fields.forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("blur", function () { check(id); });
    el.addEventListener("input", function () {
      if (el.classList.contains("invalid")) check(id);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    success.hidden = true;

    var firstBad = null;
    fields.forEach(function (id) {
      if (!check(id) && !firstBad) firstBad = id;
    });
    if (firstBad) {
      document.getElementById(firstBad).focus();
      return;
    }

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var message = document.getElementById("message").value.trim();

    var body = message + "\n\nFrom: " + name + "\nEmail: " + email + "\nPhone: " + phone;
    var href = "mailto:akumaobioma@gmail.com?subject=" +
      encodeURIComponent("Portfolio message from " + name) + "&body=" + encodeURIComponent(body);

    success.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = "Thank you, " + name + ". Your message is ready to send.";
    var a = document.createElement("a");
    a.className = "btn small";
    a.href = href;
    a.textContent = "Open in my email app";
    success.appendChild(p);
    success.appendChild(a);
    success.hidden = false;
    form.reset();
    fields.forEach(function (id) {
      document.getElementById(id).classList.remove("valid", "invalid");
    });
  });
})();
