// Modal behavior: clone the target section into modal and show it
(function(){
  console.log('site.js loaded')
  function $all(s){return Array.from(document.querySelectorAll(s))}

  const overlay = document.getElementById('modal-overlay')
  const modalContent = document.getElementById('modal-content')
  const closeBtn = document.getElementById('modal-close')

  function openModal(id){
    console.log('openModal called for', id)
    const section = document.getElementById(id)
    if(!section){
      console.warn('openModal: no section with id', id)
      return
    }
    const clone = section.cloneNode(true)
    clone.classList.add('modal-clone')
    modalContent.innerHTML = ''
    modalContent.appendChild(clone)
    overlay.hidden = false
    overlay.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    closeBtn.focus()
  }

  function closeModal(){
    console.log('closeModal')
    overlay.hidden = true
    overlay.style.display = 'none'
    modalContent.innerHTML = ''
    document.body.style.overflow = ''
  }

  $all('[data-modal]').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault()
      const id = this.getAttribute('data-modal')
      openModal(id)
    })
  })

  if(overlay){
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal()
    })
  }
  if(closeBtn) closeBtn.addEventListener('click', closeModal)

  window.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay && !overlay.hidden) closeModal()
  })

  // Back to top behaviour — ensure button is appended to body and wired after DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    let backBtn = document.getElementById('back-to-top')
    if(!backBtn){
      backBtn = document.createElement('button')
      backBtn.id = 'back-to-top'
      backBtn.className = 'back-to-top'
      backBtn.title = 'Back to top'
      backBtn.setAttribute('aria-label','Back to top')
      backBtn.textContent = '↑'
      document.body.appendChild(backBtn)
    } else {
      // move into body to avoid being inside constrained containers
      if(backBtn.parentElement !== document.body) document.body.appendChild(backBtn)
    }

    function updateBackBtn(){
      if(window.scrollY > 220) backBtn.classList.add('show')
      else backBtn.classList.remove('show')
    }

    window.addEventListener('scroll', updateBackBtn, {passive:true})
    updateBackBtn()
    backBtn.addEventListener('click', function(){
      window.scrollTo({top:0,behavior:'smooth'})
    })
  })
})();
// ===== Product Catalog & Cart =====
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function loadProducts(){
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    if(data.success && data.products){
      products = data.products;
      renderProducts();
    }
  } catch(error){
    console.error('Failed to load products:', error);
    // Fallback to local products
    products = [
      {_id:'1', name:'iPhone 15 Pro', price:520000, stock:5},
      {_id:'2', name:'Samsung Galaxy S24', price:480000, stock:8},
      {_id:'3', name:'iPad Air', price:350000, stock:3},
      {_id:'4', name:'MacBook Air M3', price:1200000, stock:2},
      {_id:'5', name:'Sony WH-1000XM5', price:85000, stock:12},
      {_id:'6', name:'Google Pixel 8', price:420000, stock:6},
      {_id:'7', name:'Apple Watch Ultra', price:180000, stock:4},
      {_id:'8', name:'Samsung Tab S9', price:580000, stock:7},
      {_id:'9', name:'AirPods Pro Max', price:250000, stock:3},
      {_id:'10', name:'Nintendo Switch OLED', price:280000, stock:9},
      {_id:'11', name:'DJI Mini 4 Pro', price:450000, stock:2},
      {_id:'12', name:'Canon EOS R50', price:750000, stock:1}
    ];
    renderProducts();
  }
}

function renderProducts(){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <h4>${p.name}</h4>
      <div class="price">₦${p.price.toLocaleString()}</div>
      <div class="stock">${p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}</div>
      <button class="but" ${p.stock===0?'disabled':''} onclick="addToCart('${p._id || p.id}')">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(id){
  const product = products.find(p => (p._id || p.id) === id);
  if(!product || product.stock === 0) return;
  const existing = cart.find(c => (c._id || c.id) === id);
  if(existing && existing.qty < product.stock) existing.qty++;
  else if(!existing) cart.push({...product, qty:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}
function updateCartDisplay(){
  const count = document.getElementById('cart-count');
  if(count) count.textContent = cart.reduce((s,c) => s+c.qty, 0);
}
document.getElementById('view-cart-btn')?.addEventListener('click', function(){
  const checkoutSection = document.getElementById('checkout');
  if(!checkoutSection) return;
  const summary = document.getElementById('order-summary');
  let total = 0;
  const html = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `<div class="order-item"><span>${item.name} x${item.qty}</span><span>₦${subtotal.toLocaleString()}</span></div>`;
  }).join('') + `<div class="order-total"><span>Total:</span><span>₦${total.toLocaleString()}</span></div>`;
  summary.innerHTML = html || '<p>Your cart is empty</p>';
  checkoutSection.hidden = false;
  window.scrollTo({top:checkoutSection.offsetTop, behavior:'smooth'});
});
// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function(){
    const answer = this.nextElementSibling;
    const isOpen = !answer.hidden;
    document.querySelectorAll('.faq-answer').forEach(a => a.hidden = true);
    document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if(!isOpen){
      answer.hidden = false;
      this.setAttribute('aria-expanded', 'true');
    }
  });
});
// ===== Newsletter =====
document.getElementById('newsletter-form')?.addEventListener('submit', function(e){
  e.preventDefault();
  alert('Thank you for subscribing!');
  this.reset();
});
// ===== Appointments =====
document.getElementById('appointment-form')?.addEventListener('submit', function(e){
  e.preventDefault();
  alert('Your appointment has been booked! We will confirm shortly.');
  this.reset();
});
// ===== Checkout =====
document.getElementById('checkout-form')?.addEventListener('submit', async function(e){
  e.preventDefault();
  
  if(cart.length === 0){
    alert('Your cart is empty');
    return;
  }

  // Get form data
  const formData = new FormData(this);
  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const phone = this.querySelector('input[type="tel"]').value;
  const address = this.querySelector('textarea').value;
  const paymentMethod = formData.get('payment');

  // Prepare order data
  const orderData = {
    customer: {
      name,
      email,
      phone,
      address
    },
    items: cart.map(item => ({
      productId: item._id || item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty
    })),
    paymentMethod
  };

  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if(response.ok && data.success) {
      alert('✅ Order placed successfully!\nOrder #: ' + data.order.orderNumber + '\nTotal: ₦' + data.order.totalAmount.toLocaleString());
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      document.getElementById('checkout').hidden = true;
      this.reset();
    } else {
      alert('❌ Error: ' + (data.error || 'Failed to place order'));
    }
  } catch(error) {
    console.error('Order error:', error);
    alert('❌ Connection error: Make sure backend is running on http://localhost:5000');
  }
});

// Initialize
loadProducts();
updateCartDisplay();