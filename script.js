const header = document.querySelector('.site-header');
const nav = document.querySelector('.desktop-nav');

if (header && nav) {
  nav.innerHTML = `
    <div class="nav-group nav-products">
      <span class="nav-group-title">Продукция</span>
      <a href="pergolas.html">Перголы</a>
      <a href="awnings.html">Маркизы</a>
      <a href="zip.html">ZIP-системы</a>
      <a href="glazing.html">Остекление</a>
      <a href="kitchen.html">Outdoor-кухня</a>
      <a href="articles.html">Полезное</a>
      <a class="nav-stock-link" href="stock.html">В наличии</a>
    </div>
    <div class="nav-group nav-local">
      <span class="nav-group-title">По сайту</span>
      <a href="index.html#solutions">Для кого</a>
      <a href="index.html#projects">Проекты</a>
      <a href="index.html#process">Как работаем</a>
      <a href="about.html">О компании</a>
      <a href="faq.html">FAQ</a>
      <a href="articles.html">Полезное</a>
      <a href="contacts.html">Контакты</a>
    </div>`;

  let toggle = header.querySelector('.menu-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    toggle.innerHTML = '<span></span><span></span>';
    header.append(toggle);
  }

  let closeTimer;

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    header.classList.remove('closing');
    header.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
  };

  const closeMenu = (afterClose) => {
    if (!header.classList.contains('open')) {
      if (afterClose) afterClose();
      return;
    }

    header.classList.add('closing');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    closeTimer = window.setTimeout(() => {
      header.classList.remove('open', 'closing');
      document.body.classList.remove('menu-open');
      if (afterClose) afterClose();
    }, 430);
  };

  toggle.addEventListener('click', () => {
    if (header.classList.contains('open') && !header.classList.contains('closing')) closeMenu();
    else openMenu();
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    if (!header.classList.contains('open') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = link.href;
    closeMenu(() => { window.location.href = destination; });
  }));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  if (document.querySelector('.hero')) {
    header.insertAdjacentHTML('beforeend', `
      <nav class="section-nav" aria-label="Разделы главной страницы">
        <a href="stock.html">В наличии</a>
        <a href="#solutions">Решения</a>
        <a href="#projects">Реальные проекты</a>
        <a href="#process">Этапы работы</a>
        <a href="#request">Обсудить проект</a>
      </nav>`);
  }
}

let lastScrollY = window.scrollY;
let scrollDirection = 'down';
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (Math.abs(current - lastScrollY) > 3) scrollDirection = current > lastScrollY ? 'down' : 'up';
  lastScrollY = current;
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('exit-up', 'exit-down');
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.toggle('exit-up', scrollDirection === 'down');
      entry.target.classList.toggle('exit-down', scrollDirection === 'up');
    }
  });
}, { threshold: 0.13, rootMargin: '-5% 0px -7%' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelectorAll('.faq-page details').forEach(details => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('.faq-answer');
  if (!summary || !answer) return;

  if (details.open) {
    answer.style.height = 'auto';
    answer.style.opacity = '1';
  }

  summary.addEventListener('click', event => {
    event.preventDefault();
    if (details.dataset.animating === 'true') return;
    details.dataset.animating = 'true';

    if (details.open) {
      answer.style.height = `${answer.scrollHeight}px`;
      requestAnimationFrame(() => {
        answer.style.height = '0px';
        answer.style.opacity = '0';
      });
      answer.addEventListener('transitionend', () => {
        details.open = false;
        details.dataset.animating = 'false';
      }, { once: true });
    } else {
      details.open = true;
      answer.style.height = '0px';
      answer.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        answer.style.height = `${answer.scrollHeight}px`;
        answer.style.opacity = '1';
      }));
      answer.addEventListener('transitionend', () => {
        answer.style.height = 'auto';
        details.dataset.animating = 'false';
      }, { once: true });
    }
  });
});

const languageScript = document.createElement('script');
languageScript.src = 'i18n.js';
document.head.append(languageScript);
