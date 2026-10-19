/* Projects page: data array, dynamic rendering and tag filtering */
(function () {
  "use strict";

  var projects = [
    {
      title: "Password Strength Checker",
      image: "images/project-password.svg",
      alt: "Screenshot of a password strength checker with a coloured strength bar",
      description: "A JavaScript tool that scores a password in real time and explains how to make it stronger. Practises event handling and DOM updates.",
      tags: ["JavaScript", "Security"],
      link: "https://github.com/Oma23-C"
    },
    {
      title: "Secure Login Demo",
      image: "images/project-login.svg",
      alt: "Screenshot of a login form with validation messages",
      description: "A responsive login page with client-side validation and clear error messages, built with semantic HTML and Flexbox.",
      tags: ["HTML", "CSS", "Security"],
      link: "https://github.com/Oma23-C"
    },
    {
      title: "Study Budget Tracker",
      image: "images/project-budget.svg",
      alt: "Screenshot of a budget tracker with a table of expenses",
      description: "A simple tracker that adds expenses to a table and updates totals instantly, using arrays and functions.",
      tags: ["JavaScript", "HTML", "CSS"],
      link: "https://github.com/Oma23-C"
    }
  ];

  var grid = document.getElementById("projectGrid");
  var filters = document.getElementById("filters");
  var count = document.getElementById("count");
  var active = "All";

  function allTags() {
    var set = ["All"];
    projects.forEach(function (p) {
      p.tags.forEach(function (t) { if (set.indexOf(t) === -1) set.push(t); });
    });
    return set;
  }

  function renderFilters() {
    filters.innerHTML = "";
    allTags().forEach(function (tag) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (tag === active ? " is-on" : "");
      b.textContent = tag;
      b.setAttribute("aria-pressed", String(tag === active));
      b.addEventListener("click", function () { active = tag; renderFilters(); renderProjects(); });
      filters.appendChild(b);
    });
  }

  function renderProjects() {
    var shown = projects.filter(function (p) { return active === "All" || p.tags.indexOf(active) !== -1; });
    grid.innerHTML = "";
    shown.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "card";
      card.innerHTML =
        '<img src="' + p.image + '" alt="' + p.alt + '" width="640" height="400" loading="lazy">' +
        "<h3>" + p.title + "</h3><p>" + p.description + "</p>" +
        "<div>" + p.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
        '<p><a href="' + p.link + '" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>';
      grid.appendChild(card);
    });
    count.textContent = "Showing " + shown.length + " of " + projects.length + " projects";
  }

  renderFilters();
  renderProjects();
})();
