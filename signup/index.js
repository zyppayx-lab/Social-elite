"use strict";

/* ======================================
SOCIALELITE SIGNUP
index.js
====================================== */

/*
|--------------------------------------------------------------------------
| CHANGE THESE
|--------------------------------------------------------------------------
*/

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SEND_SIGNUP_OTP =
`$https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1/send-signup-otp`;

const VERIFY_SIGNUP_OTP =
`$https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1/verify-signup-otp`;

/*
|--------------------------------------------------------------------------
| ELEMENTS
|--------------------------------------------------------------------------
*/

const signupForm =
document.getElementById("signupForm");

const otpForm =
document.getElementById("otpForm");

const signupButton =
document.getElementById("signupButton");

const verifyOtpButton =
document.getElementById("verifyOtpButton");

const loadingOverlay =
document.getElementById("loadingOverlay");

const otpCard =
document.getElementById("otpCard");

const emailDisplay =
document.getElementById("otpEmail");

const resendButton =
document.getElementById("resendOtp");

const password =
document.getElementById("password");

const confirmPassword =
document.getElementById("confirmPassword");

const passwordMatch =
document.getElementById("passwordMatch");

const strengthBar =
document.getElementById("strengthBar");

const strengthText =
document.getElementById("strengthText");

const successAlert =
document.getElementById("successAlert");

const errorAlert =
document.getElementById("errorAlert");

const successMessage =
document.getElementById("successMessage");

const errorMessage =
document.getElementById("errorMessage");

/*
|--------------------------------------------------------------------------
| PASSWORD TOGGLE
|--------------------------------------------------------------------------
*/

document
.getElementById("togglePassword")
.addEventListener("click", function(){

password.type =
password.type === "password"
? "text"
: "password";

this.textContent =
password.type === "password"
? "Show"
: "Hide";

});

document
.getElementById("toggleConfirmPassword")
.addEventListener("click", function(){

confirmPassword.type =
confirmPassword.type === "password"
? "text"
: "password";

this.textContent =
confirmPassword.type === "password"
? "Show"
: "Hide";

});

/*
|--------------------------------------------------------------------------
| PASSWORD STRENGTH
|--------------------------------------------------------------------------
*/

password.addEventListener("input", ()=>{

const value = password.value;

let score = 0;

if(value.length >= 8) score++;

if(/[A-Z]/.test(value)) score++;

if(/[0-9]/.test(value)) score++;

if(/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;

const widths = ["0%","25%","50%","75%","100%"];

const colors = [
"#ef4444",
"#f97316",
"#eab308",
"#22c55e",
"#16a34a"
];

const labels = [
"Very Weak",
"Weak",
"Fair",
"Strong",
"Excellent"
];

strengthBar.style.width =
widths[score];

strengthBar.style.background =
colors[score];

strengthText.textContent =
labels[score];

});

/*
|--------------------------------------------------------------------------
| PASSWORD MATCH
|--------------------------------------------------------------------------
*/

confirmPassword.addEventListener("input",()=>{

if(confirmPassword.value===""){

passwordMatch.textContent="";

return;

}

if(password.value===confirmPassword.value){

passwordMatch.textContent="Passwords match";

passwordMatch.style.color="#22c55e";

}else{

passwordMatch.textContent="Passwords do not match";

passwordMatch.style.color="#ef4444";

}

});
/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function showLoading(){

loadingOverlay.classList.remove("hidden");

}

function hideLoading(){

loadingOverlay.classList.add("hidden");

}

function showSuccess(message){

successMessage.textContent = message;

successAlert.classList.remove("hidden");

errorAlert.classList.add("hidden");

}

function showError(message){

errorMessage.textContent = message;

errorAlert.classList.remove("hidden");

successAlert.classList.add("hidden");

}

/*
|--------------------------------------------------------------------------
| SEND SIGNUP OTP
|--------------------------------------------------------------------------
*/

signupForm.addEventListener("submit", async (e)=>{

e.preventDefault();

successAlert.classList.add("hidden");

errorAlert.classList.add("hidden");

if(password.value !== confirmPassword.value){

showError("Passwords do not match.");

return;

}

if(!document.getElementById("agreeTerms").checked){

showError("Please accept the Terms and Privacy Policy.");

return;

}

signupButton.disabled = true;

showLoading();

const payload = {

full_name:
document.getElementById("fullname").value.trim(),

email:
document.getElementById("email").value.trim().toLowerCase(),

password:
password.value,

referral_code:
document.getElementById("referralCode").value.trim()

};

try{

const response = await fetch(

SEND_SIGNUP_OTP,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

}

);

const result = await response.json();

hideLoading();

signupButton.disabled = false;

if(!response.ok){

showError(

result.message ||

result.error ||

"Failed to send OTP."

);

return;

}

emailDisplay.textContent = payload.email;

otpCard.classList.remove("hidden");

signupForm.style.display = "none";

showSuccess(

result.message ||

"OTP sent successfully."

);

otpCard.scrollIntoView({

behavior:"smooth"

});

document.querySelector(".otp-input").focus();

}catch(error){

hideLoading();

signupButton.disabled = false;

showError(

error.message ||

"Network error."

);

}

});

