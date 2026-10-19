/* Academic planner: add, complete, delete and filter tasks. Saved in localStorage. */
(function () {
  "use strict";

  var KEY = "akuma_tasks";
  var tasks = load();
  var filter = "all";

  var form = document.getElementById("taskForm");
  var input = document.getElementById("taskInput");
  var due = document.getElementById("taskDue");
  var priority = document.getElementById("taskPriority");
  var error = document.getElementById("taskError");
  var list = document.getElementById("taskList");
  var summary = document.getElementById("summary");
  var bar = document.getElementById("bar");

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) { /* storage unavailable */ }
  }

  function addTask(text, dueDate, level) {
    tasks.unshift({ id: Date.now(), text: text, due: dueDate, priority: level, done: false });
    save(); render();
  }
  function toggleTask(id) {
    tasks.forEach(function (t) { if (t.id === id) t.done = !t.done; });
    save(); render();
  }
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save(); render();
  }
  function clearDone() {
    tasks = tasks.filter(function (t) { return !t.done; });
    save(); render();
  }

  function visibleTasks() {
    return tasks.filter(function (t) {
      if (filter === "active") return !t.done;
      if (filter === "done") return t.done;
      return true;
    });
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function render() {
    var shown = visibleTasks();
    list.innerHTML = "";

    if (shown.length === 0) {
      var empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = tasks.length === 0 ? "No tasks yet. Add your first task above." : "No tasks in this view.";
      list.appendChild(empty);
    }

    shown.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "task p-" + t.priority + (t.done ? " done" : "");

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = t.done;
      cb.setAttribute("aria-label", "Mark \"" + t.text + "\" as completed");
      cb.addEventListener("change", function () { toggleTask(t.id); });

      var info = document.createElement("div");
      info.className = "info";
      var title = document.createElement("span");
      title.className = "title";
      title.textContent = t.text; // textContent avoids injecting HTML
      var meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = t.priority + " priority" + (t.due ? " - due " + formatDate(t.due) : "");
      info.appendChild(title);
      info.appendChild(meta);

      var del = document.createElement("button");
      del.type = "button";
      del.className = "del";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete \"" + t.text + "\"");
      del.addEventListener("click", function () { deleteTask(t.id); });

      li.appendChild(cb); li.appendChild(info); li.appendChild(del);
      list.appendChild(li);
    });

    var doneCount = tasks.filter(function (t) { return t.done; }).length;
    var pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
    summary.textContent = doneCount + " of " + tasks.length + " completed (" + pct + "%)";
    bar.style.width = pct + "%";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) {
      error.textContent = "Enter a task before adding it.";
      input.classList.add("invalid");
      input.focus();
      return;
    }
    error.textContent = "";
    input.classList.remove("invalid");
    addTask(text, due.value, priority.value);
    form.reset();
    priority.value = "Medium";
    input.focus();
  });

  document.getElementById("taskFilters").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filter = btn.getAttribute("data-filter");
    document.querySelectorAll("#taskFilters .chip").forEach(function (c) {
      c.classList.toggle("is-on", c === btn);
    });
    render();
  });
  document.getElementById("clearDone").addEventListener("click", clearDone);

  render();
})();
