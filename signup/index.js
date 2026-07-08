"use strict";

/*====================================================
SocialElite Signup
====================================================*/

const API =
"https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1";

/*====================================================
ENDPOINTS
====================================================*/

const SEND_SIGNUP_OTP =
`${API}/send-signup-otp`;

/*====================================================
ELEMENTS
====================================================*/

const form =
document.getElementById("signupForm");

const loading =
document.getElementById("loadingOverlay");

const submitButton =
document.getElementById("signupButton");

const errorBox =
document.getElementById("errorBox");

const successBox =
document.getElementById("successBox");

const password =
document.getElementById("password");

const confirmPassword =
document.getElementById("confirmPassword");

const strengthBar =
document.getElementById("strengthBar");

const strengthText =
document.getElementById("strengthText");

const passwordMatch =
document.getElementById("passwordMatch");

/*====================================================
HELPERS
====================================================*/

function showLoading(){

loading.classList.remove("hidden");

}

function hideLoading(){

loading.classList.add("hidden");

}

function showError(message){

errorBox.textContent = message;

errorBox.classList.remove("hidden");

successBox.classList.add("hidden");

}

function showSuccess(message){

successBox.textContent = message;

successBox.classList.remove("hidden");

errorBox.classList.add("hidden");

}

function clearMessages(){

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

}

/*====================================================
PASSWORD STRENGTH
====================================================*/

password.addEventListener("input",()=>{

let score = 0;

const value = password.value;

if(value.length >= 8) score++;

if(/[A-Z]/.test(value)) score++;

if(/[0-9]/.test(value)) score++;

if(/[!@#$%^&*]/.test(value)) score++;

const width = [
"0%",
"25%",
"50%",
"75%",
"100%"
];

const color = [
"#dc2626",
"#ea580c",
"#eab308",
"#22c55e",
"#16a34a"
];

const label = [
"Very Weak",
"Weak",
"Fair",
"Strong",
"Excellent"
];

strengthBar.style.width = width[score];

strengthBar.style.background = color[score];

strengthText.textContent = label[score];

});

/*====================================================
PASSWORD MATCH
====================================================*/

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

passwordMatch.style.color="#dc2626";

}

});

/*====================================================
SHOW PASSWORD
====================================================*/

document
.getElementById("togglePassword")
.onclick=function(){

password.type=
password.type==="password"
?"text"
:"password";

this.textContent=
password.type==="password"
?"Show"
:"Hide";

};

document
.getElementById("toggleConfirmPassword")
.onclick=function(){

confirmPassword.type=
confirmPassword.type==="password"
?"text"
:"password";

this.textContent=
confirmPassword.type==="password"
?"Show"
:"Hide";

};
/*====================================================
SUBMIT SIGNUP
====================================================*/

form.addEventListener("submit", async (e) => {

e.preventDefault();

clearMessages();

const fullName =
document.getElementById("fullName").value.trim();

const email =
document.getElementById("email").value.trim().toLowerCase();

const passwordValue =
password.value;

const confirmValue =
confirmPassword.value;

const referralCode =
document.getElementById("referralCode").value.trim();

const agree =
document.getElementById("agreeTerms").checked;

if(fullName.length < 2){

showError("Please enter your full name.");

return;

}

if(email===""){

showError("Email address is required.");

return;

}

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){

showError("Please enter a valid email address.");

return;

}

if(passwordValue.length < 8){

showError("Password must be at least 8 characters.");

return;

}

if(passwordValue !== confirmValue){

showError("Passwords do not match.");

return;

}

if(!agree){

showError("You must agree to the Terms and Privacy Policy.");

return;

}

submitButton.disabled = true;

showLoading();

try{

const response = await fetch(
SEND_SIGNUP_OTP,
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email,

referral_code:
referralCode || null

})

}
);

const result = await response.json();

if(!response.ok){

throw new Error(

result.error ||

result.message ||

"Unable to send OTP."

);

}

sessionStorage.setItem(

"signupData",

JSON.stringify({

fullName,

email,

password:passwordValue,

referralCode

})

);

showSuccess(

result.message ||

"OTP sent successfully."

);

setTimeout(()=>{

window.location.href =
"/verify-signup/";

},1000);

}catch(error){

showError(

error.message ||

"Something went wrong."

);

}finally{

hideLoading();

submitButton.disabled = false;

}

});
