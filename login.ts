// ======================================
// SocialElite Login
// login.ts
// ======================================

const form = document.getElementById("loginForm") as HTMLFormElement;

const emailInput = document.getElementById("email") as HTMLInputElement;

const passwordInput = document.getElementById("password") as HTMLInputElement;

const loginButton = document.getElementById("loginButton") as HTMLButtonElement;

const buttonText = document.getElementById("buttonText") as HTMLSpanElement;

const spinner = document.getElementById("loadingSpinner") as HTMLDivElement;

const successBox = document.getElementById("successMessage") as HTMLDivElement;

const errorBox = document.getElementById("errorMessage") as HTMLDivElement;

const togglePassword = document.getElementById("togglePassword") as HTMLButtonElement;



// ======================================
// CHANGE TO YOUR DOMAIN LATER
// ======================================

const API_BASE =
"https://YOUR-PROJECT.supabase.co/functions/v1";



// ======================================
// SHOW PASSWORD
// ======================================

togglePassword.addEventListener("click", () => {

if(passwordInput.type==="password"){

passwordInput.type="text";

togglePassword.textContent="🙈";

}else{

passwordInput.type="password";

togglePassword.textContent="👁";

}

});



// ======================================
// HELPERS
// ======================================

function showLoading(){

loginButton.disabled=true;

spinner.classList.remove("hidden");

buttonText.textContent="Signing In...";

}

function hideLoading(){

loginButton.disabled=false;

spinner.classList.add("hidden");

buttonText.textContent="Login";

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
// LOGIN
// ======================================

form.addEventListener("submit",async(e)=>{

e.preventDefault();

errorBox.classList.add("hidden");

successBox.classList.add("hidden");

const email=emailInput.value.trim();

const password=passwordInput.value;

if(email===""){

showError("Email is required.");

return;

}

if(password===""){

showError("Password is required.");

return;

}

showLoading();

try{

const response=await fetch(

`${API_BASE}/login`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

}

);

const result=await response.json();

hideLoading();

if(!response.ok){

showError(

result.message ||

result.error ||

"Login failed."

);

return;

}

showSuccess(

result.message ||

"Login successful."

);



// Save session

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



// Redirect

setTimeout(()=>{

window.location.href="../dashboard/index.html";

},1200);

}catch(error){

hideLoading();

showError(

"Unable to connect to the server."

);

console.error(error);

}

});
