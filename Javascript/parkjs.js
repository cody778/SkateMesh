// Hero carousel
const heroCarousel = document.querySelector('.hero-carousel');
const heroImages = heroCarousel.querySelectorAll('.hero-carousel-image');
const heroPrevBtn = document.querySelector('.hero-arrow.left');
const heroNextBtn = document.querySelector('.hero-arrow.right');

let heroIndex = 0;

function updateHeroCarousel() {
  const heroWrapper = document.querySelector('.hero-carousel-wrapper');
  const imageWidth = heroWrapper.clientWidth || window.innerWidth;
  heroCarousel.style.transform = `translateX(${-heroIndex * imageWidth}px)`;
}

// Initialize carousel position
updateHeroCarousel();

// Update on window resize
window.addEventListener('resize', updateHeroCarousel);

heroNextBtn.addEventListener('click', () => {
  heroIndex = (heroIndex + 1) % heroImages.length;
  updateHeroCarousel();
});

heroPrevBtn.addEventListener('click', () => {
  heroIndex = (heroIndex - 1 + heroImages.length) % heroImages.length;
  updateHeroCarousel();
});

// Spots carousel
const carousel = document.querySelector('.spot-carousel');
const cards = carousel.querySelectorAll('.spot');
const carouselWrapper = document.querySelector('.carousel-wrapper');
const prevBtn = carouselWrapper.querySelector('.carousel-arrow.left');
const nextBtn = carouselWrapper.querySelector('.carousel-arrow.right');

let index = 0;

function updateCarousel() {
  if (window.innerWidth >= 768) {
    // Desktop: keep equal padding on both sides when jumping between first and last cards
    const wrapperWidth = carouselWrapper.getBoundingClientRect().width;
    const totalWidth = carousel.scrollWidth; // includes padding + gaps

    // First card: natural position (left padding from CSS)
    // Last card: shift so the right edge aligns with the wrapper's right edge,
    // preserving the same padding on the right side.
    let translateX = 0;
    if (index === cards.length - 1) {
      translateX = wrapperWidth - totalWidth;
    }

    carousel.style.transform = `translateX(${translateX}px)`;
  } else {
    // Mobile / tablet: step through cards one by one as before
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    carousel.style.transform = `translateX(${-index * cardWidth}px)`;
  }
}

nextBtn.addEventListener('click', () => {
  if (window.innerWidth >= 768) {
    // Desktop: jump directly to last card
    index = cards.length - 1;
  } else {
    // Mobile: step through each card as before
    index = (index + 1) % cards.length;
  }
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  if (window.innerWidth >= 768) {
    // Desktop: jump directly to first card
    index = 0;
  } else {
    // Mobile: step through each card as before
    index = (index - 1 + cards.length) % cards.length;
  }
  updateCarousel();
});


const openBtn = document.querySelector('.description .btn');
const modal = document.getElementById('sesh-modal');

