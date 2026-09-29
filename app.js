(function () {
  const app = document.getElementById("app");
  const statusFlow = ["placed", "paid", "shipped", "delivered"];
  const statusLabels = {
    placed: "Placed",
    paid: "Paid",
    shipped: "Shipped",
    delivered: "Delivered",
    refunded: "Refunded"
  };

  const sellers = [
    {
      id: "s1",
      name: "Copper & Clay",
      tagline: "Small batch home goods",
      status: "approved",
      location: "Portland, OR",
      rating: 4.9,
      commissionRate: 0.12,
      balance: 2480.35,
      nextPayout: "May 31",
      metrics: { revenue: 18420, orders: 214, conversion: 4.8, refunds: 1.2 }
    },
    {
      id: "s2",
      name: "Northline Studio",
      tagline: "Textiles and everyday carry",
      status: "pending",
      location: "Minneapolis, MN",
      rating: 4.7,
      commissionRate: 0.11,
      balance: 918.8,
      nextPayout: "Jun 3",
      metrics: { revenue: 7350, orders: 88, conversion: 3.9, refunds: 0.8 }
    },
    {
      id: "s3",
      name: "Bright Bench",
      tagline: "Desk tools and lighting",
      status: "approved",
      location: "Austin, TX",
      rating: 4.8,
      commissionRate: 0.13,
      balance: 1634.12,
      nextPayout: "Jun 1",
      metrics: { revenue: 12680, orders: 136, conversion: 4.3, refunds: 1.6 }
    },
    {
      id: "s4",
      name: "Fern & Field",
      tagline: "Garden kits and pantry staples",
      status: "approved",
      location: "Burlington, VT",
      rating: 4.6,
      commissionRate: 0.1,
      balance: 1195.6,
      nextPayout: "Jun 4",
      metrics: { revenue: 9650, orders: 121, conversion: 5.2, refunds: 0.5 }
    }
  ];

  const products = [
    {
      id: "p1",
      sellerId: "s1",
      title: "Hand-thrown breakfast bowl",
      category: "Home",
      price: 48,
      stock: 8,
      rating: 4.9,
      reviews: 128,
      tags: ["Ceramic", "Kitchen"],
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80",
      description: "Wheel-thrown stoneware with a satin glaze."
    },
    {
      id: "p2",
      sellerId: "s2",
      title: "Waxed canvas market tote",
      category: "Fashion",
      price: 68,
      stock: 2,
      rating: 4.7,
      reviews: 74,
      tags: ["Canvas", "Carry"],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      description: "Structured tote with reinforced handles."
    },
    {
      id: "p3",
      sellerId: "s3",
      title: "Brass desk lamp",
      category: "Office",
      price: 120,
      stock: 5,
      rating: 4.8,
      reviews: 93,
      tags: ["Lighting", "Desk"],
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      description: "Adjustable task lamp with warm LED hardware."
    },
    {
      id: "p4",
      sellerId: "s4",
      title: "Trail roast coffee sampler",
      category: "Pantry",
      price: 34,
      stock: 19,
      rating: 4.6,
      reviews: 210,
      tags: ["Coffee", "Sampler"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      description: "Three single-origin roasts packed for gifting."
    },
    {
      id: "p5",
      sellerId: "s2",
      title: "Natural stone stacking rings",
      category: "Jewelry",
      price: 86,
      stock: 0,
      rating: 4.8,
      reviews: 51,
      tags: ["Silver", "Stone"],
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
      description: "Mixed stones set in brushed sterling bands."
    },
    {
      id: "p6",
      sellerId: "s3",
      title: "Walnut phone stand",
      category: "Office",
      price: 42,
      stock: 4,
      rating: 4.9,
      reviews: 65,
      tags: ["Walnut", "Desk"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      description: "Solid walnut desktop stand with cable pass-through."
    },
    {
      id: "p7",
      sellerId: "s4",
      title: "Herb garden starter kit",
      category: "Garden",
      price: 58,
      stock: 3,
      rating: 4.7,
      reviews: 84,
      tags: ["Seeds", "Planter"],
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
      description: "Indoor planter kit with basil, mint, and thyme."
    },
    {
      id: "p8",
      sellerId: "s1",
      title: "Organic cotton throw",
      category: "Home",
      price: 98,
      stock: 7,
      rating: 4.8,
      reviews: 97,
      tags: ["Textile", "Cotton"],
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
      description: "Soft woven throw with a reversible pattern."
    }
  ];

  const orders = [
    {
      id: "ORD-1042",
      buyer: "Avery Stone",
      created: "May 24",
      statusIndex: 2,
      refunded: false,
      items: [
        { productId: "p2", sellerId: "s2", title: "Waxed canvas market tote", qty: 1, price: 68 },
        { productId: "p4", sellerId: "s4", title: "Trail roast coffee sampler", qty: 2, price: 34 }
      ],
      sellerSplits: [
        { sellerId: "s2", subtotal: 68, platformFee: 7.48, sellerReceives: 60.52 },
        { sellerId: "s4", subtotal: 68, platformFee: 6.8, sellerReceives: 61.2 }
      ],
      total: 136,
      timeline: ["Order placed", "Payment authorized", "Fulfillment label created"]
    }
  ];

  const disputes = [
    {
      id: "DSP-88",
      orderId: "ORD-1038",
      buyer: "Mina Park",
      sellerId: "s1",
      reason: "Item arrived damaged",
      status: "open",
      amount: 48
    },
    {
      id: "DSP-91",
      orderId: "ORD-1040",
      buyer: "Jon Bell",
      sellerId: "s3",
      reason: "Shipment delayed",
      status: "reviewing",
      amount: 120
    }
  ];

  const notifications = [
    {
      id: "n1",
      title: "Low stock",
      body: "Herb garden starter kit has 3 units remaining.",
      type: "inventory",
      read: false
    },
    {
      id: "n2",
      title: "Seller review",
      body: "Northline Studio is waiting for platform approval.",
      type: "admin",
      read: false
    }
  ];

  const state = {
    view: "market",
    role: "buyer",
    query: "",
    category: "All",
    price: "All",
    seller: "All",
    cart: { p1: 1, p4: 1 },
    selectedSellerId: "s1",
    showNotifications: false
  };

  const architectureSnippets = [
    {
      title: "App Router shape",
      code: [
        "app/(buyer)/page.tsx",
        "app/(buyer)/products/[slug]/page.tsx",
        "app/seller/dashboard/page.tsx",
        "app/admin/sellers/page.tsx",
        "app/api/v1/orders/route.ts"
      ].join("\n")
    },
    {
      title: "API boundary",
      code: [
        "POST /api/v1/cart/items",
        "POST /api/v1/checkout/sessions",
        "PATCH /api/v1/orders/:id/status",
        "POST /api/v1/sellers/onboarding",
        "GET /api/v1/admin/disputes"
      ].join("\n")
    },
    {
      title: "Auth middleware",
      code: [
        "// Mock only: real app would rotate refresh tokens.",
        "validateAccessToken(req);",
        "requireRole(['buyer', 'seller', 'admin']);",
        "rateLimit({ key: userIdOrIp, window: '1m' });",
        "validateBody(schema);"
      ].join("\n")
    },
    {
      title: "Stripe Connect flow",
      code: [
        "// Mock only: create transfer group per marketplace order.",
        "createPaymentIntent(orderTotal);",
        "for each seller split:",
        "  transferToConnectedAccount(sellerAccountId);",
        "record platformFee and payoutLedgerEntry;"
      ].join("\n")
    }
  ];

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function getSeller(id) {
    return sellers.find(function (seller) {
      return seller.id === id;
    });
  }

  function getProduct(id) {
    return products.find(function (product) {
      return product.id === id;
    });
  }

  function approvedSellerProducts() {
    return products.filter(function (product) {
      const seller = getSeller(product.sellerId);
      return seller && seller.status === "approved";
    });
  }

  function cartItems() {
    return Object.keys(state.cart)
      .map(function (productId) {
        const product = getProduct(productId);
        if (!product) return null;
        return {
          product: product,
          seller: getSeller(product.sellerId),
          qty: state.cart[productId]
        };
      })
      .filter(Boolean);
  }

  function cartSubtotal() {
    return cartItems().reduce(function (sum, line) {
      return sum + line.product.price * line.qty;
    }, 0);
  }

  function cartPlatformFee() {
    return cartItems().reduce(function (sum, line) {
      return sum + line.product.price * line.qty * line.seller.commissionRate;
    }, 0);
  }

  function groupBySeller(lines) {
    return lines.reduce(function (groups, line) {
      if (!groups[line.seller.id]) {
        groups[line.seller.id] = { seller: line.seller, lines: [] };
      }
      groups[line.seller.id].lines.push(line);
      return groups;
    }, {});
  }

  function filteredProducts() {
    const query = state.query.trim().toLowerCase();
    return approvedSellerProducts().filter(function (product) {
      const seller = getSeller(product.sellerId);
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.join(" ").toLowerCase().includes(query) ||
        seller.name.toLowerCase().includes(query);
      const matchesCategory = state.category === "All" || product.category === state.category;
      const matchesSeller = state.seller === "All" || product.sellerId === state.seller;
      const matchesPrice =
        state.price === "All" ||
        (state.price === "Under 50" && product.price < 50) ||
        (state.price === "50 to 100" && product.price >= 50 && product.price <= 100) ||
        (state.price === "100 plus" && product.price > 100);
      return matchesQuery && matchesCategory && matchesSeller && matchesPrice;
    });
  }

  function notify(title, body, type) {
    notifications.unshift({
      id: "n" + Date.now(),
      title: title,
      body: body,
      type: type || "system",
      read: false
    });
  }

  function viewTitle() {
    const titles = {
      market: ["Marketplace", "Browse products across approved sellers."],
      orders: ["Checkout and Orders", "Cart splitting, payment mock, and order states."],
      seller: ["Seller Center", "Inventory, onboarding, analytics, and payouts."],
      admin: ["Admin Console", "Seller approvals, disputes, and platform health."],
      architecture: ["Architecture", "Mock contracts for the future full-stack build."]
    };
    return titles[state.view] || titles.market;
  }

  function render() {
    const title = viewTitle();
    const unread = notifications.filter(function (item) {
      return !item.read;
    }).length;

    app.innerHTML = [
      '<div class="app-shell">',
      renderSideNav(),
      '<main class="workspace">',
      '<header class="topbar">',
      '<div class="topbar-title"><h1>' + title[0] + '</h1><p>' + title[1] + '</p></div>',
      '<div class="topbar-actions">',
      renderRoleSelect(),
      '<button class="secondary-button" type="button" data-action="toggle-notifications">Alerts (' + unread + ")</button>",
      state.showNotifications ? renderNotifications() : "",
      "</div>",
      "</header>",
      '<div class="content">',
      renderCurrentView(),
      "</div>",
      "</main>",
      "</div>"
    ].join("");
  }

  function renderSideNav() {
    const nav = [
      ["market", "Market"],
      ["orders", "Orders"],
      ["seller", "Seller"],
      ["admin", "Admin"],
      ["architecture", "Architecture"]
    ];
    return [
      '<aside class="side-nav">',
      '<div class="brand"><div class="brand-mark">MF</div><div><strong>MarketForge</strong><span>Marketplace lab</span></div></div>',
      '<nav class="nav-list">',
      nav
        .map(function (item) {
          const active = state.view === item[0] ? " is-active" : "";
          return '<button class="nav-button' + active + '" type="button" data-view="' + item[0] + '">' + item[1] + "</button>";
        })
        .join(""),
      "</nav>",
      '<div class="side-panel"><strong>Operator snapshot</strong><p>' +
        money(totalGmv()) +
        " GMV across " +
        orders.length +
        " orders, with " +
        sellers.filter(function (seller) {
          return seller.status === "approved";
        }).length +
        " approved sellers.</p></div>",
      "</aside>"
    ].join("");
  }

  function renderRoleSelect() {
    return [
      '<select class="role-select" id="role-select" aria-label="Current role">',
      '<option value="buyer"' + selected(state.role, "buyer") + ">Buyer role</option>",
      '<option value="seller"' + selected(state.role, "seller") + ">Seller role</option>",
      '<option value="admin"' + selected(state.role, "admin") + ">Admin role</option>",
      "</select>"
    ].join("");
  }

  function selected(value, expected) {
    return value === expected ? " selected" : "";
  }

  function renderCurrentView() {
    if (state.view === "orders") return renderOrdersView();
    if (state.view === "seller") return renderSellerView();
    if (state.view === "admin") return renderAdminView();
    if (state.view === "architecture") return renderArchitectureView();
    return renderMarketView();
  }

  function renderMarketView() {
    const visibleProducts = filteredProducts();
    return [
      '<section class="market-layout">',
      renderFilters(),
      '<section class="catalog">',
      '<div class="section-head">',
      '<div><p class="eyebrow">Buyer storefront</p><h2>Discover marketplace inventory</h2><p>' +
        visibleProducts.length +
        " products match the current catalog filters.</p></div>",
      renderMarketStats(),
      "</div>",
      visibleProducts.length ? '<div class="products-grid">' + visibleProducts.map(renderProductCard).join("") + "</div>" : renderEmpty("No products match these filters."),
      "</section>",
      '<aside class="cart-dock surface">' + renderCartMini() + "</aside>",
      "</section>"
    ].join("");
  }

  function renderFilters() {
    const categories = ["All"].concat(
      Array.from(
        new Set(
          products.map(function (product) {
            return product.category;
          })
        )
      ).sort()
    );
    const approvedSellers = sellers.filter(function (seller) {
      return seller.status === "approved";
    });
    return [
      '<aside class="filters surface">',
      '<form class="filter-form" data-form="filters">',
      '<div class="field"><label for="query">Search</label><input class="input" id="query" name="query" value="' + escapeHtml(state.query) + '" placeholder="Product, tag, seller"></div>',
      '<div class="field"><label for="category">Category</label><select class="select" id="category" name="category">',
      categories
        .map(function (category) {
          return '<option value="' + category + '"' + selected(state.category, category) + ">" + category + "</option>";
        })
        .join(""),
      "</select></div>",
      '<div class="field"><label for="seller">Seller</label><select class="select" id="seller" name="seller">',
      '<option value="All"' + selected(state.seller, "All") + ">All sellers</option>",
      approvedSellers
        .map(function (seller) {
          return '<option value="' + seller.id + '"' + selected(state.seller, seller.id) + ">" + seller.name + "</option>";
        })
        .join(""),
      "</select></div>",
      '<div class="field"><label for="price">Price</label><select class="select" id="price" name="price">',
      ["All", "Under 50", "50 to 100", "100 plus"]
        .map(function (price) {
          return '<option value="' + price + '"' + selected(state.price, price) + ">" + priceLabel(price) + "</option>";
        })
        .join(""),
      "</select></div>",
      '<div class="filter-actions"><button class="primary-button" type="submit">Apply</button><button class="ghost-button" type="button" data-action="reset-filters">Reset</button></div>',
      "</form>",
      "</aside>"
    ].join("");
  }

  function priceLabel(price) {
    return {
      All: "Any price",
      "Under 50": "Under $50",
      "50 to 100": "$50 to $100",
      "100 plus": "$100+"
    }[price];
  }

  function renderMarketStats() {
    return [
      '<div class="stat-strip">',
      '<div class="stat-tile"><strong>' + approvedSellerProducts().length + '</strong><span>Active listings</span></div>',
      '<div class="stat-tile"><strong>' + cartItems().length + '</strong><span>Cart lines</span></div>',
      '<div class="stat-tile"><strong>' + money(cartSubtotal()) + '</strong><span>Cart value</span></div>',
      "</div>"
    ].join("");
  }

  function renderProductCard(product) {
    const seller = getSeller(product.sellerId);
    const lowStock = product.stock > 0 && product.stock <= 3;
    const stockClass = product.stock === 0 ? "danger" : lowStock ? "warn" : "good";
    const stockLabel = product.stock === 0 ? "Sold out" : lowStock ? product.stock + " left" : product.stock + " in stock";
    return [
      '<article class="product-card">',
      '<div class="product-media" role="img" aria-label="' + escapeHtml(product.title) + '" style="background-image: url(\'' + product.image + "')\"></div>",
      '<div class="product-body">',
      '<div class="product-title"><h3>' + escapeHtml(product.title) + '</h3><span class="price">' + money(product.price) + "</span></div>",
      '<p class="small-note">' + escapeHtml(product.description) + "</p>",
      '<div class="tag-row"><span class="chip">' + product.category + '</span><span class="chip ' + stockClass + '">' + stockLabel + '</span></div>',
      '<div class="small-note">' + seller.name + " - " + product.rating + " rating - " + product.reviews + " reviews</div>",
      '<button class="primary-button" type="button" data-action="add-to-cart" data-product-id="' + product.id + '"' + (product.stock === 0 ? " disabled" : "") + ">" + (product.stock === 0 ? "Sold out" : "Add to cart") + "</button>",
      "</div>",
      "</article>"
    ].join("");
  }

  function renderCartMini() {
    const lines = cartItems();
    if (!lines.length) {
      return renderEmpty("Cart is empty.");
    }

    const groups = groupBySeller(lines);
    return [
      '<div class="section-head"><div><p class="eyebrow">Multi-seller cart</p><h3>Checkout queue</h3></div></div>',
      '<div class="cart-list">',
      Object.keys(groups)
        .map(function (sellerId) {
          const group = groups[sellerId];
          const subtotal = group.lines.reduce(function (sum, line) {
            return sum + line.product.price * line.qty;
          }, 0);
          return [
            '<div class="cart-line">',
            '<div class="cart-line-head"><strong>' + group.seller.name + '</strong><span>' + money(subtotal) + "</span></div>",
            group.lines
              .map(function (line) {
                return '<div class="split-row small-note"><span>' + line.qty + " x " + escapeHtml(line.product.title) + "</span><span>" + money(line.product.price * line.qty) + "</span></div>";
              })
              .join(""),
            "</div>"
          ].join("");
        })
        .join(""),
      "</div>",
      '<div class="total-box">',
      '<div class="split-row"><span>Subtotal</span><strong>' + money(cartSubtotal()) + "</strong></div>",
      '<div class="split-row small-note"><span>Mock platform fee</span><span>' + money(cartPlatformFee()) + "</span></div>",
      '<button class="primary-button" type="button" data-action="go-orders">Review checkout</button>',
      "</div>"
    ].join("");
  }

  function renderOrdersView() {
    return [
      '<section class="split-view">',
      '<div class="surface panel-pad">' + renderCartFull() + "</div>",
      '<div class="stack">' + renderOrderHistory() + "</div>",
      "</section>"
    ].join("");
  }

  function renderCartFull() {
    const lines = cartItems();
    if (!lines.length) {
      return [
        '<div class="section-head"><div><p class="eyebrow">Checkout</p><h2>Cart</h2></div></div>',
        renderEmpty("No items are queued for checkout.")
      ].join("");
    }

    const groups = groupBySeller(lines);
    return [
      '<div class="section-head"><div><p class="eyebrow">Checkout</p><h2>Cart</h2><p>Items are grouped by seller before the payment split.</p></div></div>',
      '<div class="cart-list">',
      Object.keys(groups)
        .map(function (sellerId) {
          const group = groups[sellerId];
          return [
            '<div class="cart-line">',
            '<div class="cart-line-head"><strong>' + group.seller.name + '</strong><span class="chip">' + group.seller.commissionRate * 100 + "% fee</span></div>",
            group.lines.map(renderCartLine).join(""),
            "</div>"
          ].join("");
        })
        .join(""),
      "</div>",
      '<div class="total-box">',
      '<div class="split-row"><span>Subtotal</span><strong>' + money(cartSubtotal()) + "</strong></div>",
      '<div class="split-row"><span>Platform fee</span><strong>' + money(cartPlatformFee()) + "</strong></div>",
      '<div class="split-row"><span>Seller payouts</span><strong>' + money(cartSubtotal() - cartPlatformFee()) + "</strong></div>",
      '<button class="primary-button" type="button" data-action="checkout">Place mock order</button>',
      "</div>"
    ].join("");
  }

  function renderCartLine(line) {
    return [
      '<div class="order-line">',
      '<div class="order-line-head"><span>' + escapeHtml(line.product.title) + '</span><strong>' + money(line.product.price * line.qty) + "</strong></div>",
      '<div class="cart-line-head">',
      '<span class="small-note">Available: ' + line.product.stock + "</span>",
      '<div class="qty-control"><button type="button" data-action="cart-qty" data-product-id="' + line.product.id + '" data-delta="-1">-</button><span>' + line.qty + '</span><button type="button" data-action="cart-qty" data-product-id="' + line.product.id + '" data-delta="1">+</button></div>',
      "</div>",
      "</div>"
    ].join("");
  }

  function renderOrderHistory() {
    return [
      '<div class="section-head"><div><p class="eyebrow">Order lifecycle</p><h2>Orders</h2></div></div>',
      orders.length ? orders.map(renderOrderCard).join("") : renderEmpty("No orders yet.")
    ].join("");
  }

  function renderOrderCard(order) {
    const status = order.refunded ? "refunded" : statusFlow[order.statusIndex];
    const nextStatus = statusFlow[order.statusIndex + 1];
    return [
      '<article class="order-card">',
      '<div class="order-line-head"><div><strong>' + order.id + '</strong><div class="small-note">' + order.buyer + " - " + order.created + '</div></div><span class="status-chip ' + status + '">' + statusLabels[status] + "</span></div>",
      renderStatusFlow(order),
      '<div class="cart-list">',
      order.items
        .map(function (item) {
          return '<div class="split-row small-note"><span>' + item.qty + " x " + escapeHtml(item.title) + " from " + getSeller(item.sellerId).name + "</span><strong>" + money(item.qty * item.price) + "</strong></div>";
        })
        .join(""),
      "</div>",
      '<div class="total-box">',
      order.sellerSplits.map(renderSplitLine).join(""),
      '<div class="split-row"><span>Total charged</span><strong>' + money(order.total) + "</strong></div>",
      "</div>",
      '<div class="button-row">',
      '<button class="secondary-button" type="button" data-action="advance-order" data-order-id="' + order.id + '"' + (!nextStatus || order.refunded ? " disabled" : "") + ">Advance state</button>",
      '<button class="danger-button" type="button" data-action="refund-order" data-order-id="' + order.id + '"' + (order.refunded ? " disabled" : "") + ">Refund</button>",
      "</div>",
      "</article>"
    ].join("");
  }

  function renderStatusFlow(order) {
    return [
      '<div class="status-flow">',
      statusFlow
        .map(function (status, index) {
          return '<div class="status-step' + (index <= order.statusIndex && !order.refunded ? " done" : "") + '">' + statusLabels[status] + "</div>";
        })
        .join(""),
      "</div>"
    ].join("");
  }

  function renderSplitLine(split) {
    return [
      '<div class="split-row small-note">',
      '<span>' + getSeller(split.sellerId).name + " receives " + money(split.sellerReceives) + "</span>",
      '<span>Fee ' + money(split.platformFee) + "</span>",
      "</div>"
    ].join("");
  }

  function renderSellerView() {
    const seller = getSeller(state.selectedSellerId);
    const sellerProducts = products.filter(function (product) {
      return product.sellerId === seller.id;
    });
    const lowStock = sellerProducts.filter(function (product) {
      return product.stock > 0 && product.stock <= 3;
    });
    return [
      '<section class="dashboard-grid">',
      '<div class="section-head">',
      '<div><p class="eyebrow">Seller dashboard</p><h2>' + seller.name + '</h2><p>' + seller.tagline + " - " + seller.location + "</p></div>",
      renderSellerPicker(),
      "</div>",
      renderSellerMetrics(seller),
      '<div class="seller-workspace">',
      '<div class="stack">',
      '<div class="surface panel-pad">' + renderInventoryTable(sellerProducts) + "</div>",
      '<div class="surface panel-pad">' + renderPayouts(seller) + "</div>",
      "</div>",
      '<div class="stack">',
      '<div class="surface panel-pad">' + renderOnboarding(seller) + "</div>",
      '<div class="surface panel-pad">' + renderListingForm() + "</div>",
      '<div class="surface panel-pad">' + renderLowStock(lowStock) + "</div>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");
  }

  function renderSellerPicker() {
    return [
      '<select class="select" id="seller-picker" aria-label="Seller dashboard selector">',
      sellers
        .map(function (seller) {
          return '<option value="' + seller.id + '"' + selected(state.selectedSellerId, seller.id) + ">" + seller.name + "</option>";
        })
        .join(""),
      "</select>"
    ].join("");
  }

  function renderSellerMetrics(seller) {
    return [
      '<div class="metric-grid">',
      '<div class="metric-card"><span>Revenue</span><strong>' + money(seller.metrics.revenue) + "</strong></div>",
      '<div class="metric-card"><span>Orders</span><strong>' + seller.metrics.orders + "</strong></div>",
      '<div class="metric-card"><span>Conversion</span><strong>' + seller.metrics.conversion + "%</strong></div>",
      '<div class="metric-card"><span>Refund rate</span><strong>' + seller.metrics.refunds + "%</strong></div>",
      "</div>"
    ].join("");
  }

  function renderInventoryTable(sellerProducts) {
    return [
      '<div class="section-head"><div><p class="eyebrow">Inventory</p><h3>Listings</h3></div></div>',
      '<table class="data-table">',
      "<thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>",
      "<tbody>",
      sellerProducts
        .map(function (product) {
          return [
            "<tr>",
            '<td><strong>' + escapeHtml(product.title) + '</strong><div class="small-note">' + product.category + "</div></td>",
            "<td>" + money(product.price) + "</td>",
            '<td><span class="chip ' + (product.stock === 0 ? "danger" : product.stock <= 3 ? "warn" : "good") + '">' + product.stock + "</span></td>",
            '<td><div class="table-actions"><button class="ghost-button" type="button" data-action="stock" data-product-id="' + product.id + '" data-delta="-1">-1</button><button class="ghost-button" type="button" data-action="stock" data-product-id="' + product.id + '" data-delta="5">+5</button></div></td>',
            "</tr>"
          ].join("");
        })
        .join(""),
      "</tbody></table>"
    ].join("");
  }

  function renderPayouts(seller) {
    const sellerOrders = orders.filter(function (order) {
      return order.sellerSplits.some(function (split) {
        return split.sellerId === seller.id;
      });
    });
    return [
      '<div class="section-head"><div><p class="eyebrow">Payouts</p><h3>Ledger</h3></div><span class="chip good">Next ' + seller.nextPayout + "</span></div>",
      '<div class="metric-line"><span>Current balance</span><strong>' + money(seller.balance) + "</strong></div>",
      '<div class="cart-list">',
      sellerOrders.length
        ? sellerOrders
            .map(function (order) {
              const split = order.sellerSplits.find(function (entry) {
                return entry.sellerId === seller.id;
              });
              return '<div class="split-row small-note"><span>' + order.id + " - " + statusLabels[order.refunded ? "refunded" : statusFlow[order.statusIndex]] + "</span><strong>" + money(split.sellerReceives) + "</strong></div>";
            })
            .join("")
        : '<div class="small-note">No payout entries for this seller yet.</div>',
      "</div>"
    ].join("");
  }

  function renderOnboarding(seller) {
    const checks = [
      ["Business identity", seller.status !== "suspended"],
      ["Tax profile", seller.status === "approved"],
      ["Stripe Connect account", seller.status === "approved"],
      ["First listing review", products.some(function (product) { return product.sellerId === seller.id; })]
    ];
    return [
      '<div class="section-head"><div><p class="eyebrow">Onboarding</p><h3>Seller status</h3></div><span class="status-chip ' + seller.status + '">' + seller.status + "</span></div>",
      '<div class="stack">',
      checks
        .map(function (check) {
          return '<div class="split-row"><span>' + check[0] + '</span><span class="chip ' + (check[1] ? "good" : "warn") + '">' + (check[1] ? "Complete" : "Waiting") + "</span></div>";
        })
        .join(""),
      "</div>"
    ].join("");
  }

  function renderListingForm() {
    return [
      '<div class="section-head"><div><p class="eyebrow">Catalog</p><h3>Create listing</h3></div></div>',
      '<form class="form-grid" data-form="listing">',
      '<div class="field full"><label for="listing-title">Title</label><input class="input" id="listing-title" name="title" required maxlength="72" placeholder="New product"></div>',
      '<div class="field"><label for="listing-category">Category</label><select class="select" id="listing-category" name="category"><option>Home</option><option>Fashion</option><option>Office</option><option>Pantry</option><option>Garden</option><option>Jewelry</option></select></div>',
      '<div class="field"><label for="listing-price">Price</label><input class="input" id="listing-price" name="price" type="number" min="1" value="64"></div>',
      '<div class="field"><label for="listing-stock">Stock</label><input class="input" id="listing-stock" name="stock" type="number" min="0" value="6"></div>',
      '<div class="field full"><label for="listing-notes">Description</label><textarea class="textarea" id="listing-notes" name="description" maxlength="160">Draft listing for seller catalog workflow.</textarea></div>',
      '<div class="full"><button class="primary-button" type="submit">Create draft</button></div>',
      "</form>"
    ].join("");
  }

  function renderLowStock(lowStock) {
    return [
      '<div class="section-head"><div><p class="eyebrow">Alerts</p><h3>Low stock</h3></div></div>',
      lowStock.length
        ? '<div class="cart-list">' +
          lowStock
            .map(function (product) {
              return '<div class="split-row small-note"><span>' + escapeHtml(product.title) + '</span><strong>' + product.stock + " left</strong></div>";
            })
            .join("") +
          "</div>"
        : '<div class="small-note">No low-stock listings for this seller.</div>'
    ].join("");
  }

  function renderAdminView() {
    return [
      '<section class="admin-grid">',
      '<div class="stack">',
      '<div class="surface panel-pad">' + renderSellerApprovals() + "</div>",
      '<div class="surface panel-pad">' + renderDisputes() + "</div>",
      "</div>",
      '<div class="stack">',
      '<div class="surface panel-pad">' + renderPlatformAnalytics() + "</div>",
      '<div class="surface panel-pad">' + renderSecurityChecklist() + "</div>",
      "</div>",
      "</section>"
    ].join("");
  }

  function renderSellerApprovals() {
    return [
      '<div class="section-head"><div><p class="eyebrow">Sellers</p><h2>Approvals</h2></div></div>',
      '<table class="data-table">',
      "<thead><tr><th>Seller</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>",
      "<tbody>",
      sellers
        .map(function (seller) {
          return [
            "<tr>",
            '<td><strong>' + seller.name + '</strong><div class="small-note">' + seller.location + "</div></td>",
            '<td><span class="status-chip ' + seller.status + '">' + seller.status + "</span></td>",
            "<td>" + seller.rating + "</td>",
            '<td><div class="table-actions"><button class="secondary-button" type="button" data-action="approve-seller" data-seller-id="' + seller.id + '">Approve</button><button class="danger-button" type="button" data-action="suspend-seller" data-seller-id="' + seller.id + '">Suspend</button></div></td>',
            "</tr>"
          ].join("");
        })
        .join(""),
      "</tbody></table>"
    ].join("");
  }

  function renderDisputes() {
    return [
      '<div class="section-head"><div><p class="eyebrow">Trust</p><h2>Disputes</h2></div></div>',
      '<div class="stack">',
      disputes
        .map(function (dispute) {
          return [
            '<article class="dispute-card">',
            '<div class="order-line-head"><strong>' + dispute.id + '</strong><span class="status-chip ' + dispute.status + '">' + dispute.status + "</span></div>",
            '<p class="small-note">' + dispute.reason + " - " + getSeller(dispute.sellerId).name + " - " + money(dispute.amount) + "</p>",
            '<div class="button-row"><button class="secondary-button" type="button" data-action="review-dispute" data-dispute-id="' + dispute.id + '">Review</button><button class="ghost-button" type="button" data-action="close-dispute" data-dispute-id="' + dispute.id + '">Close</button></div>',
            "</article>"
          ].join("");
        })
        .join(""),
      "</div>"
    ].join("");
  }

  function renderPlatformAnalytics() {
    return [
      '<div class="section-head"><div><p class="eyebrow">Platform</p><h2>Analytics</h2></div></div>',
      '<div class="analytics-grid">',
      '<div class="metric-card"><span>GMV</span><strong>' + money(totalGmv()) + "</strong></div>",
      '<div class="metric-card"><span>Fees</span><strong>' + money(totalPlatformFees()) + "</strong></div>",
      '<div class="metric-card"><span>Open disputes</span><strong>' + disputes.filter(function (item) { return item.status !== "closed"; }).length + "</strong></div>",
      '<div class="metric-card"><span>Pending sellers</span><strong>' + sellers.filter(function (seller) { return seller.status === "pending"; }).length + "</strong></div>",
      "</div>"
    ].join("");
  }

  function renderSecurityChecklist() {
    const items = [
      "JWT refresh token rotation",
      "Role-based access control",
      "Input validation and sanitization",
      "API rate limiting",
      "Structured error logging",
      "Versioned API contracts"
    ];
    return [
      '<div class="section-head"><div><p class="eyebrow">Enterprise patterns</p><h2>Controls</h2></div></div>',
      '<div class="stack">',
      items
        .map(function (item) {
          return '<div class="split-row"><span>' + item + '</span><span class="chip good">Mocked</span></div>';
        })
        .join(""),
      "</div>"
    ].join("");
  }

  function renderArchitectureView() {
    return [
      '<section>',
      '<div class="section-head"><div><p class="eyebrow">Technical blueprint</p><h2>Full-stack map</h2><p>These contracts match the mock files in the project folder.</p></div></div>',
      '<div class="code-grid">',
      architectureSnippets.map(renderCodeCard).join(""),
      "</div>",
      "</section>"
    ].join("");
  }

  function renderCodeCard(section) {
    return [
      '<article class="code-card">',
      "<h3>" + section.title + "</h3>",
      "<pre><code>" + escapeHtml(section.code) + "</code></pre>",
      "</article>"
    ].join("");
  }

  function renderNotifications() {
    return [
      '<div class="notification-panel surface">',
      '<div class="cart-line-head"><strong>Alerts</strong><button class="ghost-button" type="button" data-action="mark-alerts-read">Mark read</button></div>',
      '<div class="stack" style="margin-top: 10px;">',
      notifications
        .slice(0, 5)
        .map(function (item) {
          return '<div class="notification-line' + (!item.read ? " is-unread" : "") + '"><strong>' + item.title + '</strong><span class="small-note">' + item.body + "</span></div>";
        })
        .join(""),
      "</div>",
      "</div>"
    ].join("");
  }

  function renderEmpty(message) {
    return '<div class="empty-state"><div>' + escapeHtml(message) + "</div></div>";
  }

  function totalGmv() {
    return orders.reduce(function (sum, order) {
      return sum + order.total;
    }, 0);
  }

  function totalPlatformFees() {
    return orders.reduce(function (sum, order) {
      return (
        sum +
        order.sellerSplits.reduce(function (splitSum, split) {
          return splitSum + split.platformFee;
        }, 0)
      );
    }, 0);
  }

  function addToCart(productId) {
    const product = getProduct(productId);
    if (!product || product.stock <= 0) return;
    const nextQty = (state.cart[productId] || 0) + 1;
    if (nextQty > product.stock) {
      notify("Stock limit", product.title + " only has " + product.stock + " units available.", "cart");
      return;
    }
    state.cart[productId] = nextQty;
    notify("Cart updated", product.title + " added to cart.", "cart");
  }

  function updateCartQty(productId, delta) {
    const product = getProduct(productId);
    if (!product) return;
    const nextQty = (state.cart[productId] || 0) + delta;
    if (nextQty <= 0) {
      delete state.cart[productId];
      return;
    }
    if (nextQty > product.stock) {
      notify("Stock limit", product.title + " only has " + product.stock + " units available.", "cart");
      return;
    }
    state.cart[productId] = nextQty;
  }

  function checkout() {
    const lines = cartItems();
    if (!lines.length) return;
    const outOfStock = lines.find(function (line) {
      return line.qty > line.product.stock;
    });
    if (outOfStock) {
      notify("Checkout blocked", outOfStock.product.title + " does not have enough stock.", "checkout");
      return;
    }

    lines.forEach(function (line) {
      line.product.stock -= line.qty;
    });

    const groups = groupBySeller(lines);
    const splits = Object.keys(groups).map(function (sellerId) {
      const group = groups[sellerId];
      const subtotal = group.lines.reduce(function (sum, line) {
        return sum + line.product.price * line.qty;
      }, 0);
      const platformFee = subtotal * group.seller.commissionRate;
      return {
        sellerId: sellerId,
        subtotal: subtotal,
        platformFee: platformFee,
        sellerReceives: subtotal - platformFee
      };
    });

    const orderId = "ORD-" + Math.floor(1100 + Math.random() * 8999);
    orders.unshift({
      id: orderId,
      buyer: "Demo Buyer",
      created: "Today",
      statusIndex: 1,
      refunded: false,
      items: lines.map(function (line) {
        return {
          productId: line.product.id,
          sellerId: line.seller.id,
          title: line.product.title,
          qty: line.qty,
          price: line.product.price
        };
      }),
      sellerSplits: splits,
      total: cartSubtotal(),
      timeline: ["Order placed", "Payment captured"]
    });

    Object.keys(state.cart).forEach(function (key) {
      delete state.cart[key];
    });
    notify("Order paid", orderId + " captured with " + splits.length + " seller payout splits.", "order");
  }

  function advanceOrder(orderId) {
    const order = orders.find(function (item) {
      return item.id === orderId;
    });
    if (!order || order.refunded || order.statusIndex >= statusFlow.length - 1) return;
    order.statusIndex += 1;
    const status = statusFlow[order.statusIndex];
    order.timeline.push("Order moved to " + statusLabels[status]);
    notify("Order updated", order.id + " is now " + statusLabels[status].toLowerCase() + ".", "order");
  }

  function refundOrder(orderId) {
    const order = orders.find(function (item) {
      return item.id === orderId;
    });
    if (!order || order.refunded) return;
    order.refunded = true;
    order.timeline.push("Refund issued");
    notify("Refund issued", order.id + " has been refunded.", "order");
  }

  function changeStock(productId, delta) {
    const product = getProduct(productId);
    if (!product) return;
    product.stock = Math.max(0, product.stock + delta);
    notify("Inventory updated", product.title + " stock is now " + product.stock + ".", "inventory");
  }

  function updateSellerStatus(sellerId, status) {
    const seller = getSeller(sellerId);
    if (!seller) return;
    seller.status = status;
    notify("Seller status", seller.name + " is now " + status + ".", "admin");
  }

  function updateDispute(disputeId, status) {
    const dispute = disputes.find(function (item) {
      return item.id === disputeId;
    });
    if (!dispute) return;
    dispute.status = status;
    notify("Dispute updated", dispute.id + " marked " + status + ".", "admin");
  }

  function createListing(form) {
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    if (!title) return;
    const category = String(data.get("category"));
    const price = Math.max(1, Number(data.get("price")) || 1);
    const stock = Math.max(0, Number(data.get("stock")) || 0);
    const description = String(data.get("description") || "Draft listing.").trim();
    const imageByCategory = {
      Home: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
      Fashion: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      Office: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      Pantry: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      Garden: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
      Jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    };
    products.unshift({
      id: "p" + Date.now(),
      sellerId: state.selectedSellerId,
      title: title,
      category: category,
      price: price,
      stock: stock,
      rating: 0,
      reviews: 0,
      tags: ["Draft", category],
      image: imageByCategory[category] || imageByCategory.Home,
      description: description
    });
    notify("Listing created", title + " was added as a draft listing.", "seller");
  }

  app.addEventListener("click", function (event) {
    const target = event.target.closest("[data-view], [data-action]");
    if (!target) return;

    if (target.dataset.view) {
      state.view = target.dataset.view;
      state.showNotifications = false;
      render();
      return;
    }

    const action = target.dataset.action;
    if (action === "toggle-notifications") {
      state.showNotifications = !state.showNotifications;
    }
    if (action === "mark-alerts-read") {
      notifications.forEach(function (item) {
        item.read = true;
      });
    }
    if (action === "add-to-cart") {
      addToCart(target.dataset.productId);
    }
    if (action === "reset-filters") {
      state.query = "";
      state.category = "All";
      state.price = "All";
      state.seller = "All";
    }
    if (action === "go-orders") {
      state.view = "orders";
    }
    if (action === "cart-qty") {
      updateCartQty(target.dataset.productId, Number(target.dataset.delta));
    }
    if (action === "checkout") {
      checkout();
    }
    if (action === "advance-order") {
      advanceOrder(target.dataset.orderId);
    }
    if (action === "refund-order") {
      refundOrder(target.dataset.orderId);
    }
    if (action === "stock") {
      changeStock(target.dataset.productId, Number(target.dataset.delta));
    }
    if (action === "approve-seller") {
      updateSellerStatus(target.dataset.sellerId, "approved");
    }
    if (action === "suspend-seller") {
      updateSellerStatus(target.dataset.sellerId, "suspended");
    }
    if (action === "review-dispute") {
      updateDispute(target.dataset.disputeId, "reviewing");
    }
    if (action === "close-dispute") {
      updateDispute(target.dataset.disputeId, "closed");
    }
    render();
  });

  app.addEventListener("change", function (event) {
    if (event.target.id === "role-select") {
      state.role = event.target.value;
      if (state.role === "seller") state.view = "seller";
      if (state.role === "admin") state.view = "admin";
      if (state.role === "buyer") state.view = "market";
      render();
    }
    if (event.target.id === "seller-picker") {
      state.selectedSellerId = event.target.value;
      render();
    }
  });

  app.addEventListener("submit", function (event) {
    const form = event.target;
    if (!form.dataset.form) return;
    event.preventDefault();

    if (form.dataset.form === "filters") {
      const data = new FormData(form);
      state.query = String(data.get("query") || "");
      state.category = String(data.get("category") || "All");
      state.seller = String(data.get("seller") || "All");
      state.price = String(data.get("price") || "All");
    }

    if (form.dataset.form === "listing") {
      createListing(form);
      form.reset();
    }

    render();
  });

  render();
})();
