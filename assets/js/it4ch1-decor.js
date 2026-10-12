/* it4ch1 decor for jekyll-theme-chirpy 6.x
 * Each feature checks for its own page and quietly does nothing elsewhere.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Reading progress bar (post pages only) ----------------------------- */
  function initProgress() {
    if (!document.querySelector('.post-tail-wrapper')) return;

    var content = document.querySelector('article .content') || document.querySelector('.content');
    if (!content) return;

    var bar = document.createElement('div');
    bar.id = 'it-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;

    function update() {
      ticking = false;
      var rect = content.getBoundingClientRect();
      var end = rect.bottom + window.scrollY - window.innerHeight;
      var start = rect.top + window.scrollY - 80;
      var progress = end <= start ? 1 : (window.scrollY - start) / (end - start);
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', update);
    update();
  }

  /* 2. Typed shell prompt above Home, Categories and Tags ----------------- */
  function makePrompt(command) {
    var line = document.createElement('div');
    line.className = 'it-prompt';
    line.setAttribute('aria-hidden', 'true');

    var p = document.createElement('span');
    p.className = 'p';
    p.textContent = '$';

    var cmd = document.createElement('span');
    cmd.className = 'cmd';
    cmd.style.setProperty('--n', command.length);
    cmd.textContent = command;

    var cur = document.createElement('span');
    cur.className = 'cur';

    line.appendChild(p);
    line.appendChild(document.createTextNode(' '));
    line.appendChild(cmd);
    line.appendChild(cur);
    return line;
  }

  function initPrompts() {
    var postList = document.getElementById('post-list');
    if (postList) {
      var homePrompt = makePrompt('ls -t ~/posts');
      homePrompt.classList.add('it-prompt-home');
      postList.parentNode.insertBefore(homePrompt, postList);
      return;
    }

    var title = document.querySelector('h1.dynamic-title');
    if (!title) return;

    if (document.querySelector('.it-cats')) {
      title.insertAdjacentElement('afterend', makePrompt('ls ~/categories'));
    } else if (document.getElementById('tags')) {
      title.insertAdjacentElement('afterend', makePrompt('ls ~/tags'));
    }
  }

  /* 3. Home cards: soft red spotlight that follows the pointer ------------ */
  function initSpotlight() {
    var list = document.getElementById('post-list');
    if (!list || reduceMotion || !window.matchMedia('(hover: hover)').matches) return;

    list.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.post-preview');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* 4. Tags page: weighted sizes, live filter, sort ----------------------- */
  function initTags() {
    var box = document.getElementById('tags');
    if (!box) return;

    var items = Array.prototype.slice.call(box.children).map(function (wrap, index) {
      var link = wrap.querySelector('a.tag');
      var countEl = link && link.querySelector('span');
      var count = countEl ? parseInt(countEl.textContent, 10) || 0 : 0;
      var name = link ? link.firstChild.textContent.trim() : '';
      return { wrap: wrap, link: link, name: name, count: count, index: index };
    }).filter(function (item) { return item.link; });

    if (!items.length) return;

    // size each tag by how many posts use it (square-root scale keeps it calm)
    var counts = items.map(function (i) { return i.count; });
    var min = Math.sqrt(Math.min.apply(null, counts));
    var max = Math.sqrt(Math.max.apply(null, counts));

    items.forEach(function (item) {
      var w = max === min ? 0 : (Math.sqrt(item.count) - min) / (max - min);
      item.link.style.fontSize = (0.95 + w * 0.4).toFixed(3) + 'rem';
      if (w >= 0.6) item.link.classList.add('it-hot');
      item.link.setAttribute('title', item.count + (item.count === 1 ? ' post' : ' posts'));
    });

    // toolbar
    var tools = document.createElement('div');
    tools.className = 'it-tag-tools';
    tools.innerHTML =
      '<label class="it-tag-search">' +
        '<i class="fas fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="search" placeholder="Filter tags" aria-label="Filter tags" autocomplete="off" spellcheck="false">' +
      '</label>' +
      '<div class="it-seg" role="group" aria-label="Sort tags">' +
        '<button type="button" data-sort="name" aria-pressed="true">A–Z</button>' +
        '<button type="button" data-sort="count" aria-pressed="false">Most used</button>' +
      '</div>';

    var empty = document.createElement('p');
    empty.className = 'it-tag-empty';
    empty.hidden = true;

    box.parentNode.insertBefore(tools, box);
    box.insertAdjacentElement('afterend', empty);

    var input = tools.querySelector('input');
    var buttons = tools.querySelectorAll('.it-seg button');

    function stagger() {
      var shown = 0;
      items.forEach(function (item) {
        if (!item.wrap.hidden) item.wrap.style.setProperty('--i', shown++);
      });
      box.classList.remove('it-anim');
      void box.offsetWidth; // restart the entrance animation
      box.classList.add('it-anim');
    }

    function filter() {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var match = !q || item.name.toLowerCase().indexOf(q) !== -1;
        item.wrap.hidden = !match;
        if (match) visible++;
      });
      empty.hidden = visible !== 0;
      if (!visible) {
        empty.textContent = 'No tags match "' + input.value.trim() + '". Press Esc to clear the filter.';
      }
    }

    function sortBy(mode) {
      var sorted = items.slice().sort(function (a, b) {
        if (mode === 'count' && b.count !== a.count) return b.count - a.count;
        return a.index - b.index; // original order is already A–Z
      });
      sorted.forEach(function (item) { box.appendChild(item.wrap); });
      items = sorted;
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-sort') === mode));
      });
      stagger();
    }

    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        filter();
      }
    });

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () { sortBy(btn.getAttribute('data-sort')); });
    });

    stagger();
  }

  initProgress();
  initPrompts();
  initSpotlight();
  initTags();
})();