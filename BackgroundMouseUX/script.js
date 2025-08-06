const bgImage = document.querySelector('.background-image');
const bgGradient = document.querySelector('.background-gradient');
const useGradientCheckbox = document.getElementById('use-gradient');

// Panels
const settingsPanel = document.getElementById('settings-panel');
const cglPanel = document.getElementById('cgl-panel');
const openCglMenuBtn = document.getElementById('open-cgl-menu');
const backToSettingsBtn = document.getElementById('back-to-settings');
const addCglBtn = document.getElementById('add-cgl');

// Sliders
const blurSlider = document.getElementById('blur');
const zoomSlider = document.getElementById('zoom');
const sensitivitySlider = document.getElementById('sensitivity');
const xScaleSlider = document.getElementById('x-scale');
const yScaleSlider = document.getElementById('y-scale');

// Values
const blurValue = document.getElementById('blur-value');
const zoomValue = document.getElementById('zoom-value');
const sensitivityValue = document.getElementById('sensitivity-value');
const xScaleValue = document.getElementById('x-scale-value');
const yScaleValue = document.getElementById('y-scale-value');

// State
let blurAmount = parseInt(blurSlider.value);
let zoom = parseFloat(zoomSlider.value);
let sensitivity = parseInt(sensitivitySlider.value);
let xScale = parseFloat(xScaleSlider.value);
let yScale = parseFloat(yScaleSlider.value);

// Color Gradient Layers
let gradientColors = ['#ff9a9e', '#fad0c4']; // Start with 2

function getActiveBackground() {
  return useGradientCheckbox.checked ? bgGradient : bgImage;
}

function updateImageStyle() {
  const bg = getActiveBackground();
  bg.style.filter = `blur(${blurAmount}px)`;
  bg.style.width = `${zoom * 100}%`;

  blurValue.textContent = blurAmount;
  zoomValue.textContent = zoom.toFixed(2);
  sensitivityValue.textContent = sensitivity;
  xScaleValue.textContent = xScale.toFixed(2);
  yScaleValue.textContent = yScale.toFixed(2);
}

function updateGradientColors() {
  const gradient = `linear-gradient(135deg, ${gradientColors.join(', ')})`;
  bgGradient.style.background = gradient;
}

// Event: Toggle between image and gradient
useGradientCheckbox.addEventListener('change', () => {
  if (useGradientCheckbox.checked) {
    bgGradient.style.display = 'block';
    bgImage.style.display = 'none';
    updateGradientColors();
  } else {
    bgGradient.style.display = 'none';
    bgImage.style.display = 'block';
  }
  updateImageStyle();
});

// Event: Sliders
blurSlider.addEventListener('input', () => {
  blurAmount = parseInt(blurSlider.value);
  updateImageStyle();
});
zoomSlider.addEventListener('input', () => {
  zoom = parseFloat(zoomSlider.value);
  updateImageStyle();
});
sensitivitySlider.addEventListener('input', () => {
  sensitivity = parseInt(sensitivitySlider.value);
  updateImageStyle();
});
xScaleSlider.addEventListener('input', () => {
  xScale = parseFloat(xScaleSlider.value);
  xScaleValue.textContent = xScale.toFixed(2);
});
yScaleSlider.addEventListener('input', () => {
  yScale = parseFloat(yScaleSlider.value);
  yScaleValue.textContent = yScale.toFixed(2);
});

// Mouse movement tracking
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const offsetX = x * sensitivity * xScale;
  const offsetY = y * sensitivity * yScale;

  const bg = getActiveBackground();
  bg.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
});

// === Gradient Color Layer (CGL) Management ===
const cglPageContainer = document.getElementById('cgl-page-container');
const cglPrevBtn = document.getElementById('cgl-prev');
const cglNextBtn = document.getElementById('cgl-next');

let currentCglPage = 0;
const CGLS_PER_PAGE = 3;

function renderCGLCarousel() {
  cglPageContainer.innerHTML = '';

  const start = currentCglPage * CGLS_PER_PAGE;
  const end = start + CGLS_PER_PAGE;

  const currentPageColors = gradientColors.slice(start, end);

  currentPageColors.forEach((color, index) => {
    const item = document.createElement('div');
    item.className = 'cgl-item';

    const input = document.createElement('input');
    input.type = 'color';
    input.value = color;
    input.addEventListener('input', () => {
      gradientColors[start + index] = input.value;
      updateGradientColors();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.disabled = gradientColors.length === 1;
    deleteBtn.addEventListener('click', () => {
      if (gradientColors.length > 1) {
        gradientColors.splice(start + index, 1);

        // If we deleted last item on last page, move back one page
        const totalPages = Math.ceil(gradientColors.length / CGLS_PER_PAGE);
        if (currentCglPage >= totalPages) {
          currentCglPage = totalPages - 1;
        }

        renderCGLCarousel();
        updateGradientColors();
      }
    });

    item.appendChild(input);
    item.appendChild(deleteBtn);
    cglPageContainer.appendChild(item);
  });

  // Disable arrows if needed
  cglPrevBtn.disabled = currentCglPage === 0;
  cglNextBtn.disabled = (currentCglPage + 1) * CGLS_PER_PAGE >= gradientColors.length;
}

addCglBtn.addEventListener('click', () => {
  gradientColors.push('#ffffff');
  const totalPages = Math.ceil(gradientColors.length / CGLS_PER_PAGE);
  currentCglPage = totalPages - 1;
  renderCGLCarousel();
  updateGradientColors();
});

openCglMenuBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
  cglPanel.style.display = 'flex';
  renderCGLCarousel();
});

backToSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'flex';
  cglPanel.style.display = 'none';
});

cglPrevBtn.addEventListener('click', () => {
  if (currentCglPage > 0) {
    currentCglPage--;
    renderCGLCarousel();
  }
});

cglNextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(gradientColors.length / CGLS_PER_PAGE);
  if (currentCglPage < totalPages - 1) {
    currentCglPage++;
    renderCGLCarousel();
  }
});

// Init
updateImageStyle();
updateGradientColors();
bgGradient.style.display = 'block';
bgImage.style.display = 'none';