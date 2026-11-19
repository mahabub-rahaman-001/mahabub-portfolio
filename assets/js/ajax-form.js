/*
 * Contact forms -> Formspree (AJAX)
 *
 * Works for every form whose action points at Formspree (contact.html and cv.html).
 * Submits without leaving the page, validates fields, shows an inline
 * success/error message, and sends a consistent email subject line.
 */
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var forms = document.querySelectorAll('form[action*="formspree.io"]');

  for (var f = 0; f < forms.length; f++) {
    setupForm(forms[f]);
  }

  function setupForm(form) {
    var submitBtn = form.querySelector('[type="submit"]');
    // If the button holds an icon + <span>, only change the span's text.
    var btnLabel = submitBtn ? submitBtn.querySelector("span") || submitBtn : null;
    var originalLabel = btnLabel ? btnLabel.textContent : "";
    // cv.html keeps the button disabled until the form is valid (cv-script.js).
    var disableUntilValid = submitBtn && submitBtn.hasAttribute("data-form-btn");

    var statusBox = form.querySelector(".messenger-box-contact__msg, .form-status");
    if (!statusBox) {
      statusBox = document.createElement("div");
      statusBox.className = "form-status";
      statusBox.setAttribute("role", "alert");
      statusBox.style.display = "none";
      form.insertBefore(statusBox, form.firstChild);
    }

    function showStatus(message, isSuccess) {
      statusBox.textContent = message;
      statusBox.classList.add("alert");
      statusBox.classList.toggle("alert-success", isSuccess);
      statusBox.classList.toggle("alert-danger", !isSuccess);
      statusBox.style.display = "block";
    }

    function field(name) {
      return form.querySelector('[name="' + name + '"]');
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Required-field check (only the fields this form actually has)
      var names = ["full-name", "email", "subject", "message"];
      for (var i = 0; i < names.length; i++) {
        var input = field(names[i]);
        if (input && !input.value.trim()) {
          showStatus("Please fill in all the required fields.", false);
          input.focus();
          return;
        }
      }

      var email = field("email");
      if (email && !EMAIL_RE.test(email.value.trim())) {
        showStatus("Please enter a valid email address.", false);
        email.focus();
        return;
      }

      var data = new FormData(form);
      var subject = field("subject");
      var page = form.getAttribute("data-source") || "Portfolio";
      data.set(
        "_subject",
        "New portfolio message" + (subject && subject.value.trim() ? ": " + subject.value.trim() : "") + " (" + page + ")"
      );

      if (submitBtn) submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = "Sending...";

      var succeeded = false;

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            succeeded = true;
            form.reset();
            showStatus("Your message was sent successfully. I'll get back to you soon!", true);
            return;
          }
          return response.json().then(
            function (json) {
              var msg =
                json && json.errors
                  ? json.errors.map(function (err) { return err.message; }).join(", ")
                  : "Oops! Something went wrong. Please try again.";
              showStatus(msg, false);
            },
            function () {
              showStatus("Oops! Something went wrong. Please try again.", false);
            }
          );
        })
        .catch(function () {
          showStatus("Network error. Please check your connection and try again.", false);
        })
        .finally(function () {
          if (btnLabel) btnLabel.textContent = originalLabel || "Send Message";
          if (submitBtn) {
            // After a successful reset the CV form is empty, so keep it disabled there.
            submitBtn.disabled = disableUntilValid && succeeded;
          }
        });
    });
  }
})();
