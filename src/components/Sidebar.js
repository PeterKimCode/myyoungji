const findActiveSection = (navItems, currentPath) => {
  return navItems.find((item) => currentPath.startsWith(item.path));
};

export const renderSidebar = ({ navItems, currentPath, withBase }) => {
  const activeSection = findActiveSection(navItems, currentPath);
  const children = activeSection?.children ?? [];
  if (children.length === 0) {
    return "";
  }

  const links = children
    .map((child) => {
      const isActive = currentPath === child.path;
      const classes = ["block", "rounded", "px-3", "py-2", "transition-colors"];
      if (isActive) {
        classes.push("bg-brand-blue", "text-white");
      } else {
        classes.push("text-slate-700", "hover:bg-brand-blue/10");
      }
      return `
        <li>
          <a href="${withBase(child.path)}" class="${classes.join(" ")}">${child.label}</a>
        </li>
      `;
    })
    .join("");

  return `
    <aside class="sticky top-24 hidden h-max min-w-[220px] space-y-2 rounded-lg bg-white p-4 shadow md:block">
      <h2 class="text-lg font-semibold text-brand-blue">${activeSection?.label ?? ""}</h2>
      <nav aria-label="Section navigation">
        <ul class="space-y-2 text-sm">
          ${links}
        </ul>
      </nav>
    </aside>
  `;
};