if (openBtn && modal) {
  const cancelBtn = modal.querySelector('.modal-cancel');
  const confirmBtn = modal.querySelector('.modal-confirm');
  const closeBtn = modal.querySelector('.modal-close');

  let scrollY = 0;

  function openModal() {
    scrollY = window.scrollY;
    modal.classList.add('active');
    // Prevent background scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    // Restore scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Add your form submission logic here
      closeModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Camera upload modal
const cameraBtn = document.getElementById('camera-btn');
const cameraModal = document.getElementById('camera-modal');

if (cameraBtn && cameraModal) {
  const cameraCancelBtn = cameraModal.querySelector('.modal-cancel');
  const cameraUploadBtn = cameraModal.querySelector('.modal-confirm');
  const cameraCloseBtn = cameraModal.querySelector('.modal-close');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const previewImage = document.getElementById('preview-image');

  let scrollY = 0;

  function openCameraModal() {
    scrollY = window.scrollY;
    cameraModal.classList.add('active');
    // Prevent background scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function closeCameraModal() {
    cameraModal.classList.remove('active');
    // Restore scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
    // Reset file input and preview
    fileInput.value = '';
    filePreview.style.display = 'none';
    previewImage.src = '';
  }

  cameraBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCameraModal();
  });

  if (cameraCancelBtn) {
    cameraCancelBtn.addEventListener('click', closeCameraModal);
  }

  if (cameraUploadBtn) {
    cameraUploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (fileInput.files && fileInput.files.length > 0) {
        // Add your upload logic here
        console.log('Uploading file:', fileInput.files[0]);
        // For now, just close the modal
        closeCameraModal();
      } else {
        alert('Please select a file to upload');
      }
    });
  }

  if (cameraCloseBtn) {
    cameraCloseBtn.addEventListener('click', closeCameraModal);
  }

  cameraModal.addEventListener('click', (e) => {
    if (e.target === cameraModal) {
      closeCameraModal();
    }
  });

  // File preview
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImage.src = event.target.result;
          filePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        filePreview.style.display = 'none';
        previewImage.src = '';
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cameraModal.classList.contains('active')) {
      closeCameraModal();
    }
  });
}

// Map functionality with routes, zoom, and drag
const mapWrapper = document.getElementById('map-wrapper');
const mapImage = document.getElementById('map-image');
const mapContainer = mapWrapper.querySelector('.map-container');
const mapPrevBtn = document.getElementById('map-prev-btn');
const mapNextBtn = document.getElementById('map-next-btn');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetBtn = document.getElementById('reset-map');
const routeButtons = document.querySelectorAll('.route-button');


function getCurrentPageKey() {
    const path = window.location.pathname.toLowerCase();
  
    if (path.includes('robbiespottet')) return 'RS';
    if (path.includes('laesseoesgade')) return 'LG';
    if (path.includes('skatescene')) return 'ASS';
  
    return null;
  }
// Route images
const ROUTES_BY_PAGE = {
    RS: [
      { name: 'Base Map', src: 'Images/Map.png' },
      { name: 'RS to ASS', src: 'Images/Routes/RS-ASSRoute.png' },
      { name: 'RS to LG', src: 'Images/Routes/RS-LGRoute.png' }
    ],
    LG: [
      { name: 'Base Map', src: 'Images/Map.png' },
      { name: 'LG to RS', src: 'Images/Routes/RS-LGRoute.png' },
      { name: 'LG to ASS', src: 'Images/Routes/LS-ASSRoute.png' }
    ],
    ASS: [
      { name: 'Base Map', src: 'Images/Map.png' },
      { name: 'ASS to RS', src: 'Images/Routes/ASS-RSRoute.png' },
      { name: 'ASS to LG', src: 'Images/Routes/LG-ASSRoute.png' }
    ]
  };

const pageKey = getCurrentPageKey();
const routes = ROUTES_BY_PAGE[pageKey];


let currentRouteIndex = 0;
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartTranslateX = 0;
let dragStartTranslateY = 0;
let imageLoaded = false;
let naturalWidth = 0;
let naturalHeight = 0;

const MAX_SCALE = 15; // Can zoom in much more
const ZOOM_STEP = 0.2;
// Minimum scale is computed dynamically so the map always covers the wrapper
function computeMinScale() {
  if (!imageLoaded) return 1;
  const rect = mapWrapper.getBoundingClientRect();
  const wrapperWidth = rect.width;
  const wrapperHeight = rect.height;

  if (!wrapperWidth || !wrapperHeight || !naturalWidth || !naturalHeight) {
    return 1;
  }

  const ratio = naturalWidth / naturalHeight;
  // At scale = 1, displayedHeight = wrapperHeight, displayedWidth = ratio * wrapperHeight.
  // Ensure the image is never smaller than the wrapper in either dimension.
  const minScaleForWidth = wrapperWidth / (ratio * wrapperHeight);
  const minScaleForHeight = 1; // because displayedHeight = wrapperHeight at scale 1

  return Math.max(1, minScaleForWidth, minScaleForHeight);
}

