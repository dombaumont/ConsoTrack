// Language of the legal pages: ?lang=, then the choice saved by the landing
// page, then the browser's language. Without JavaScript the French text shows.
(function () {
  var languages = ['fr', 'en', 'es'];
  var root = document.documentElement;
  function saved() { try { return localStorage.getItem('consotrack-language'); } catch (e) { return null; } }
  function apply(lang, save) {
    if (languages.indexOf(lang) < 0) lang = 'en';
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    var doc = document.querySelector('.doc[lang="' + lang + '"]');
    if (doc && doc.dataset.title) document.title = doc.dataset.title;
    document.querySelectorAll('[data-lang-button]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.langButton === lang));
    });
    if (save) {
      try { localStorage.setItem('consotrack-language', lang); } catch (e) {}
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
  }
  var explicit = new URLSearchParams(location.search).get('lang');
  var browser = (navigator.languages || [navigator.language]).map(function (l) { return l.split('-')[0]; })
    .filter(function (l) { return languages.indexOf(l) >= 0; })[0];
  apply([explicit, saved(), browser].filter(function (l) { return languages.indexOf(l) >= 0; })[0] || 'en');
  document.querySelectorAll('[data-lang-button]').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.langButton, true); });
  });
  // Links between the legal pages keep the language.
  document.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
    a.addEventListener('click', function () { a.href = a.getAttribute('href').split('?')[0] + '?lang=' + root.lang; });
  });
})();
