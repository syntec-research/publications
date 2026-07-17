const NEWS_ITEMS = [
  {
    date: "July 2026",
    content: "We have open-sourced <a href='https://github.com/google/GNM' target='_blank' style='color: var(--primary-color); font-weight: 500; text-decoration: none;'>GNM</a> — the state-of-the-art family of parametric statistical human models and its associated perception stack.",
    isNew: true
  },
  {
    date: "July 2026",
    content: "We are presenting 3 SIGGRAPH papers! See you in Los Angeles!",
    isNew: true
  },
  {
    date: "May 2026",
    content: "We congratulate ETHAR - our ETH partners - on its 1-year anniversary!",
    isNew: false
  },
  {
    date: "May 2026",
    content: "5 CVPR papers are accepted!",
    isNew: false
  },
  {
    date: "March 2026",
    content: "3 3DV papers are accepted!",
    isNew: false
  }
];

function renderNews() {
  // Render on index.html (Announcements block)
  const indexContainer = document.querySelector('.prominent_announcements');
  if (indexContainer) {
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.gap = '15px';
    ul.style.fontSize = '16px';
    ul.style.lineHeight = '1.6';
    
    if (NEWS_ITEMS.length > 5) {
      ul.style.maxHeight = '280px';
      ul.style.overflowY = 'auto';
      ul.style.paddingRight = '15px';
    }

    NEWS_ITEMS.forEach(item => {
      const li = document.createElement('li');
      li.className = 'announcement-item';
      if (!item.isNew) {
        li.style.color = 'var(--text-muted)';
      }
      
      let htmlContent = `<strong>${item.date}</strong> &mdash; ${item.content}`;
      if (item.isNew) {
        htmlContent += ` <span class="new-badge" style="background: linear-gradient(135deg, #00ffa3, #03e1ff); color: #0b0e14; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-left:12px;">NEW</span>`;
      }
      li.innerHTML = htmlContent;
      ul.appendChild(li);
    });
    
    indexContainer.innerHTML = ''; // clear out anything
    indexContainer.appendChild(ul);
  }

  // Render on news.html (Full Page block)
  const newsPageContainer = document.getElementById('news-page-container');
  if (newsPageContainer) {
    const ul = document.createElement('ul');
    ul.style.fontSize = '1.15em';
    ul.style.lineHeight = '2.2';
    ul.style.listStyle = 'none';
    ul.style.paddingLeft = '0';

    NEWS_ITEMS.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.padding = '15px 0';
      if (index !== NEWS_ITEMS.length - 1) {
        li.style.borderBottom = '1px solid var(--border-color)';
      }
      li.innerHTML = `<strong>${item.date}</strong> &mdash; ${item.content}`;
      ul.appendChild(li);
    });

    newsPageContainer.innerHTML = '';
    newsPageContainer.appendChild(ul);
  }
}

document.addEventListener('DOMContentLoaded', renderNews);
