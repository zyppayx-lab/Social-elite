// ======================================
// SocialElite
// verify-signup-otp.ts
// ======================================

const form = document.getElementById("verifyForm") as HTMLFormElement;

const otpInput = document.getElementById("otp") as HTMLInputElement;

const verifyButton = document.getElementById("verifyButton") as HTMLButtonElement;

const resendButton = document.getElementById("resendButton") as HTMLButtonElement;

const buttonText = document.getElementById("buttonText") as HTMLSpanElement;

const spinner = document.getElementById("loadingSpinner") as HTMLDivElement;

const successBox = document.getElementById("successMessage") as HTMLDivElement;

const errorBox = document.getElementById("errorMessage") as HTMLDivElement;


// CHANGE THIS LATER
const API_BASE =
"https://YOUR-PROJECT.supabase.co/functions/v1";


// ======================================
// HELPERS
// ======================================

function showLoading(){

verifyButton.disabled=true;

spinner.classList.remove("hidden");

buttonText.textContent="Verifying...";

}

function hideLoading(){

verifyButton.disabled=false;

spinner.classList.add("hidden");

buttonText.textContent="Verify Account";

}

function showError(message:string){

errorBox.classList.remove("hidden");

successBox.classList.add("hidden");

errorBox.textContent=message;

}

function showSuccess(message:string){

successBox.classList.remove("hidden");

errorBox.classList.add("hidden");

successBox.textContent=message;

}


// ======================================
// GET SIGNUP DATA
// ======================================

const savedData =
sessionStorage.getItem("signupData");

if(!savedData){

window.location.href=
"../signup/signup.html";

}

const signupData =
JSON.parse(savedData!);


// ======================================
// VERIFY OTP
// ======================================

form.addEventListener("submit",async(e)=>{

e.preventDefault();

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

const otp=otpInput.value.trim();

if(otp.length!==6){

showError("Enter a valid 6-digit OTP.");

return;

}

showLoading();

try{

const response=await fetch(

`${API_BASE}/verify-signup-otp`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email:signupData.email,

password:signupData.password,

otp:otp

})

}

);

const result=await response.json();

hideLoading();

if(!response.ok){

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


// Save session if returned

if(result.session){

localStorage.setItem(

"session",

JSON.stringify(result.session)

);

}

if(result.access_token){

localStorage.setItem(

"access_token",

result.access_token

);

}


// Remove cached signup info

sessionStorage.removeItem("signupData");

setTimeout(()=>{

window.location.href=
"../dashboard/index.html";

},1500);

}catch(error){

hideLoading();

showError("Unable to connect to the server.");

console.error(error);

}

});


// ======================================
// RESEND OTP
// ======================================

resendButton.addEventListener("click",async()=>{

try{

resendButton.disabled=true;

resendButton.textContent="Sending...";

const response=await fetch(

`${API_BASE}/send-signup-otp`,

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

showError(

result.message ||

result.error ||

"Unable to resend OTP."

);

}else{

showSuccess(

result.message ||

"OTP sent successfully."

);

}

}catch(error){

showError("Unable to connect to the server.");

console.error(error);

}

resendButton.disabled=false;

resendButton.textContent="Resend OTP";

});
