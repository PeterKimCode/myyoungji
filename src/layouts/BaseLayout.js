import { renderHeader } from "../components/Header.js";
import { renderSidebar } from "../components/Sidebar.js";
import { renderBreadcrumbs } from "../components/Breadcrumbs.js";

export const renderBaseLayout = ({
  title,
  description,
  currentPath,
  navItems,
  withBase,
  content
}) => {
  const header = renderHeader({ navItems, currentPath, withBase });
  const sidebar = renderSidebar({ navItems, currentPath, withBase });
  const breadcrumbs = renderBreadcrumbs({ navItems, currentPath, withBase });
  const pageTitle = title
    ? `${title} | Young Ji International School`
    : "Young Ji International School";
  const skipLink = `
    <a href="#main" class="absolute left-1/2 top-2 -translate-x-1/2 rounded bg-brand-blue px-4 py-2 text-white focus:translate-y-0 focus:outline-none">
      Skip to main content
    </a>
  `;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${pageTitle}</title>
    ${description ? `<meta name="description" content="${description}" />` : ""}
    <link rel="stylesheet" href="${withBase("/styles/global.css")}" />
  </head>
  <body>
    ${skipLink}
    <div class="flex min-h-screen flex-col">
      ${header}
      <div class="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
        ${sidebar}
        <main id="main" class="w-full space-y-6">
          ${breadcrumbs}
          <article class="space-y-6 rounded-lg bg-white p-6 shadow">
            ${content}
          </article>
        </main>
      </div>
      <footer class="bg-brand-blue py-6 text-sm text-white">
        <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
          <p>&copy; ${new Date().getFullYear()} Young Ji International School. All rights reserved.</p>
          <p>Static site generated (SSG: Static Site Generation) with a custom Node.js pipeline.</p>
        </div>
      </footer>
    </div>
  </body>
</html>`;
};