/*
|--------------------------------------------------------------------------
| RESEND OTP
|--------------------------------------------------------------------------
*/

resendButton.addEventListener("click",()=>{

signupForm.dispatchEvent(

new Event("submit",{

cancelable:true

})

);

});
/*
|--------------------------------------------------------------------------
| OTP INPUT AUTO MOVE
|--------------------------------------------------------------------------
*/

const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {

input.addEventListener("input", () => {

input.value = input.value.replace(/[^0-9]/g, "");

if (input.value && index < otpInputs.length - 1) {

otpInputs[index + 1].focus();

}

});

input.addEventListener("keydown", (e) => {

if (
e.key === "Backspace" &&
!input.value &&
index > 0
) {

otpInputs[index - 1].focus();

}

});

});

/*
|--------------------------------------------------------------------------
| VERIFY OTP
|--------------------------------------------------------------------------
*/

otpForm.addEventListener("submit", async (e) => {

e.preventDefault();

showLoading();

verifyOtpButton.disabled = true;

const otp = [...otpInputs]

.map(input => input.value)

.join("");

const payload = {

full_name:
document.getElementById("fullname").value.trim(),

email:
document.getElementById("email").value.trim().toLowerCase(),

password:
password.value,

referral_code:
document.getElementById("referralCode").value.trim(),

otp

};

try {

const response = await fetch(

VERIFY_SIGNUP_OTP,

{

method: "POST",

headers: {

"Content-Type": "application/json"

},

body: JSON.stringify(payload)

}

);

const result = await response.json();

hideLoading();

verifyOtpButton.disabled = false;

if (!response.ok) {

showError(

result.message ||

result.error ||

"OTP verification failed."

);

return;

}

showSuccess(

result.message ||

"Account created successfully."

);

/*
|--------------------------------------------------------------------------
| SAVE SESSION
|--------------------------------------------------------------------------
*/

if (result.session) {

localStorage.setItem(

"socialelite_session",

JSON.stringify(result.session)

);

}

if (result.access_token) {

localStorage.setItem(

"access_token",

result.access_token

);

}

if (result.refresh_token) {

localStorage.setItem(

"refresh_token",

result.refresh_token

);

}

/*
|--------------------------------------------------------------------------
| REDIRECT
|--------------------------------------------------------------------------
*/

setTimeout(() => {

window.location.href = "/dashboard/";

}, 1500);

} catch (error) {

hideLoading();

verifyOtpButton.disabled = false;

showError(

error.message ||

"Network error."

);

}

});

/*
|--------------------------------------------------------------------------
| FOOTER YEAR
|--------------------------------------------------------------------------
*/

const year = document.getElementById("year");

if (year) {

year.textContent = new Date().getFullYear();

}

console.log("SocialElite Signup Ready");
