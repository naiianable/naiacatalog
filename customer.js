// =====================
// Customer Catalog
// =====================

const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalSku = document.getElementById('modal-sku');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalClose = document.getElementById('modal-close');

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// =====================
// Load Customer Catalog
// =====================

async function loadCatalog({ typeFilter = null }) {
  const sheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbNCeoGvxNOeFByAzRCqZiW-1CAhSMYw5Rpx_FpDMkKBFhmgnqLK8G1QnaJkUQVr0VJvaTIiiHFbE/pub?gid=1529657982&single=true&output=csv';

  try {
    const res = await fetch(sheetUrl);
    const csvText = await res.text();

    const rows = csvText
      .trim()
      .split('\n')
      .map((r) => r.split(','));

    const headers = rows.shift();

    const items = rows.map((r) =>
      Object.fromEntries(headers.map((h, i) => [h.trim(), r[i]?.trim()])),
    );

    const catalog = document.getElementById('catalog');

    catalog.innerHTML = '';

    const filtered = items.filter((item) => {
      const visible =
        item.Visible?.toLowerCase() === 'true' || item.Visible === 'TRUE';

      const matchesCategory =
        !typeFilter ||
        (item.Style && item.Style.toLowerCase() === typeFilter.toLowerCase());

      return visible && matchesCategory;
    });

    // =====================
    // Create Product Cards
    // =====================

    filtered.forEach((item) => {
      const card = document.createElement('div');

      card.className = 'card';

      const images = [item.Image, item.Image2, item.Image3, item.Image4].filter(
        Boolean,
      );

      card.innerHTML = `
        <div class="product-card">

          <div class="product-image-container">
            <img
              class="main-img"
              src="${images[0] || ''}"
              alt="${item.Name || ''}"
            >
          </div>

          <div class="info">

            <h3>
              ${item.Name || ''}
            </h3>

            <p class="description">
              ${item.Description || ''}
            </p>

            <small>
              SKU: ${item.SKU || ''}
            </small>

          </div>

        </div>
      `;

      catalog.appendChild(card);

      // Image opens larger view
      const mainImg = card.querySelector('.main-img');

      mainImg.addEventListener('click', () => {
        openModal(item, images[0]);
      });
    });
  } catch (error) {
    console.error('Unable to load catalog:', error);

    document.getElementById('catalog').innerHTML =
      '<p>Unable to load catalog.</p>';
  }
}

// =====================
// Product Modal
// =====================

function openModal(item, imgSrc) {
  modalImg.src = imgSrc;

  modalTitle.textContent = item.Name || '';

  modalDesc.textContent = item.Description || '';

  modalSku.textContent = item.SKU || '';

  // Build thumbnails

  const images = [item.Image, item.Image2, item.Image3, item.Image4].filter(
    Boolean,
  );

  modalThumbnails.innerHTML = images
    .map(
      (url) =>
        `<img
            class="modal-thumb"
            src="${url}"
            alt="Thumbnail"
          >`,
    )
    .join('');

  // Thumbnail click

  modalThumbnails.querySelectorAll('.modal-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      modalImg.src = thumb.src;
    });
  });

  modal.classList.remove('hidden');
}

// =======================
// Category Navigation
// =======================

document.querySelectorAll('.navbar nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const category = link.dataset.category;

    document
      .querySelectorAll('.navbar nav a')
      .forEach((l) => l.classList.remove('active'));

    link.classList.add('active');

    loadCatalog({
      typeFilter: category,
    });
  });
});

// =====================
// Initial Catalog
// =====================

loadCatalog({
  typeFilter: 'bracelet',
});
