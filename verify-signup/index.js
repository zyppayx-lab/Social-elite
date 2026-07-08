"use strict";

/*==================================================
SocialElite Verify Signup
==================================================*/

const API =
"https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1";

const VERIFY_SIGNUP =
`${API}/verify-signup-otp`;

const RESEND_SIGNUP =
`${API}/send-signup-otp`;

/*==================================================
ELEMENTS
==================================================*/

const verifyForm =
document.getElementById("verifyForm");

const verifyButton =
document.getElementById("verifyButton");

const loading =
document.getElementById("loadingOverlay");

const errorBox =
document.getElementById("errorBox");

const successBox =
document.getElementById("successBox");

const resendButton =
document.getElementById("resendOtp");

const emailLabel =
document.getElementById("userEmail");

const otpInputs =
document.querySelectorAll(".otp-input");

/*==================================================
LOAD SIGNUP DATA
==================================================*/

const signupData = JSON.parse(
sessionStorage.getItem("signupData") || "{}"
);

if(!signupData.email){

window.location.href="/signup/";

}

emailLabel.textContent =
signupData.email;

/*==================================================
HELPERS
==================================================*/

function showLoading(){

loading.classList.remove("hidden");

}

function hideLoading(){

loading.classList.add("hidden");

}

function showError(message){

errorBox.textContent=message;

errorBox.classList.remove("hidden");

successBox.classList.add("hidden");

}

function showSuccess(message){

successBox.textContent=message;

successBox.classList.remove("hidden");

errorBox.classList.add("hidden");

}

function clearMessages(){

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

}

/*==================================================
AUTO YEAR
==================================================*/

const year =
document.getElementById("year");

if(year){

year.textContent =
new Date().getFullYear();

}

/*==================================================
OTP AUTO MOVE
==================================================*/

otpInputs.forEach((input,index)=>{

input.addEventListener("input",()=>{

input.value =
input.value.replace(/\D/g,"");

if(input.value && index<otpInputs.length-1){

otpInputs[index+1].focus();

}

});

input.addEventListener("keydown",(e)=>{

if(
e.key==="Backspace" &&
!input.value &&
index>0
){

otpInputs[index-1].focus();

}

});

input.addEventListener("paste",(e)=>{

e.preventDefault();

const code =
(e.clipboardData || window.clipboardData)
.getData("text")
.replace(/\D/g,"")
.substring(0,6);

code.split("").forEach((digit,i)=>{

if(otpInputs[i]){

otpInputs[i].value=digit;

}

});

});

});
/*==================================================
VERIFY ACCOUNT
==================================================*/

verifyForm.addEventListener("submit", async (e)=>{

e.preventDefault();

clearMessages();

const otp =
[...otpInputs]
.map(input=>input.value.trim())
.join("");

if(otp.length!==6){

showError("Please enter the 6-digit OTP.");

return;

}

verifyButton.disabled=true;

showLoading();

try{

const response=await fetch(

VERIFY_SIGNUP,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body: JSON.stringify({
    email: signupData.email,
    password: signupData.password,
    otp: otp
})

}

);

const result=await response.json();

if(!response.ok){

throw new Error(

result.error ||

result.message ||

"Verification failed."

);

}

showSuccess(

result.message ||

"Account created successfully."

);

/* Save session if returned */

if(result.session){

localStorage.setItem(

"session",

JSON.stringify(result.session)

);

}

if(result.user){

localStorage.setItem(

"user",

JSON.stringify(result.user)

);

}

/* Clear temporary signup data */

sessionStorage.removeItem("signupData");

setTimeout(()=>{

window.location.href="/dashboard/";

},1200);

}catch(err){

showError(

err.message ||

"Unable to verify account."

);

}finally{

hideLoading();

verifyButton.disabled=false;

}

});

/*==================================================
RESEND OTP
==================================================*/

resendButton.addEventListener("click",async()=>{

clearMessages();

showLoading();

resendButton.disabled=true;

try{

const response=await fetch(

RESEND_SIGNUP,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email:signupData.email,

referral_code:

signupData.referralCode || null

})

}

);

const result=await response.json();

if(!response.ok){

throw new Error(

result.error ||

result.message ||

"Unable to resend OTP."

);

}

showSuccess(

result.message ||

"OTP sent successfully."

);

}catch(err){

showError(

err.message ||

"Unable to resend OTP."

);

}finally{

hideLoading();

resendButton.disabled=false;

}

});
