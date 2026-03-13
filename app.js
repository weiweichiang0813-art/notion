/**
 * Winnie's Food Map - Interactive Map Application
 * ================================================
 */

// Global state
let restaurants = [];
let map = null;
let markers = [];
let currentFilters = {
  city: 'all',
  cuisine: 'all',
  rating: 'all'
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initMap();
  initFilters();
  initModal();
  updateStats();
  renderRestaurants();
});

// Load restaurant data
async function loadData() {
  try {
    const response = await fetch('data/restaurants.json');
    restaurants = await response.json();
    console.log(`✓ Loaded ${restaurants.length} restaurants`);
  } catch (error) {
    console.error('Error loading data:', error);
    restaurants = [];
  }
}

// Initialize Leaflet map
function initMap() {
  // Create map centered on Toronto
  map = L.map('map', {
    center: [43.6532, -79.3832],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // Dark map tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Add markers
  addMarkers();
}

// Add markers to map
function addMarkers() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const filtered = getFilteredRestaurants();

  filtered.forEach(restaurant => {
    // Create custom icon
    const icon = L.divIcon({
      className: 'custom-marker-wrapper',
      html: `<div class="custom-marker">${getCuisineEmoji(restaurant.cuisine)}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([restaurant.lat, restaurant.lng], { icon })
      .addTo(map)
      .bindPopup(createPopupContent(restaurant));

    marker.on('click', () => {
      openModal(restaurant);
    });

    markers.push(marker);
  });

  // Fit bounds if we have markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

// Get cuisine emoji
function getCuisineEmoji(cuisine) {
  const emojiMap = {
    'Japanese': '🍜',
    'Thai': '🍲',
    'Chinese': '🥡',
    'Taiwanese': '🧋',
    'Italian': '🍝',
    'Korean': '🍖',
    'Vietnamese': '🍜',
    'Canadian': '🍁',
    'French': '🥐',
    'Middle East': '🧆',
    'American': '🍔'
  };
  return emojiMap[cuisine] || '🍽️';
}

// Create popup content
function createPopupContent(restaurant) {
  return `
    <div class="popup-content">
      <div class="popup-title">${restaurant.name}</div>
      <div class="popup-cuisine">${restaurant.cuisine} • ${restaurant.type}</div>
      <div class="popup-rating">${'⭐'.repeat(restaurant.rating)}</div>
      <button class="popup-btn" onclick="openModal(restaurants.find(r => r.name === '${restaurant.name.replace(/'/g, "\\'")}'))">
        View Details
      </button>
    </div>
  `;
}

// Initialize filters
function initFilters() {
  const cityFilter = document.getElementById('cityFilter');
  const cuisineFilter = document.getElementById('cuisineFilter');
  const ratingFilter = document.getElementById('ratingFilter');
  const resetBtn = document.getElementById('resetFilters');

  // Populate city options
  const cities = [...new Set(restaurants.map(r => r.city))].sort();
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  // Populate cuisine options
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))].sort();
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.value = cuisine;
    option.textContent = cuisine;
    cuisineFilter.appendChild(option);
  });

  // Event listeners
  cityFilter.addEventListener('change', (e) => {
    currentFilters.city = e.target.value;
    applyFilters();
  });

  cuisineFilter.addEventListener('change', (e) => {
    currentFilters.cuisine = e.target.value;
    applyFilters();
  });

  ratingFilter.addEventListener('change', (e) => {
    currentFilters.rating = e.target.value;
    applyFilters();
  });

  resetBtn.addEventListener('click', () => {
    currentFilters = { city: 'all', cuisine: 'all', rating: 'all' };
    cityFilter.value = 'all';
    cuisineFilter.value = 'all';
    ratingFilter.value = 'all';
    applyFilters();
  });
}

// Get filtered restaurants
function getFilteredRestaurants() {
  return restaurants.filter(r => {
    if (currentFilters.city !== 'all' && r.city !== currentFilters.city) return false;
    if (currentFilters.cuisine !== 'all' && r.cuisine !== currentFilters.cuisine) return false;
    if (currentFilters.rating !== 'all' && r.rating < parseInt(currentFilters.rating)) return false;
    return true;
  });
}

// Apply filters
function applyFilters() {
  addMarkers();
  renderRestaurants();
}

// Render restaurant cards
function renderRestaurants() {
  const container = document.getElementById('restaurantList');
  const filtered = getFilteredRestaurants();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>No restaurants found with current filters</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(restaurant => `
    <div class="restaurant-card" onclick="openModal(restaurants.find(r => r.name === '${restaurant.name.replace(/'/g, "\\'")}'))">
      <div class="card-header">
        <h3 class="card-title">${restaurant.name}</h3>
        <span class="card-rating">${'⭐'.repeat(restaurant.rating)}</span>
      </div>
      <span class="card-cuisine">${restaurant.cuisine}</span>
      <p class="card-address">${restaurant.address}</p>
      <p class="card-city">📍 ${restaurant.city}</p>
    </div>
  `).join('');
}

// Update stats
function updateStats() {
  const totalPlaces = restaurants.length;
  const totalCities = new Set(restaurants.map(r => r.city)).size;
  const totalCuisines = new Set(restaurants.map(r => r.cuisine)).size;

  animateNumber('totalPlaces', totalPlaces);
  animateNumber('totalCities', totalCities);
  animateNumber('totalCuisines', totalCuisines);
}

// Animate number counting
function animateNumber(elementId, target) {
  const element = document.getElementById(elementId);
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Modal functionality
function initModal() {
  const modal = document.getElementById('detailModal');
  const closeBtn = document.getElementById('closeModal');

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// Open modal with restaurant details
function openModal(restaurant) {
  const modal = document.getElementById('detailModal');
  
  document.getElementById('modalTitle').textContent = restaurant.name;
  document.getElementById('modalRating').textContent = '⭐'.repeat(restaurant.rating);
  document.getElementById('modalAddress').textContent = restaurant.address;
  document.getElementById('modalCuisine').textContent = restaurant.cuisine;
  document.getElementById('modalType').textContent = restaurant.type;
  
  const blogEl = document.getElementById('modalBlog');
  if (restaurant.blog) {
    blogEl.textContent = restaurant.blog;
    blogEl.style.display = 'block';
  } else {
    blogEl.style.display = 'none';
  }
  
  const mapLink = document.getElementById('modalMapLink');
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('detailModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Make openModal available globally for popup buttons
window.openModal = openModal;
