// public/js/script.js

// 1. Check localStorage on page load
let savedTheme = localStorage.getItem('theme');  //it’s a built-in Web Storage API provided by modern browsers.

// If 'dark' is saved, apply .dark-mode class
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

// 2. Handle dark mode toggle button
const toggleBtn = document.getElementById('toggle-theme');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    // Check current state
    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
      // Switch to light mode
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// 3. Infinite scroll for reviews (unchanged)
let currentPage = 1;
let isLoading = false;
const reviewList = document.getElementById('review-list');
const loadingIndicator = document.getElementById('loading');

window.addEventListener('scroll', async () => {
  if (!reviewList) return; // Only on the reviews page

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    isLoading = true;
    loadingIndicator.style.display = 'block';

    try {
      const response = await fetch(`/reviews/api?page=${currentPage}&limit=5`);
      const data = await response.json();

      data.reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item border-bottom py-2';

        // If it's a video review
        if (review.videoUrl) {
          div.innerHTML = `
            <video src="${review.videoUrl}" controls width="320" height="240"></video>
            <br><small class="text-muted">Review ID: ${review.id}</small>
          `;
        } else {
          // Text review
          div.innerHTML = `
            <p>${review.text}</p>
            <small class="text-muted">Review ID: ${review.id}</small>
          `;
        }

        reviewList.appendChild(div);
      });

      currentPage++;
    } catch (error) {
      console.error('Error loading reviews:', error);
    }

    loadingIndicator.style.display = 'none';
    isLoading = false;
  }
});

// Initial load of reviews if on the reviews page
(async function loadInitialReviews() {
  if (!reviewList) return;
  try {
    const response = await fetch(`/reviews/api?page=${currentPage}&limit=5`);
    const data = await response.json();

    data.reviews.forEach(review => {
      const div = document.createElement('div');
      div.className = 'review-item border-bottom py-2';

      if (review.videoUrl) {
        div.innerHTML = `
          <video src="${review.videoUrl}" controls width="320" height="240"></video>
          <br><small class="text-muted">Review ID: ${review.id}</small>
        `;
      } else {
        div.innerHTML = `
          <p>${review.text}</p>
          <small class="text-muted">Review ID: ${review.id}</small>
        `;
      }

      reviewList.appendChild(div);
    });
    currentPage++;
  } catch (error) {
    console.error('Error loading initial reviews:', error);
  }
})();
