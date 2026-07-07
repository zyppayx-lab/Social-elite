// ======================================
// SocialElite
// forgot-password.ts
// ======================================

const form = document.getElementById("forgotForm") as HTMLFormElement;

const emailInput = document.getElementById("email") as HTMLInputElement;

const sendButton = document.getElementById("sendButton") as HTMLButtonElement;

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

sendButton.disabled = true;

spinner.classList.remove("hidden");

buttonText.textContent = "Sending...";

}

function hideLoading(){

sendButton.disabled = false;

spinner.classList.add("hidden");

buttonText.textContent = "Send OTP";

}

function showError(message:string){

errorBox.classList.remove("hidden");

successBox.classList.add("hidden");

errorBox.textContent = message;

}

function showSuccess(message:string){

successBox.classList.remove("hidden");

errorBox.classList.add("hidden");

successBox.textContent = message;

}


// ======================================
// SEND RESET OTP
// ======================================

form.addEventListener("submit",async(e)=>{

e.preventDefault();

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

const email = emailInput.value.trim();

if(email===""){

showError("Email is required.");

return;

}

showLoading();

try{

const response = await fetch(

`${API_BASE}/forgot-password`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email

})

}

);

const result = await response.json();

hideLoading();

if(!response.ok){

showError(

result.error ||

result.message ||

"Unable to send OTP."

);

return;

}


// Save email for reset page

sessionStorage.setItem(

"resetPasswordEmail",

email

);

showSuccess(

result.message ||

"Password reset OTP sent."

);

setTimeout(()=>{

window.location.href=

"../reset-password/reset-password.html";

},1200);

}catch(error){

hideLoading();

showError(

"Unable to connect to the server."

);

console.error(error);

}

});
