// Progressive enhancement only: the page is complete without this file.

// Publication filter. Without JS every paper is listed.
const filters = document.querySelector(".filters");
const cards = [...document.querySelectorAll(".publist .card")];
function show(f) {
  for (const c of cards) {
    c.hidden = !(f === "all" || (f === "first" ? c.dataset.first === "1" : c.dataset.kind === f));
  }
  for (const b of filters.querySelectorAll("button")) b.setAttribute("aria-pressed", b.dataset.f === f);
}
filters.hidden = false;
filters.addEventListener("click", e => { if (e.target.dataset.f) show(e.target.dataset.f); });
show("first");

// Collapsed sections open when reached from the sidebar or a #link.
const openSection = hash => {
  let el = null;
  try { el = hash && document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) {}
  const d = el && el.querySelector(":scope > details");
  if (d) d.open = true;
};
document.querySelectorAll("aside nav a").forEach(a => a.addEventListener("click", () => openSection(a.hash)));
addEventListener("hashchange", () => openSection(location.hash));
openSection(location.hash);

// Highlight the section currently on screen in the sidebar: the last one whose top has
// passed 30% of the window. A clicked link stays highlighted until the visitor scrolls,
// because short sections at the bottom of the page can never reach that line.
const navLinks = new Map([...document.querySelectorAll("aside nav a")].map(a => [a.hash.slice(1), a]));
const sections = [...document.querySelectorAll("main section")];
let locked = false;
const mark = id => { navLinks.forEach(a => a.classList.remove("on")); navLinks.get(id)?.classList.add("on"); };
const spy = () => {
  if (locked || !sections.length) return;
  let id = sections[0].id;
  for (const s of sections) if (s.getBoundingClientRect().top <= innerHeight * 0.3) id = s.id;
  mark(id);
};
addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true });
for (const t of ["wheel", "touchstart", "keydown"]) addEventListener(t, () => { locked = false; }, { passive: true });
navLinks.forEach((a, id) => a.addEventListener("click", () => { mark(id); locked = true; }));
// Arriving on a #link (or following one) highlights that section, like a click.
const fromHash = () => { const id = location.hash.slice(1); if (navLinks.has(id)) { mark(id); locked = true; } };
addEventListener("hashchange", fromHash);
spy();
fromHash();

// News box: drop the bottom fade once the last item is in view.
const newsBox = document.querySelector(".news-box");
if (newsBox) {
  const atEnd = () => newsBox.classList.toggle("end", newsBox.scrollTop + newsBox.clientHeight >= newsBox.scrollHeight - 4);
  newsBox.addEventListener("scroll", atEnd, { passive: true });
  atEnd();
}

// Dark mode: follows the OS until the visitor picks one, then remembers it.
const root = document.documentElement, toggle = document.querySelector(".theme");
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark"
  : matchMedia("(prefers-color-scheme: dark)").matches;
const label = () => { toggle.querySelector("span").textContent = isDark() ? "Light mode" : "Dark mode"; };
toggle.addEventListener("click", () => {
  root.dataset.theme = isDark() ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  label();
});
label();
