document.addEventListener('DOMContentLoaded', () => {
  // 1. Define Category Configurations
  const CATEGORY_MAP = {
    'avatars': {
      name: 'Avatars & Digital Humans',
      keywords: ['avatar', 'head', 'face', 'portrait', 'character', 'human', 'body', 'pose', 'gesture', 'skeletal', 'performance capture', 'digital humans', '3drealhead'],
      color: '#e8f0fe',
      textColor: '#1a73e8'
    },
    'splatting': {
      name: 'Gaussian Splatting',
      keywords: ['splatting', 'gaussian splat', 'splats', 'rasterization', 'stochasticsplats', 'rasterizer', 'tega'],
      color: '#fce8e6',
      textColor: '#d93025'
    },
    'rendering': {
      name: 'Neural Rendering & Relighting',
      keywords: ['rendering', 'relight', 'relighting', 'radiance field', 'reflectance', 'shading', 'albedo', 'inverse rendering', 'lightstage', 'textured', 'translucent'],
      color: '#e6f4ea',
      textColor: '#137333'
    },
    'simulation': {
      name: 'Simulation & Physics',
      keywords: ['simulation', 'physics', 'simulator', 'trajectory', 'inertia', 'gravity', 'collision', 'deformable', 'rigid', 'as-rigid-as-possible', 'arap'],
      color: '#fef7e0',
      textColor: '#b06000'
    },
    'optimization': {
      name: 'Optimization & Math',
      keywords: ['optimization', 'optimize', 'monte carlo', 'variance reduction', 'estimator', 'gradient', 'solver', 'algorithms', 'differentiable', 'dco', 'ratio control'],
      color: '#f3e8fd',
      textColor: '#8631d4'
    }
  };

  const publicationsContainer = document.querySelector('.content');
  const entries = document.querySelectorAll('.publication_entry');
  const yearSections = document.querySelectorAll('.year_section');

  // Set default view layout
  publicationsContainer.classList.add('grid-view');

  // 2. Auto-Categorize Publications
  entries.forEach(entry => {
    const title = entry.querySelector('.publication_title').textContent.toLowerCase();
    const abstract = entry.querySelector('.publication_abstract').textContent.toLowerCase();
    const venue = entry.querySelector('.publication_venue').textContent.toLowerCase();
    const contentText = `${title} ${abstract} ${venue}`;

    const assigned = [];

    // Match keywords
    Object.keys(CATEGORY_MAP).forEach(catKey => {
      const config = CATEGORY_MAP[catKey];
      const hasMatch = config.keywords.some(keyword => contentText.includes(keyword));
      if (hasMatch) {
        assigned.push(catKey);
      }
    });

    // Fallback category if none matched
    if (assigned.length === 0) {
      assigned.push('optimization'); // default to optimization/math
    }

    // Save assigned categories on the element
    entry.setAttribute('data-assigned-categories', assigned.join(','));

    // Create & append category badges inside the publication content
    const pubContent = entry.querySelector('.publication_content');
    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'publication_badges';

    assigned.forEach(catKey => {
      const config = CATEGORY_MAP[catKey];
      const badge = document.createElement('span');
      badge.className = 'category-badge';
      badge.textContent = config.name;
      badge.style.backgroundColor = config.color;
      badge.style.color = config.textColor;
      badgesContainer.appendChild(badge);
    });

    // Insert badges before the abstract
    const abstractEl = entry.querySelector('.publication_abstract');
    pubContent.insertBefore(badgesContainer, abstractEl);

    // 3. Make Abstract Collapsible
    // Create a Toggle Abstract button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-abstract-btn';
    toggleBtn.textContent = 'Show Abstract';
    pubContent.insertBefore(toggleBtn, abstractEl);

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents clicking the card and launching the link
      const isShowing = entry.classList.toggle('show-abstract');
      toggleBtn.textContent = isShowing ? 'Hide Abstract' : 'Show Abstract';
    });
  });

  // 4. Set Up Filter Pills Interactive Actions
  const filterPills = document.querySelectorAll('.filter-pill');
  let activeCategory = 'all';

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      applyFiltersAndSearch();
    });
  });

  // 5. Set Up Search Interactive Actions
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFiltersAndSearch();
    });
  }

  // 6. Combined Filtering and Search Function
  function applyFiltersAndSearch() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    yearSections.forEach(section => {
      const sectionEntries = section.querySelectorAll('.publication_entry');
      let visibleCount = 0;

      sectionEntries.forEach(entry => {
        const assignedCats = entry.getAttribute('data-assigned-categories').split(',');
        const title = entry.querySelector('.publication_title').textContent.toLowerCase();
        const authors = entry.querySelector('.publication_authors').textContent.toLowerCase();
        const abstract = entry.querySelector('.publication_abstract').textContent.toLowerCase();
        const venue = entry.querySelector('.publication_venue').textContent.toLowerCase();
        
        // Check Category Match
        const matchesCategory = (activeCategory === 'all' || assignedCats.includes(activeCategory));

        // Check Search Match
        const matchesSearch = (
          query === '' ||
          title.includes(query) ||
          authors.includes(query) ||
          abstract.includes(query) ||
          venue.includes(query)
        );

        if (matchesCategory && matchesSearch) {
          entry.style.display = 'flex';
          visibleCount++;
        } else {
          entry.style.display = 'none';
        }
      });

      // Hide the entire year section if no papers in it match
      if (visibleCount > 0) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  }

  // 7. Layout Switcher Toggling
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      publicationsContainer.classList.remove('list-view');
      publicationsContainer.classList.add('grid-view');

      // Auto-collapse abstracts in Grid View to preserve grid heights
      document.querySelectorAll('.publication_entry').forEach(entry => {
        entry.classList.remove('show-abstract');
        const btn = entry.querySelector('.toggle-abstract-btn');
        if (btn) btn.textContent = 'Show Abstract';
      });
    });

    listBtn.addEventListener('click', () => {
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      publicationsContainer.classList.remove('grid-view');
      publicationsContainer.classList.add('list-view');

      // Auto-expand abstracts in List View for easy reading
      document.querySelectorAll('.publication_entry').forEach(entry => {
        entry.classList.add('show-abstract');
        const btn = entry.querySelector('.toggle-abstract-btn');
        if (btn) btn.textContent = 'Hide Abstract';
      });
    });
  }


  // 9. URL Routing and Active Nav State
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view');
  const topNavLinks = document.querySelectorAll('.top_nav a');
  
  // Only intercept routing active states if we're on the index page
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
      topNavLinks.forEach(link => link.classList.remove('active'));
      
      if (viewParam === 'list') {
          if (listBtn) listBtn.click();
          const pubLink = Array.from(topNavLinks).find(l => l.textContent.trim() === 'Publications');
          if (pubLink) pubLink.classList.add('active');
          
          // Hide hero and announcements for pure publication list routing
          const heroSection = document.querySelector('.hero_section');
          const announcementsSection = document.getElementById('announcements_section');
          if (heroSection) heroSection.style.display = 'none';
          if (announcementsSection) announcementsSection.style.display = 'none';
      } else {
          // Default to grid if missing or 'grid'
          if (gridBtn) gridBtn.click(); 
          const homeLink = Array.from(topNavLinks).find(l => l.textContent.trim() === 'Home');
          if (homeLink) homeLink.classList.add('active');
      }
  }

});
