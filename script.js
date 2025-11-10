async function loadCatalog({ typeFilter = null, subcategoryFilter = null }) {
  const sheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbNCeoGvxNOeFByAzRCqZiW-1CAhSMYw5Rpx_FpDMkKBFhmgnqLK8G1QnaJkUQVr0VJvaTIiiHFbE/pub?gid=1529657982&single=true&output=csv';
  const res = await fetch(sheetUrl);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const csvText = await res.text();

  const rows = csvText
    .trim()
    .split('\n')
    .map((r) => r.split(','));
  const headers = rows.shift();
  const items = rows.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h.trim(), r[i]?.trim()]))
  );
  console.log(items);
  const filtered = items.filter((item) => {
    console.log('This is the visible item', item.Visible);
    return (
      (item.Visible?.toLowerCase() === 'true' || item.Visible === 'TRUE') &&
      (!typeFilter ||
        (item.Style && item.Style.toLowerCase() === typeFilter.toLowerCase()))
    );
    //&&
    // (!subcategoryFilter ||
    //   (item.Subcategory &&
    //     item.Subcategory.toLowerCase() ===
    //       subcategoryFilter.toLowerCase()))
  });
  console.log(filtered);
  console.log(typeFilter);

  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';

  document.querySelectorAll('.navbar nav a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.getAttribute('data-category');
      filterByCategory(category);
    });
  });

  function filterByCategory(category) {
    // Example: Filter based on a column name like "Category"
    const filtered = allItems.filter(
      (item) =>
        item.Category && item.Category.toLowerCase() === category.toLowerCase()
    );

    displayCatalog(filtered);
  }

  filtered.forEach((item) => {
    console.log('this is the image', item.Image);
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
            <div class="product-card">
              <img src="${item.Image || ''}" alt="${item.Name || ''}">
              <div class="info">
                <h3>${item.Name || ''}</h3>
                <p class="description">${item.Description || ''}</p>
                <p class="price">${item.CustomSellingPrice || ''} per Pc</p>
                <small>SKU: ${item.SKU || ''}</small>
              </div>
            </div>
          `;

    catalog.appendChild(card);
  });
}

loadCatalog({ typeFilter: 'Bracelet' });
