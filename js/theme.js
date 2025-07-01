(function() {
  // Theme toggle logic
  var body = document.body;
  var btn = document.getElementById('theme-toggle');
  var darkText = '☀️';
  var lightText = '🌙';

  function setTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      btn.textContent = darkText;
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      btn.textContent = lightText;
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  btn.addEventListener('click', function() {
    var isDark = !body.classList.contains('dark-mode');
    setTheme(isDark);
  });

  // On load: check localStorage or default to dark
  var saved = localStorage.getItem('theme');
  setTheme(saved ? saved === 'dark' : true);
})();