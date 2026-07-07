/* =====================================
SOCIALELITE LANDING PAGE
index.js
===================================== */

"use strict";

/* ===========================
ELEMENTS
=========================== */

const header = document.querySelector(".header");

const menuToggle = document.querySelector(".menu-toggle");

const mobileMenu = document.querySelector(".mobile-menu");

const navLinks = document.querySelectorAll("a[href^='#']");

const stats = document.querySelectorAll(".stat-card h2");

const year = document.getElementById("year");

const faqItems = document.querySelectorAll(".faq-item");

/* ===========================
CURRENT YEAR
=========================== */

if (year) {

year.textContent = new Date().getFullYear();

}

/* ===========================
MOBILE MENU
=========================== */

if (menuToggle && mobileMenu) {

menuToggle.addEventListener("click", () => {

mobileMenu.classList.toggle("active");

});

}

/* ===========================
CLOSE MOBILE MENU
=========================== */

document.querySelectorAll(".mobile-menu a").forEach(link => {

link.addEventListener("click", () => {

mobileMenu.classList.remove("active");

});

});

/* ===========================
STICKY HEADER
=========================== */

window.addEventListener("scroll", () => {

if (window.scrollY > 50) {

header.style.background = "#08101bcc";

header.style.backdropFilter = "blur(20px)";

header.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

}

else {

header.style.background = "rgba(8,11,18,.95)";

header.style.boxShadow = "none";

}

});

/* ===========================
SMOOTH SCROLL
=========================== */

navLinks.forEach(link => {

link.addEventListener("click", e => {

const id = link.getAttribute("href");

if (!id.startsWith("#")) return;

const target = document.querySelector(id);

if (!target) return;

e.preventDefault();

target.scrollIntoView({

behavior: "smooth"

});

});

});

/* ===========================
ACTIVE NAVIGATION
=========================== */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const top = section.offsetTop - 120;

const height = section.offsetHeight;

if (scrollY >= top && scrollY < top + height) {

current = section.getAttribute("id");

}

});

document.querySelectorAll(".navbar a").forEach(link => {

link.classList.remove("active");

if (link.getAttribute("href") === "#" + current) {

link.classList.add("active");

}

});

});

/* ===========================
STATISTICS COUNTER
=========================== */

let counted = false;

function animateCounter() {

stats.forEach(stat => {

const target = Number(

stat.textContent.replace(/\D/g, "")

);

if (!target) return;

let count = 0;

const speed = target / 80;

const update = () => {

count += speed;

if (count < target) {

stat.textContent = Math.floor(count).toLocaleString() + "+";

requestAnimationFrame(update);

}

else {

stat.textContent = target.toLocaleString() + "+";

}

};

update();

});

}

window.addEventListener("scroll", () => {

const statsSection = document.querySelector(".stats");

if (!statsSection || counted) return;

const top = statsSection.getBoundingClientRect().top;

if (top < window.innerHeight - 100) {

counted = true;

animateCounter();

}

});

/* ===========================
FAQ ACCORDION
=========================== */

faqItems.forEach(item => {

const answer = item.querySelector("p");

answer.style.display = "none";

item.addEventListener("click", () => {

const open = answer.style.display === "block";

faqItems.forEach(f => {

f.querySelector("p").style.display = "none";

});

answer.style.display = open ? "none" : "block";

});

});

/* ===========================
SCROLL REVEAL
=========================== */

const revealItems = document.querySelectorAll(

".feature-card,.category-card,.step,.testimonial-card,.blog-card,.contact-grid div,.stat-card"

);

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if (entry.isIntersecting) {

entry.target.style.opacity = "1";

entry.target.style.transform = "translateY(0)";

}

});

}, {

threshold: .15

});

revealItems.forEach(item => {

item.style.opacity = "0";

item.style.transform = "translateY(40px)";

item.style.transition = ".6s";

observer.observe(item);

});

/* ===========================
BACK TO TOP BUTTON
=========================== */

const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

topBtn.className = "back-to-top";

document.body.appendChild(topBtn);

Object.assign(topBtn.style, {

position: "fixed",

right: "25px",

bottom: "25px",

width: "50px",

height: "50px",

borderRadius: "50%",

border: "none",

background: "#3b82f6",

color: "#fff",

fontSize: "20px",

cursor: "pointer",

display: "none",

zIndex: "999"

});

window.addEventListener("scroll", () => {

topBtn.style.display = window.scrollY > 500 ? "block" : "none";

});

topBtn.addEventListener("click", () => {

window.scrollTo({

top: 0,

behavior: "smooth"

});

});

console.log("SocialElite Landing Page Loaded Successfully");
