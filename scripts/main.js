/* ==========================================================================
   Adurite Digital Store - Core Application Logic
   ========================================================================== */

const PRODUCTS_DATA = [
  {
    id: "temp-saas",
    name: "Apex SaaS Landing Page UI Kit",
    category: "design",
    format: "Figma + HTML5",
    license: "Commercial",
    price: 29.00,
    rating: 4.9,
    reviews: 84,
    icon: "🎨",
    description: "Responsive dark and light mode UI kit engineered for modern SaaS applications.",
    features: [
      "Auto-layout Figma components",
      "Tailwind CSS v4 & Vanilla CSS sources",
      "Includes 18 pre-built page layouts",
      "Lifetime updates and component documentation"
    ]
  },
  {
    id: "tool-audit",
    name: "WebAudit CLI Automation Script",
    category: "software",
    format: "Node.js / Bash",
    license: "MIT Commercial",
    price: 19.00,
    rating: 4.7,
    reviews: 42,
    icon: "⚡",
    description: "Automated headless performance, SEO, and broken-link auditing terminal script.",
    features: [
      "Integrates with GitHub Actions and GitLab CI",
      "Exports human-readable JSON & HTML reports",
      "Parallel URL testing capability",
      "Zero heavyweight third-party dependencies"
    ]
  },
  {
    id: "guide-astro",
    name: "Architecting Micro-Frontends Guide",
    category: "guides",
    format: "PDF + ePub",
    license: "Single User",
    price: 15.00,
    rating: 4.8,
    reviews: 119,
    icon: "📘",
    description: "In-depth reference manual on domain decoupling, routing, and shared caching.",
    features: [
      "140+ pages of architectural blueprints",
      "Practical code samples across monorepos",
      "State sharing and event bus patterns",
      "Includes companion GitHub repository access"
    ]
  },
  {
    id: "temp-dash",
    name: "Matrix Analytics Dashboard Kit",
    category: "design",
    format: "Figma + Vue3",
    license: "Commercial",
    price: 34.00,
    rating: 5.0,
    reviews: 31,
    icon: "📊",
    description: "Data-dense operational dashboard interface with accessible charts and tables.",
    features: [
      "60+ custom chart components",
      "Full dark mode color tokens",
      "WCAG 2.1 AA compliant color palette",
      "Modular responsive widget grid"
    ]
  },
  {
    id: "tool-api",
    name: "Mock API Gateway Microservice",
    category: "software",
    format: "Go Binary + Docker",
    license: "Commercial",
    price: 24.00,
    rating: 4.6,
    reviews: 18,
    icon: "🛠️",
    description: "Ultra-fast local REST and GraphQL mockup server with dynamic response templating.",
    features: [
      "Sub-millisecond simulated latency",
      "Dynamic data seeding via faker schema",
      "Low CPU and memory footprint (<20MB RAM)",
      "Single binary with Docker Compose ready"
    ]
  },
  {
    id: "guide-devops",
    name: "Production VPS Hardening Checklist",
    category: "guides",
    format: "Markdown + PDF",
    license: "Single User",
    price: 12.00,
    rating: 4.9,
    reviews: 95,
    icon: "🛡️",
    description: "Step-by-step checklist for configuring Ubuntu and Debian production instances securely.",
    features: [
      "Automated SSH, UFW, and fail2ban configs",
      "Kernel sysctl hardening profiles",
      "Non-root container isolation guides",
      "Audit logs and automated alert alerts"
    ]
  }
];

/* ==========================================================================
   State & Storage Helpers
   ========================================================================== */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('adurite_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('adurite_cart', JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    showToast("Item is already in your cart!");
    return;
  }
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (product) {
    cart.push({ id: product.id, name: product.name, price: product.price, format: product.format });
    saveCart(cart);
    showToast(`Added "${product.name}" to cart.`);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  if (document.getElementById('cartContainer')) {
    renderCartPage();
  }
}

function updateCartBadges() {
  const count = getCart().length;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   Theme Initialization
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('adurite_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleBtn(savedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('adurite_theme', next);
      updateThemeToggleBtn(next);
    });
  }
}

function updateThemeToggleBtn(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

/* ==========================================================================
   Header Mobile Nav Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}

/* ==========================================================================
   Page Renderers
   ========================================================================== */
function renderProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-card-img-wrap">
        <span>${product.icon}</span>
      </div>
      <div class="product-card-body">
        <div class="badge-row">
          <span class="badge">${product.format}</span>
          <span class="badge">${product.license}</span>
        </div>
        <h3><a href="product_detail.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
        <p>${product.description}</p>
        <div class="product-card-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function initIndexPage() {
  const grid = document.getElementById('featuredProductGrid');
  if (!grid) return;
  const featured = PRODUCTS_DATA.slice(0, 3);
  grid.innerHTML = featured.map(renderProductCard).join('');
}

function initCatalogPage() {
  const grid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('catalogSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  let currentFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    const filtered = PRODUCTS_DATA.filter(p => {
      const matchCat = (currentFilter === 'all' || p.category === currentFilter);
      const matchSearch = p.name.toLowerCase().includes(searchQuery) ||
                          p.description.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>No digital products match your filter.</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(renderProductCard).join('');
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  applyFilters();
}

function initDetailPage() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'temp-saas';
  const product = PRODUCTS_DATA.find(p => p.id === productId) || PRODUCTS_DATA[0];

  document.title = `${product.name} - Adurite Digital Store`;

  container.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-visual">
        <span>${product.icon}</span>
      </div>
      <div class="product-detail-info">
        <div class="badge-row">
          <span class="badge">${product.format}</span>
          <span class="badge">${product.license} License</span>
          <span class="badge">Instant Delivery</span>
        </div>
        <h2>${product.name}</h2>
        <div class="product-detail-meta">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <div class="rating-stars">★★★★★</div>
          <span class="rating-count">(${product.reviews} customer reviews)</span>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${product.description}</p>
        
        <h4 style="margin-bottom: 0.5rem;">Included Features:</h4>
        <ul class="feature-checklist">
          ${product.features.map(f => `<li>${f}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addToCart('${product.id}')">Add to Cart</button>
          <a href="products.html" class="btn btn-secondary">Back to Catalog</a>
        </div>
      </div>
    </div>
  `;
}

function renderCartPage() {
  const container = document.getElementById('cartContainer');
  const summaryBox = document.getElementById('cartSummaryContainer');
  if (!container || !summaryBox) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Your shopping cart is empty.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Products</a>
      </div>
    `;
    summaryBox.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-format">Digital Download &bull; ${item.format}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <span style="font-weight: 700;">$${item.price.toFixed(2)}</span>
        <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  summaryBox.innerHTML = `
    <h3 style="margin-bottom: 1.5rem;">Order Summary</h3>
    <div class="summary-line">
      <span>Digital Items (${cart.length})</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-line">
      <span>Delivery</span>
      <span>Instant Email</span>
    </div>
    <div class="summary-line total">
      <span>Total</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top: 1.5rem;" onclick="handleCheckout()">Proceed to Checkout</button>
  `;
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;
  alert(`Connecting to payment gateway for $${cart.reduce((a, c) => a + c.price, 0).toFixed(2)}. In production, this redirects directly to Stripe Checkout.`);
}

/* ==========================================================================
   DOM Ready Dispatcher
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  updateCartBadges();

  if (document.getElementById('featuredProductGrid')) initIndexPage();
  if (document.getElementById('catalogGrid')) initCatalogPage();
  if (document.getElementById('productDetailContainer')) initDetailPage();
  if (document.getElementById('cartContainer')) renderCartPage();
});
