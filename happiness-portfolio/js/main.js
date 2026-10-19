/* Shared behaviour: navigation toggle, footer year, greeting, site stats */
(function () {
  "use strict";

  // Mobile navigation (event handling + DOM manipulation)
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) toggle.click();
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Time-based greeting (dynamic content update)
  function greetingFor(hour) {
    if (hour < 12) return "Good morning, welcome";
    if (hour < 17) return "Good afternoon, welcome";
    return "Hi, welcome";
  }
  var greet = document.getElementById("greeting");
  if (greet) greet.textContent = greetingFor(new Date().getHours());

  // Home page stats, read from saved planner tasks
  var stats = document.getElementById("stats");
  if (stats) {
    var tasks = [];
    try { tasks = JSON.parse(localStorage.getItem("akuma_tasks")) || []; } catch (e) { tasks = []; }
    var done = tasks.filter(function (t) { return t.done; }).length;
    var items = [
      { n: 3, label: "Projects" },
      { n: tasks.length, label: "Planner tasks" },
      { n: done, label: "Completed" }
    ];
    stats.innerHTML = "";
    items.forEach(function (it) {
      var d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = "<b>" + it.n + "</b>" + it.label;
      stats.appendChild(d);
    });
  }
})();
