
const cards = document.querySelectorAll('.benefit-card');
function animateCardsOnScroll() {
  const triggerBottom = window.innerHeight * 0.92;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      card.style.opacity = 1;
      card.style.transform = 'scale(1) translateY(0)';
    } else {
      card.style.opacity = 0.75;
      card.style.transform = 'scale(0.97) translateY(40px)';
    }
  });
}
window.addEventListener('scroll', animateCardsOnScroll);
window.addEventListener('resize', animateCardsOnScroll);
window.addEventListener('DOMContentLoaded', animateCardsOnScroll);


const cta = document.querySelector('.cta-btn');
cta.onclick = (e) => {
  e.preventDefault();
  window.location.href = "login.html";
}



document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;

  let index = 0;
  let interval;


  function cycleIcons() {
    
    items.forEach(item => item.classList.remove("focused"));

   
    const currentItem = items[index];
    currentItem.classList.add("focused");

    
    const itemCenter = currentItem.offsetLeft + currentItem.offsetWidth / 2;
    const panelWidth = document.querySelector(".icon-carousel-panel").offsetWidth;
    const offset = itemCenter - panelWidth / 2;

   
    index++;

   
    if (index === totalItems) {
      setTimeout(() => {
        
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        
        
        setTimeout(() => {
          track.style.transition = "transform 1s ease-in-out"; 
          index = 0; 
          cycleIcons(); 
        }, 100);
      }, 2000); 
    }
  }

 
  cycleIcons(); 
  interval = setInterval(cycleIcons, 2000); 
});



