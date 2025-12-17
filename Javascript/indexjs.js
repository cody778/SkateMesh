const eventBtn = document.querySelector('.event-btn');
  const peopleCountEl = document.getElementById('people-count');
  const badge = document.querySelector('.attendance-badge');

  let attending = false;
  let peopleCount = 14;

  eventBtn.addEventListener('click', (e) => {
    e.preventDefault();

    attending = !attending;

  if (attending) {
    peopleCount++;
    eventBtn.classList.add('attending');
    eventBtn.textContent = 'Cancel attendance';
    badge.style.display = 'block';
    peopleCountEl.classList.add('attending');
  } else {
    peopleCount--;
    eventBtn.classList.remove('attending');
    eventBtn.textContent = "I'm coming too!";
    badge.style.display = 'none';
    peopleCountEl.classList.remove('attending');
  }
    peopleCountEl.textContent = peopleCount;
  });


  const carousel = document.querySelector('.spot-carousel');
  const cards = carousel.querySelectorAll('.spot');
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const prevBtn = document.querySelector('.carousel-arrow.left');
  const nextBtn = document.querySelector('.carousel-arrow.right');
  const mapImage = document.querySelector('.map-image');
  const mapWrapper = document.querySelector('.map-wrapper');
  let resizeTimeout;

  let index = 0;
  let imageLoaded = false;
  let naturalWidth = 0;
  let naturalHeight = 0;

  // Map coordinates: [x1, y1, x2, y2] for each area
  // Order matches carousel: RobbieSpottet (0), SkateScene (1), LaessoesGade (2)
  const mapCoordinates = [
    { name: 'RobbieSpottet', coords: [1580, 674, 1889, 838] },
    { name: 'SkateScene', coords: [575, 3793, 822, 3970] },
    { name: 'LaessoesGade', coords: [2091, 655, 2393, 838] }
  ];

  // Wait for image to load to get natural dimensions
  mapImage.addEventListener('load', () => {
    naturalWidth = mapImage.naturalWidth;
    naturalHeight = mapImage.naturalHeight;
    imageLoaded = true;
    updateMap(index, false); // Initial position without animation
  });

  // If image is already loaded
  if (mapImage.complete && mapImage.naturalWidth > 0) {
    naturalWidth = mapImage.naturalWidth;
    naturalHeight = mapImage.naturalHeight;
    imageLoaded = true;
    updateMap(index, false); // Initial position without animation
  }

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

  function calculateMapTransform(coordIndex) {
    if (!imageLoaded) return { translateX: 0, translateY: 0, scale: 1 };

    const coords = mapCoordinates[coordIndex].coords;
    const [x1, y1, x2, y2] = coords;
    
    // Get viewport dimensions
    const viewportWidth = mapWrapper.clientWidth;
    const viewportHeight = mapWrapper.clientHeight;
    
    // Get displayed image dimensions (image is height: 100%, width: auto)
    const displayedHeight = viewportHeight;
    const displayedWidth = (naturalWidth / naturalHeight) * displayedHeight;
    
    // Calculate scale ratio between displayed and natural size
    const scaleRatioX = displayedWidth / naturalWidth;
    const scaleRatioY = displayedHeight / naturalHeight;
    
    // Convert coordinates from natural size to displayed size
    const displayedX1 = x1 * scaleRatioX;
    const displayedY1 = y1 * scaleRatioY;
    const displayedX2 = x2 * scaleRatioX;
    const displayedY2 = y2 * scaleRatioY;
    
    // Calculate center of the area in displayed coordinates
    const centerX = (displayedX1 + displayedX2) / 2;
    const centerY = (displayedY1 + displayedY2) / 2;
    
    // Calculate dimensions of the area in displayed coordinates
    const areaWidth = displayedX2 - displayedX1;
    const areaHeight = displayedY2 - displayedY1;
    
    // Calculate zoom scale to fit area nicely in viewport (with minimal padding for maximum zoom)
    const scaleX = viewportWidth / (areaWidth * 0.7); // 0.7x padding for even more zoom
    const scaleY = viewportHeight / (areaHeight * 0.7);
    const scale = Math.min(scaleX, scaleY, 8); // Cap max zoom at 8x for even more zoom
    
    // Calculate translation to center the area perfectly in the wrapper
    // After scaling, the center point position changes
    const scaledCenterX = centerX * scale;
    const scaledCenterY = centerY * scale;
    // Center the area in the viewport, then shift 20px to the left
    const translateX = viewportWidth / 2 - scaledCenterX;
    const translateY = viewportHeight / 2 - scaledCenterY;
    
    return { translateX, translateY, scale };
  }

  function updateMap(coordIndex, animate = true) {
    if (!imageLoaded) return;

    const transform = calculateMapTransform(coordIndex);
    
    if (animate) {
      // Calculate scale to fit image width to wrapper width
      const viewportWidth = mapWrapper.clientWidth;
      const displayedHeight = mapWrapper.clientHeight;
      const displayedWidth = (naturalWidth / naturalHeight) * displayedHeight;
      const fitWidthScale = viewportWidth / displayedWidth;
      
      // Zoom out first - only until image width equals wrapper width
      mapImage.style.transition = 'transform 0.3s ease';
      mapImage.style.transform = `translate(0px, 0px) scale(${fitWidthScale})`;
      
      // Then zoom in to new position
      setTimeout(() => {
        mapImage.style.transition = 'transform 0.6s ease';
        mapImage.style.transform = `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`;
      }, 300);
    } else {
      // No animation for initial load
      mapImage.style.transition = 'none';
      mapImage.style.transform = `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`;
    }
  }

  function updateCarouselAndMap() {
    updateCarousel();
    updateMap(index, true); // Animate map transition
  }

  nextBtn.addEventListener('click', () => {
    if (window.innerWidth >= 768) {
      // Desktop: jump directly to last card
      index = cards.length - 1;
    } else {
      // Mobile: step through each card as before
      index = (index + 1) % cards.length;
    }
    updateCarouselAndMap();
  });

  prevBtn.addEventListener('click', () => {
    if (window.innerWidth >= 768) {
      // Desktop: jump directly to first card
      index = 0;
    } else {
      // Mobile: step through each card as before
      index = (index - 1 + cards.length) % cards.length;
    }
    updateCarouselAndMap();
  });

  // Recalculate map transform on resize to keep areas aligned
  window.addEventListener('resize', () => {
    if (!imageLoaded) return;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel(); // Update carousel position on resize
      updateMap(index, false);
    }, 150);
  });

  // Desktop location buttons: jump directly to specific locations
  const locationButtons = document.querySelectorAll('.route-button');
  if (locationButtons && locationButtons.length) {
    // Set initial active button
    if (locationButtons[0]) {
      locationButtons[0].classList.add('active');
    }

    locationButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetIndex = parseInt(btn.dataset.locationIndex, 10);
        if (Number.isNaN(targetIndex)) return;
        
        // Update carousel index and map
        index = targetIndex;
        updateCarouselAndMap();

        // Update active button
        locationButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

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
