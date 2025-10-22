const matchPath = (path) => path.replace(/\/$/, "");

const findTrail = (items, path, trail = []) => {
  for (const item of items) {
    const newTrail = [...trail, item];
    if (matchPath(item.path) === matchPath(path)) {
      return newTrail;
    }
    if (item.children) {
      const childTrail = findTrail(item.children, path, newTrail);
      if (childTrail.length > 0) {
        return childTrail;
      }
    }
  }
  return [];
};

export const renderBreadcrumbs = ({ navItems, currentPath, withBase }) => {
  const trail = findTrail(navItems, currentPath);
  const items = trail
    .map((item, index) => {
      const isLast = index === trail.length - 1;
      const labelHtml = isLast
        ? `<span class="font-semibold text-brand-blue">${item.label}</span>`
        : `<a href="${withBase(item.path)}" class="hover:underline">${item.label}</a>`;
      return `
        <li class="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          ${labelHtml}
        </li>
      `;
    })
    .join("");

  return `
    <nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-600">
      <ol class="flex flex-wrap items-center gap-2">
        <li>
          <a href="${withBase("/")}" class="hover:underline">Home</a>
        </li>
        ${items}
      </ol>
    </nav>
  `;
};
