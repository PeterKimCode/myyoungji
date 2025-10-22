const isActivePath = (currentPath, itemPath) => {
  if (itemPath === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(itemPath);
};

export const renderHeader = ({ navItems, currentPath, withBase }) => {
  const navLinks = navItems
    .map((item) => {
      const active = isActivePath(currentPath, item.path);
      const classes = ["rounded", "px-3", "py-2", "transition-colors"];
      if (active) {
        classes.push("bg-brand-blue", "text-white");
      } else {
        classes.push("text-slate-700", "hover:bg-brand-blue/10");
      }
      return `
        <li>
          <a href="${withBase(item.path)}" class="${classes.join(" ")}">${item.label}</a>
        </li>
      `;
    })
    .join("");

  return `
    <header class="bg-white shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="${withBase("/")}" class="text-xl font-bold text-brand-blue">Young Ji International School</a>
        <nav aria-label="Main navigation">
          <ul class="flex flex-wrap gap-4 text-sm font-medium">
            ${navLinks}
          </ul>
        </nav>
      </div>
    </header>
  `;
};
