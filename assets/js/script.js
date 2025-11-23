// Theme toggle (light/dark)
(function(){
  const body = document.body;
  const stored = localStorage.getItem('bgTheme');
  if(stored) body.className = stored;
  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    if(body.classList.contains('theme--dark')){
      body.classList.remove('theme--dark');
      body.classList.add('theme--light');
      localStorage.setItem('bgTheme','theme--light');
    } else {
      body.classList.remove('theme--light');
      body.classList.add('theme--dark');
      localStorage.setItem('bgTheme','theme--dark');
    }
  });
})();

// Burger menu
(function(){
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger && burger.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
})();

// Simple slider
(function(){
  const slider = document.getElementById('slider');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let idx = 0;
  function show(i){
    slides.forEach((s, j) => s.style.display = (j===i) ? 'flex' : 'none');
  }
  show(idx);
  prev.addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; show(idx); });
  next.addEventListener('click', ()=>{ idx = (idx+1)%slides.length; show(idx); });
  // autoplay
  setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000);
})();

// Modal handling
function openModal(name){
  const el = document.getElementById(name+'-modal');
  if(!el) return;
  el.style.display='flex';
  el.setAttribute('aria-hidden','false');
}
function closeModal(name){
  const el = document.getElementById(name+'-modal');
  if(!el) return;
  el.style.display='none';
  el.setAttribute('aria-hidden','true');
}
document.addEventListener('click', (e) => {
  if(e.target.classList && e.target.classList.contains('modal-bg')){
    e.target.style.display='none';
    e.target.setAttribute('aria-hidden','true');
  }
});

// Profile button shows preview section on small screens or opens modal on desktop
(function(){
  const profileBtn = document.getElementById('profileBtn');
  const preview = document.getElementById('profilePreview');
  profileBtn && profileBtn.addEventListener('click', ()=>{
    const mq = window.matchMedia('(max-width: 768px)');
    if(mq.matches){
      // on mobile toggle preview panel
      preview.style.display = preview.style.display === 'block' ? 'none' : 'block';
    } else {
      // on desktop open modal login
      openModal('login');
    }
  });
})();

// Simple search filter (client-side)
(function(){
  const search = document.getElementById('search');
  const grid = document.getElementById('gamesGrid');
  if(!search) return;
  search.addEventListener('input', ()=> {
    const q = search.value.toLowerCase().trim();
    Array.from(grid.children).forEach(card => {
      const title = card.querySelector('.game-card__title').textContent.toLowerCase();
      card.style.display = title.includes(q) ? '' : 'none';
    });
  });
})();

// Dummy auth actions (for demo)
function doLogin(){
  closeModal('login');
  alert('Вход: (демо) — дальше можно подключить реальный бекенд');
}
function doRegister(){
  closeModal('register');
  alert('Регистрация: (демо) — профиль сохранён локально');
}

// Корзина как массив
let cart = [];

// Делегирование событий для кнопок "Купить"
document.addEventListener("click", function(e) {
  if(e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".game-card");
    if(!card) return;

    const title = card.querySelector(".game-card__title").textContent;
    const priceText = card.querySelector(".price").textContent;
    const price = parseInt(priceText.replace("₽","").trim());
    const img = card.querySelector(".game-card__img").src;

    // Добавляем товар в корзину
    cart.push({ title, price, img });
    updateCart();
  }
});

// Обновление корзины на странице
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "12px";

    // Контейнер для мини-логотипа и названия
    const itemContainer = document.createElement("div");
    itemContainer.style.display = "flex";
    itemContainer.style.alignItems = "center";
    itemContainer.style.gap = "8px";

    const img = document.createElement("img");
    img.src = item.img;
    img.style.width = "40px";
    img.style.height = "40px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";

    const text = document.createElement("span");
    text.textContent = item.title;

    itemContainer.appendChild(img);
    itemContainer.appendChild(text);
    li.appendChild(itemContainer);

    // Кнопка удалить
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "none";
    removeBtn.style.color = "var(--accent-2)";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    total += item.price;
  });

  cartTotal.textContent = total;
}

// Кнопка оформить заказ
document.getElementById("checkout-btn").addEventListener("click", () => {
  if(cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }
  alert(`Вы оформили заказ на ${cart.length} товаров на сумму ${cart.reduce((a,b)=>a+b.price,0)}₽`);
  cart = [];
  updateCart();
});
