"use strict";

/*=========================================
ENDPOINT
=========================================*/

const API = "https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1/send-signup-otp";

/*=========================================
ELEMENTS
=========================================*/

const form = document.getElementById("signupForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const referralCode = document.getElementById("referralCode");
const agree = document.getElementById("agree");

const loading = document.getElementById("loading");
const success = document.getElementById("success");
const error = document.getElementById("error");
const strength = document.getElementById("strength");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");

/*=========================================
HELPERS
=========================================*/

function showLoading() {
    loading.style.display = "flex";
}

function hideLoading() {
    loading.style.display = "none";
}

function showError(message) {
    error.style.display = "block";
    success.style.display = "none";
    error.textContent = message;
}

function showSuccess(message) {
    success.style.display = "block";
    error.style.display = "none";
    success.textContent = message;
}

/*=========================================
PASSWORD TOGGLE
=========================================*/

togglePassword.onclick = () => {
    password.type = password.type === "password" ? "text" : "password";
    togglePassword.textContent = password.type === "password" ? "Show" : "Hide";
};

toggleConfirm.onclick = () => {
    confirmPassword.type = confirmPassword.type === "password" ? "text" : "password";
    toggleConfirm.textContent = confirmPassword.type === "password" ? "Show" : "Hide";
};

/*=========================================
PASSWORD STRENGTH
=========================================*/

password.addEventListener("input", () => {

    const value = password.value;

    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {

        strength.textContent = "Password Strength: Weak";
        strength.style.color = "#ef4444";

    } else if (score <= 4) {

        strength.textContent = "Password Strength: Medium";
        strength.style.color = "#f59e0b";

    } else {

        strength.textContent = "Password Strength: Strong";
        strength.style.color = "#22c55e";

    }

});

/*=========================================
SIGNUP
=========================================*/

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    success.style.display = "none";
    error.style.display = "none";

    const name = fullName.value.trim();
    const userEmail = email.value.trim().toLowerCase();
    const userPassword = password.value;
    const confirm = confirmPassword.value;
    const referral = referralCode.value.trim();

    if (name.length < 3) {
        return showError("Enter your full name.");
    }

    if (userPassword.length < 8) {
        return showError("Password must be at least 8 characters.");
    }

    if (userPassword !== confirm) {
        return showError("Passwords do not match.");
    }

    if (!agree.checked) {
        return showError("Accept the Terms and Privacy Policy.");
    }

    showLoading();

    try {

        console.log("Sending POST to:", API);

const response = await fetch(API, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: userEmail,
        referral_code: referral
    })
});

console.log("Status:", response.status);

const responseText = await response.text();
console.log("Response:", responseText);

let result = {};

try {
    result = JSON.parse(responseText);
} catch {
    result = { message: responseText };
}

if (!response.ok) {
    throw new Error(result.error || result.message || "Signup failed.");
    }

        sessionStorage.setItem("signupData", JSON.stringify({
            fullName: name,
            email: userEmail,
            password: userPassword,
            referralCode: referral
        }));

        showSuccess(result.message || "OTP sent successfully.");

        setTimeout(() => {
            window.location.href = "../verify-signup/";
        }, 1000);

    } catch (err) {

        console.error(err);

        showError(err.message || "Failed to connect to the server.");

    } finally {

        hideLoading();

    }

});
