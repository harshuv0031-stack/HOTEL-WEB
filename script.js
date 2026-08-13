
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loading");

  const loader = document.querySelector(".loader");
  setTimeout(() => {
    loader?.classList.add("hide");
    document.body.classList.remove("loading");
  }, 900);

  const nav = document.querySelector(".nav");
  const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  const menuBtn = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  menuBtn?.addEventListener("click", () => mobileMenu?.classList.toggle("open"));
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  reveals.forEach(el => observer.observe(el));

  document.querySelectorAll("[data-parallax]").forEach(el => {
    window.addEventListener("scroll", () => {
      const r = el.getBoundingClientRect();
      if(r.bottom > 0 && r.top < innerHeight) {
        el.style.transform = `translateY(${(innerHeight/2-r.top)*0.035}px) scale(1.04)`;
      }
    }, {passive:true});
  });

  document.querySelectorAll(".current-year").forEach(el => el.textContent = new Date().getFullYear());

  // Booking room query string
  const params = new URLSearchParams(location.search);
  const room = params.get("room");
  const roomInput = document.querySelector("#room");
  if(room && roomInput){
    const map = {
      deluxe:"The Deluxe", garden:"The Garden", "mountain-suite":"The Mountain Suite",
      "pool-suite":"The Pool Suite", residence:"The Residence", villa:"The Villa"
    };
    roomInput.value = map[room] || room;
  }

  // Demo booking form: UI only, no backend required.
  const form = document.querySelector("[data-booking-form]");
  const notice = document.querySelector(".notice");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    if(notice){
      notice.textContent = "Thank you. Your reservation request has been received. Our team will contact you shortly.";
      notice.classList.add("show","success");
    }
    form.reset();
    if(room && roomInput) roomInput.value = roomInput.dataset.default || "";
  });

  // Contact form demo
  const contactForm = document.querySelector("[data-contact-form]");
  const contactNotice = document.querySelector("[data-contact-notice]");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!contactForm.checkValidity()){ contactForm.reportValidity(); return; }
    contactNotice?.classList.add("show");
    contactForm.reset();
  });
});

// ===== CINEMATIC MOTION UPGRADE =====
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * .16;
    const y = (e.clientY - r.top - r.height/2) * .16;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
});

document.querySelectorAll("video").forEach(video => {
  video.addEventListener("loadeddata", () => video.classList.add("ready"));
  video.play().catch(() => {});
});

/* =========================================================
   GENERATE PREMIUM STARFIELD
========================================================= */
const hero = document.querySelector(".hero");
if (hero && !hero.querySelector(".starfield")) {
  const field = document.createElement("div");
  field.className = "starfield";
  const total = window.innerWidth < 700 ? 85 : 150;

  for(let i=0;i<total;i++){
    const star = document.createElement("span");
    star.className = "star" + (Math.random() > .88 ? " gold" : "") + (Math.random() > .94 ? " big" : "");
    star.style.left = (Math.random()*100) + "%";
    star.style.top = (Math.random()*100) + "%";
    star.style.setProperty("--s", (Math.random()*2 + .7) + "px");
    star.style.setProperty("--d", (Math.random()*3 + 2) + "s");
    star.style.setProperty("--delay", (-Math.random()*5) + "s");
    field.appendChild(star);
  }

  for(let i=0;i<3;i++){
    const meteor = document.createElement("span");
    meteor.className = "shooting-star s" + (i+1);
    meteor.style.left = (20 + Math.random()*65) + "%";
    meteor.style.top = (8 + Math.random()*35) + "%";
    meteor.style.animationDelay = (Math.random()*6) + "s";
    field.appendChild(meteor);
  }

  hero.appendChild(field);
}

/* Extra pointer movement on the booking CTA */
document.querySelectorAll(".book-btn").forEach(btn=>{
  btn.addEventListener("mouseenter",()=>btn.classList.add("booking-hover"));
  btn.addEventListener("mouseleave",()=>btn.classList.remove("booking-hover"));
});

/* =========================================================
   ROTATING HERO WORDS
========================================================= */
(function(){
  const words = document.querySelectorAll(".rotating-word");
  if(!words.length) return;

  let current = 0;
  const interval = 2600;
  const changeWord = () => {
    const oldWord = words[current];
    current = (current + 1) % words.length;
    const newWord = words[current];

    oldWord.classList.remove("is-active");
    oldWord.classList.add("is-leaving");

    newWord.classList.remove("is-leaving");
    newWord.classList.add("is-active");

    setTimeout(() => oldWord.classList.remove("is-leaving"), 900);
  };

  setInterval(changeWord, interval);
})();