const MIN_SCALE = 1; // base lower bound; real min enforced by computeMinScale

// Load image and get dimensions
function loadMapImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      naturalWidth = img.naturalWidth;
      naturalHeight = img.naturalHeight;
      imageLoaded = true;
      resolve();
    };
    img.src = src;
  });
}

// Constrain translation so the map never leaves empty space inside the wrapper
function clampTranslation() {
  const rect = mapWrapper.getBoundingClientRect();
  const wrapperWidth = rect.width;
  const wrapperHeight = rect.height;

  // Image is height: 100% of wrapper, width auto, then scaled.
  const displayedHeight = wrapperHeight * scale;
  const displayedWidth = (naturalWidth / naturalHeight) * wrapperHeight * scale;

  const minTranslateX = Math.min(0, wrapperWidth - displayedWidth);
  const maxTranslateX = 0;
  const minTranslateY = Math.min(0, wrapperHeight - displayedHeight);
  const maxTranslateY = 0;

  translateX = Math.min(maxTranslateX, Math.max(minTranslateX, translateX));
  translateY = Math.min(maxTranslateY, Math.max(minTranslateY, translateY));
}

// Update map transform
function updateMapTransform() {
  clampTranslation();
  mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Reset map to default view
function resetMapView() {
  scale = computeMinScale();
  translateX = 0;
  translateY = 0;
  updateMapTransform();
}

// Zoom in/out
function zoomMap(delta, clientX, clientY) {
  if (!imageLoaded) return;

  const rect = mapWrapper.getBoundingClientRect();
  const wrapperCenterX = rect.left + rect.width / 2;
  const wrapperCenterY = rect.top + rect.height / 2;

  // Use provided point or center of wrapper
  const zoomPointX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
  const zoomPointY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

  const oldScale = scale;
  const minScale = computeMinScale();
  scale = Math.max(minScale, Math.min(MAX_SCALE, scale + delta));

  if (scale !== oldScale) {
    // Calculate the point in image coordinates before zoom
    const imageX = (zoomPointX - translateX) / oldScale;
    const imageY = (zoomPointY - translateY) / oldScale;

    // Adjust translation to keep the zoom point fixed
    translateX = zoomPointX - imageX * scale;
    translateY = zoomPointY - imageY * scale;

    updateMapTransform();
  }
}

// Switch route
async function switchRoute(direction) {
  currentRouteIndex = (currentRouteIndex + direction + routes.length) % routes.length;
  const route = routes[currentRouteIndex];
  
  // Reset view when switching routes
  resetMapView();
  
  // Load new image
  imageLoaded = false;
  mapImage.style.opacity = '0.5';
  
  mapImage.style.opacity = '0.5';

  mapImage.onload = () => {
    imageLoaded = true;
    mapImage.style.opacity = '1';
    resetMapView();
  };

  mapImage.src = route.src;
}

// Mouse drag handlers
mapContainer.addEventListener('mousedown', (e) => {
  if (e.button === 0) { // Left mouse button
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTranslateX = translateX;
    dragStartTranslateY = translateY;
    mapImage.style.cursor = 'grabbing';
    mapImage.classList.add('dragging');
    e.preventDefault();
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    translateX = dragStartTranslateX + (e.clientX - dragStartX);
    translateY = dragStartTranslateY + (e.clientY - dragStartY);
    updateMapTransform();
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    mapImage.style.cursor = 'grab';
    mapImage.classList.remove('dragging');
  }
});

// Touch drag handlers
let touchStartDistance = 0;
let touchStartScale = 1;
let touchStartTranslateX = 0;
let touchStartTranslateY = 0;
let lastTouchCenterX = 0;
let lastTouchCenterY = 0;

mapContainer.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    // Single touch - drag
    isDragging = true;
    const touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    dragStartTranslateX = translateX;
    dragStartTranslateY = translateY;
    mapImage.classList.add('dragging');
  } else if (e.touches.length === 2) {
    // Two touches - pinch zoom
    isDragging = false;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    touchStartDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    touchStartScale = scale;
    touchStartTranslateX = translateX;
    touchStartTranslateY = translateY;
    mapImage.classList.add('dragging');
    
    lastTouchCenterX = (touch1.clientX + touch2.clientX) / 2;
    lastTouchCenterY = (touch1.clientY + touch2.clientY) / 2;
  }
  e.preventDefault();
});

