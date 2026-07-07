// ======================================
// SocialElite Signup
// signup.ts
// ======================================

const form = document.getElementById("signupForm") as HTMLFormElement;

const fullName = document.getElementById("fullName") as HTMLInputElement;
const username = document.getElementById("username") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;
const referralCode = document.getElementById("referralCode") as HTMLInputElement;
const terms = document.getElementById("terms") as HTMLInputElement;

const signupButton = document.getElementById("signupButton") as HTMLButtonElement;
const buttonText = document.getElementById("buttonText") as HTMLSpanElement;
const spinner = document.getElementById("loadingSpinner") as HTMLDivElement;

const successBox = document.getElementById("successMessage") as HTMLDivElement;
const errorBox = document.getElementById("errorMessage") as HTMLDivElement;

const togglePassword =
document.getElementById("togglePassword") as HTMLButtonElement;

const toggleConfirmPassword =
document.getElementById("toggleConfirmPassword") as HTMLButtonElement;


// CHANGE LATER
const API_BASE =
"https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1";


// ======================================
// PASSWORD TOGGLE
// ======================================

togglePassword.onclick = () => {

password.type =
password.type === "password"
? "text"
: "password";

};

toggleConfirmPassword.onclick = () => {

confirmPassword.type =
confirmPassword.type === "password"
? "text"
: "password";

};


// ======================================
// HELPERS
// ======================================

function showLoading(){

signupButton.disabled=true;

spinner.classList.remove("hidden");

buttonText.textContent="Creating...";

}

function hideLoading(){

signupButton.disabled=false;

spinner.classList.add("hidden");

buttonText.textContent="Create Account";

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
// SIGNUP
// ======================================

form.addEventListener("submit",async(e)=>{

e.preventDefault();

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

if(fullName.value.trim()===""){

showError("Full name is required.");

return;

}

if(username.value.trim()===""){

showError("Username is required.");

return;

}

if(email.value.trim()===""){

showError("Email is required.");

return;

}

if(password.value===""){

showError("Password is required.");

return;

}

if(password.value.length<8){

showError("Password must be at least 8 characters.");

return;

}

if(password.value!==confirmPassword.value){

showError("Passwords do not match.");

return;

}

if(!terms.checked){

showError("Please accept the Terms & Conditions.");

return;

}

showLoading();

try{

const response=await fetch(

`$https://dohxtukzxopwkvxeppdl.supabase.co/functions/v1/send-signup-otp`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email:email.value.trim(),

referral_code:

referralCode.value.trim() || null

})

}

);

const result=await response.json();

hideLoading();

if(!response.ok){

showError(

result.message ||

result.error ||

"Signup failed."

);

return;

}


// Save user data for OTP verification

sessionStorage.setItem(

"signupData",

JSON.stringify({

fullName:fullName.value,

username:username.value,

email:email.value,

password:password.value,

referralCode:referralCode.value

})

);

showSuccess(

result.message ||

"OTP sent successfully."

);

setTimeout(()=>{

window.location.href=

"../verify-signup-otp/verify-signup-otp.html";

},1200);

}catch(error){

hideLoading();

showError(

"Unable to connect to the server."

);

console.error(error);

}

});