/* =========================================================
   QUICK BOOKING — ALL STAY / BOOKING BUTTONS
========================================================= */
(function(){
  const section=document.getElementById("quick-booking");
  const checkIn=document.getElementById("quickCheckIn");
  const checkOut=document.getElementById("quickCheckOut");
  const persons=document.getElementById("quickPersons");
  const days=document.getElementById("quickDays");
  const bookBtn=document.getElementById("quickBookBtn");
  if(!section||!checkIn||!checkOut||!persons||!days||!bookBtn)return;

  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const today=new Date();
  checkIn.min=iso(today);

  function updateDays(){
    if(!checkIn.value||!checkOut.value){days.value="—";return;}
    const a=new Date(checkIn.value+"T00:00:00");
    const b=new Date(checkOut.value+"T00:00:00");
    const n=Math.round((b-a)/86400000);
    days.value=n>0?`${n} ${n===1?"Day":"Days"}`:"—";
  }
  checkIn.addEventListener("change",()=>{
    const d=new Date(checkIn.value+"T00:00:00");
    d.setDate(d.getDate()+1);
    checkOut.min=iso(d);
    if(checkOut.value && new Date(checkOut.value+"T00:00:00")<=new Date(checkIn.value+"T00:00:00")) checkOut.value="";
    updateDays();
  });
  checkOut.addEventListener("change",updateDays);

  // Any BOOK/RESERVE link on any page points here; on Home, scroll smoothly.
  document.querySelectorAll('a[href="#quick-booking"]').forEach(a=>{
    a.addEventListener("click",e=>{
      e.preventDefault();
      section.scrollIntoView({behavior:"smooth",block:"center"});
      setTimeout(()=>checkIn.focus(),650);
    });
  });

  bookBtn.addEventListener("click",()=>{
  if(!checkIn.value){
    alert("Please fill information");
    checkIn.focus();
    return;
  }

  if(!checkOut.value){
    alert("Please fill information");
    checkOut.focus();
    return;
  }

  const a=new Date(checkIn.value+"T00:00:00");
  const b=new Date(checkOut.value+"T00:00:00");
  const n=Math.round((b-a)/86400000);

  if(n<=0){
    alert("Please fill information");
    checkOut.focus();
    return;
  }

  updateDays();
  showBookingSuccess(n);
});

  function showBookingSuccess(n){
    let overlay=document.getElementById("bookingSuccessOverlay");
    if(!overlay){
      overlay=document.createElement("div");
      overlay.id="bookingSuccessOverlay";
      overlay.className="booking-success-overlay";
      overlay.innerHTML=`<div class="booking-success-card">
        <button class="booking-success-close" aria-label="Close">×</button>
        <div class="booking-success-check">✓</div>
        <div class="booking-success-kicker">VELORA HOTEL & RESORT</div>
        <h3>Booking Confirmed</h3>
        <p class="booking-success-text">Your stay request has been received successfully.</p>
        <div class="booking-summary">
          <div><span>CHECK-IN</span><strong class="bs-in"></strong></div>
          <div><span>CHECK-OUT</span><strong class="bs-out"></strong></div>
          <div><span>GUESTS</span><strong class="bs-guests"></strong></div>
          <div><span>STAY</span><strong class="bs-days"></strong></div>
        </div>
        <button class="booking-success-ok">DONE</button>
      </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector(".booking-success-close").onclick=close;
      overlay.querySelector(".booking-success-ok").onclick=close;
      overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
    }
    const nice=v=>new Date(v+"T00:00:00").toLocaleDateString(undefined,{day:"2-digit",month:"short",year:"numeric"});
    overlay.querySelector(".bs-in").textContent=nice(checkIn.value);
    overlay.querySelector(".bs-out").textContent=nice(checkOut.value);
    overlay.querySelector(".bs-guests").textContent=persons.value;
    overlay.querySelector(".bs-days").textContent=`${n} ${n===1?"Day":"Days"}`;
    overlay.classList.add("show");
    document.body.classList.add("booking-modal-open");
  }
  function close(){
    const o=document.getElementById("bookingSuccessOverlay");
    if(o)o.classList.remove("show");
    document.body.classList.remove("booking-modal-open");
  }
})();

/* When another page links to index.html#quick-booking, open the bar after load. */
(function(){
  if(location.hash!=="#quick-booking")return;
  const target=document.getElementById("quick-booking");
  if(!target)return;
  window.addEventListener("load",()=>setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"center"}),150));
})();