mapContainer.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && isDragging) {
    // Single touch - drag
    const touch = e.touches[0];
    translateX = dragStartTranslateX + (touch.clientX - dragStartX);
    translateY = dragStartTranslateY + (touch.clientY - dragStartY);
    updateMapTransform();
  } else if (e.touches.length === 2) {
    // Two touches - pinch zoom
    isDragging = false;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    const scaleFactor = distance / touchStartDistance;
    const minScale = computeMinScale();
    scale = Math.max(minScale, Math.min(MAX_SCALE, touchStartScale * scaleFactor));
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    const rect = mapWrapper.getBoundingClientRect();
    const zoomPointX = centerX - rect.left;
    const zoomPointY = centerY - rect.top;
    
    const imageX = (zoomPointX - touchStartTranslateX) / touchStartScale;
    const imageY = (zoomPointY - touchStartTranslateY) / touchStartScale;
    
    translateX = zoomPointX - imageX * scale;
    translateY = zoomPointY - imageY * scale;
    
    updateMapTransform();
  }
  e.preventDefault();
});

mapContainer.addEventListener('touchend', () => {
  isDragging = false;
  mapImage.classList.remove('dragging');
});

// Mouse wheel zoom
mapContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
  zoomMap(delta, e.clientX, e.clientY);
});

// Button handlers
mapPrevBtn.addEventListener('click', () => switchRoute(-1));
mapNextBtn.addEventListener('click', () => switchRoute(1));
zoomInBtn.addEventListener('click', () => {
  const rect = mapWrapper.getBoundingClientRect();
  zoomMap(ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
});
zoomOutBtn.addEventListener('click', () => {
  const rect = mapWrapper.getBoundingClientRect();
  zoomMap(-ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
});
resetBtn.addEventListener('click', resetMapView);

// Desktop route buttons: jump directly to specific routes
if (routeButtons && routeButtons.length) {
  routeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(btn.dataset.routeIndex, 10);
      if (Number.isNaN(targetIndex)) return;
      const delta = targetIndex - currentRouteIndex;
      if (delta !== 0) {
        switchRoute(delta);
      }

      routeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Initialize
mapImage.style.cursor = 'grab';
loadMapImage(routes[currentRouteIndex].src).then(() => {
  mapImage.src = routes[currentRouteIndex].src;
  resetMapView();
});

// Burger menu functionality
const burgerMenuBtn = document.getElementById('burger-menu-btn');
const slideMenu = document.getElementById('slide-menu');
const slideMenuClose = document.getElementById('slide-menu-close');

const slideMenuBackdrop = document.getElementById('slide-menu-backdrop');

function openMenu() {
  slideMenu.classList.add('active');
  slideMenuBackdrop.classList.add('active');
  burgerMenuBtn.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  slideMenu.classList.remove('active');
  slideMenuBackdrop.classList.remove('active');
  burgerMenuBtn.classList.remove('active');
  document.body.style.overflow = '';
}

if (burgerMenuBtn) {
  burgerMenuBtn.addEventListener('click', openMenu);
}

if (slideMenuClose) {
  slideMenuClose.addEventListener('click', closeMenu);
}

if (slideMenuBackdrop) {
  slideMenuBackdrop.addEventListener('click', closeMenu);
}

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && slideMenu.classList.contains('active')) {
    closeMenu();
  }
});