/* Pizza House — edit the CONFIG and PRODUCTS below to customize this demo. */
const CONFIG = {
  restaurantName: 'Pizza House',
  // Replace with the restaurant's WhatsApp number, including country code, digits only.
  // Example Egypt: 201012345678
  whatsappNumber: '201023713311',
  deliveryFee: 20,
  currency: 'EGP'
};

const PRODUCTS = [
  { id: 1, name: 'Margherita', category: 'Classic', price: 180, description: 'Tomato, mozzarella, fresh basil, extra virgin olive oil.', tag: 'The classic', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Pepperoni Heat', category: 'Classic', price: 230, description: 'Pepperoni, mozzarella, rich tomato sauce, a little heat.', tag: 'Fan favorite', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Four Cheese', category: 'Signature', price: 250, description: 'A delicious blend of mozzarella, parmesan, cheddar and blue cheese.', tag: 'Cheese lover', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Garden Party', category: 'Veggie', price: 200, description: 'Bell peppers, mushrooms, olives, red onion and mozzarella.', tag: 'Plant-powered', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'BBQ Chicken', category: 'Signature', price: 260, description: 'Smoky BBQ chicken, red onion, mozzarella and fresh herbs.', tag: 'House signature', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Hot Honey', category: 'Signature', price: 245, description: 'Golden crust, mozzarella, spicy salami and a sweet honey finish.', tag: 'A little bold', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=85' }
];

const state = { cart: [], category: 'All' };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (amount) => `${CONFIG.currency} ${Number(amount).toLocaleString('en-US')}`;

function renderProducts() {
  const shown = state.category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === state.category);
  $('#menuCount').textContent = `${String(shown.length).padStart(2, '0')} PIZZAS`;
  $('#productGrid').innerHTML = shown.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 70}ms">
      <div class="product-photo"><img src="${product.image}" alt="${product.name} pizza" loading="lazy"><span class="product-tag">${product.tag}</span></div>
      <div class="product-info"><div class="product-top"><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
      <p>${product.description}</p><button class="add-button" data-add="${product.id}">Add to your order <span>＋</span></button></div>
    </article>`).join('');
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) return;
  const existing = state.cart.find(item => item.id === product.id);
  existing ? existing.quantity++ : state.cart.push({ ...product, quantity: 1 });
  renderCart(); showToast(`${product.name} added to your order`);
}
function changeQuantity(id, amount) {
  const item = state.cart.find(p => p.id === Number(id));
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) state.cart = state.cart.filter(p => p.id !== Number(id));
  renderCart();
}
function subtotal() { return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  $('#cartCount').textContent = count;
  const hasItems = state.cart.length > 0;
  $('#cartCheckout').hidden = !hasItems;
  if (!hasItems) {
    $('#cartItems').innerHTML = `<div class="empty-cart"><span>＋</span><h3>Your next favorite is waiting.</h3><p>Add a pizza to get started.</p><button class="button button-blue" id="browseMenu">Browse menu →</button></div>`;
    $('#cartSubtotal').textContent = money(0);
    $('#deliveryCost').textContent = money(CONFIG.deliveryFee);
    $('#cartTotal').textContent = money(CONFIG.deliveryFee);
    return;
  }
  $('#cartItems').innerHTML = state.cart.map(item => `
    <div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h4>${item.name}</h4><div class="cart-item-price">${money(item.price)} each</div><div class="quantity-control"><button data-quantity="${item.id}" data-change="-1" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-quantity="${item.id}" data-change="1" aria-label="Increase ${item.name}">＋</button></div></div><button class="remove-item" data-quantity="${item.id}" data-change="-${item.quantity}" aria-label="Remove ${item.name}">×</button></div>`).join('');
  $('#cartSubtotal').textContent = money(subtotal());
  $('#deliveryCost').textContent = money(CONFIG.deliveryFee);
  $('#cartTotal').textContent = money(subtotal() + CONFIG.deliveryFee);
}
function openCart() { $('#cartDrawer').classList.add('open'); $('#cartBackdrop').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
function closeCart() { $('#cartDrawer').classList.remove('open'); $('#cartBackdrop').classList.remove('open'); $('#cartDrawer').setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
let toastTimer;
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }

$('#productGrid').addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (button) addToCart(button.dataset.add); });
$('#categoryFilters').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; state.category = button.dataset.category; $$('#categoryFilters .filter').forEach(filter => filter.classList.toggle('active', filter === button)); renderProducts(); });
$('#cartItems').addEventListener('click', event => { const button = event.target.closest('[data-quantity]'); if (button) changeQuantity(button.dataset.quantity, Number(button.dataset.change)); if (event.target.closest('#browseMenu')) { closeCart(); $('#menu').scrollIntoView({ behavior: 'smooth' }); } });
$('#openCart').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#cartBackdrop').addEventListener('click', closeCart);
$('#menuToggle').addEventListener('click', () => { const nav = $('#navLinks'); const isOpen = nav.classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(isOpen)); $('#menuToggle').textContent = isOpen ? '×' : '☰'; });
$$('#navLinks a').forEach(link => link.addEventListener('click', () => { $('#navLinks').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded', 'false'); $('#menuToggle').textContent = '☰'; }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
$('#checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  if (!state.cart.length) return showToast('Add a pizza before checking out.');
  const name = $('#customerName').value.trim();
  const phone = $('#customerPhone').value.trim();
  const address = $('#customerAddress').value.trim();
  const notes = $('#customerNotes').value.trim();
  if (!name || !phone || !address) return showToast('Please complete your contact and delivery details.');
  const lines = state.cart.map(item => `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`);
  const message = [
    `🍕 *New order — ${CONFIG.restaurantName}*`, '', `*Customer:* ${name}`, `*Phone:* ${phone}`, `*Address:* ${address}`, '', '*Order:*', ...lines, '', `*Subtotal:* ${money(subtotal())}`, `*Delivery:* ${money(CONFIG.deliveryFee)}`, `*Total:* ${money(subtotal() + CONFIG.deliveryFee)}`, notes ? `*Notes:* ${notes}` : '', '', 'Please confirm my order.'
  ].filter(Boolean).join('\n');
  if (!/^\d{10,15}$/.test(CONFIG.whatsappNumber)) { showToast('Set a valid WhatsApp number in script.js first.'); return; }
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

$('#year').textContent = new Date().getFullYear();
renderProducts(); renderCart();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
  $$('.reveal').forEach(element => observer.observe(element));
} else { $$('.reveal').forEach(element => element.classList.add('visible')); }
