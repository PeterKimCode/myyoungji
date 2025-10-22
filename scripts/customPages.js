const findNavItem = (navItems, path) => navItems.find((item) => item.path === path);

const renderSectionLinks = (items, withBase) =>
  items
    .map((child) => `<li><a href="${withBase(child.path)}">${child.label}</a></li>`)
    .join("");

export const customPageRenderers = {
  "/": ({ navItems, withBase }) => {
    const description = "Discover Young Ji International School's programs, admissions, and community updates.";
    const sections = navItems
      .map((section) => {
        const childLinks = section.children?.slice(0, 2) ?? [];
        const linksHtml = childLinks
          .map(
            (child) =>
              `<li><a href="${withBase(child.path)}" class="text-slate-700 hover:underline">${child.label}</a></li>`
          )
          .join("");
        return `
          <div class="rounded border border-slate-200 p-4">
            <h2 class="text-xl font-semibold text-brand-blue">${section.label}</h2>
            <p class="mt-2 text-sm text-slate-600">
              Learn more about our ${section.label.toLowerCase()} initiatives and resources.
            </p>
            <ul class="mt-4 space-y-2 text-sm">
              <li>
                <a href="${withBase(section.path)}" class="font-medium">Visit ${section.label} landing page &rarr;</a>
              </li>
              ${linksHtml}
            </ul>
          </div>
        `;
      })
      .join("");

    return {
      title: "Welcome",
      description,
      content: `
        <h1>Young Ji International School</h1>
        <p>
          Young Ji International School (YJIS) nurtures global citizens through a holistic curriculum and a caring
          community. Explore our academic programs, admissions process, and vibrant campus life.
        </p>
        <section class="grid gap-6 md:grid-cols-2">
          ${sections}
        </section>
      `
    };
  },
  "/admission/": ({ navItems, withBase }) => {
    const section = findNavItem(navItems, "/admission/");
    const description = "Start your application journey with Young Ji International School.";
    return {
      title: "Admission",
      description,
      content: `
        <h1>Admission</h1>
        <p>
          Discover the admissions process, requirements, and support services available to prospective families. We guide you
          from inquiry to enrollment with transparent steps and personalized assistance.
        </p>
        <ul class="list-disc space-y-2 pl-5">
          ${renderSectionLinks(section?.children ?? [], withBase)}
        </ul>
      `
    };
  },
  "/basic-education/": ({ navItems, withBase }) => {
    const section = findNavItem(navItems, "/basic-education/");
    const description = "Explore Young Ji International School's basic education programs.";
    return {
      title: "Basic Education",
      description,
      content: `
        <h1>Basic Education</h1>
        <p>
          From preschool to senior high school, Young Ji International School delivers a continuum of learning experiences that
          encourage curiosity, collaboration, and personal growth.
        </p>
        <ul class="list-disc space-y-2 pl-5">
          ${renderSectionLinks(section?.children ?? [], withBase)}
        </ul>
      `
    };
  },
  "/community/": ({ navItems, withBase }) => {
    const section = findNavItem(navItems, "/community/");
    const description = "Connect with the Young Ji International School community.";
    return {
      title: "Community",
      description,
      content: `
        <h1>Community</h1>
        <p>
          Stay up to date with campus news, activities, and resources. The community section highlights events, support
          services, and opportunities to engage with YJIS.
        </p>
        <ul class="list-disc space-y-2 pl-5">
          ${renderSectionLinks(section?.children ?? [], withBase)}
        </ul>
      `
    };
  },
  "/e-education/": ({ navItems, withBase }) => {
    const section = findNavItem(navItems, "/e-education/");
    const description = "Discover Young Ji International School's e-education initiatives and online programs.";
    return {
      title: "e-Education",
      description,
      content: `
        <h1>e-Education</h1>
        <p>
          Young Ji International School extends learning beyond the classroom through flexible online programs and blended
          experiences that support diverse learning needs.
        </p>
        <ul class="list-disc space-y-2 pl-5">
          ${renderSectionLinks(section?.children ?? [], withBase)}
        </ul>
      `
    };
  },
  "/youngji_about-us/": ({ navItems, withBase }) => {
    const section = findNavItem(navItems, "/youngji_about-us/");
    const description = "Discover the story, mission, and leadership of Young Ji International School.";
    return {
      title: "About Us",
      description,
      content: `
        <h1>About Us</h1>
        <p>
          Learn about our guiding mission, leadership team, and the history that shaped Young Ji International School.
          Explore the resources in this section to understand our commitment to high-quality education and student well-being.
        </p>
        <ul class="list-disc space-y-2 pl-5">
          ${renderSectionLinks(section?.children ?? [], withBase)}
        </ul>
      `
    };
  },
  "/community/search-for-student/": () => {
    const students = [
      { id: "YJIS001", name: "Alex Kim", grade: "Grade 3", email: "alex.kim@yjis.edu" },
      { id: "YJIS002", name: "Mina Park", grade: "Grade 5", email: "mina.park@yjis.edu" },
      { id: "YJIS003", name: "Daniel Cruz", grade: "Grade 8", email: "daniel.cruz@yjis.edu" },
      { id: "YJIS004", name: "Sofia Reyes", grade: "Grade 10", email: "sofia.reyes@yjis.edu" }
    ];
    const serializedStudents = JSON.stringify(students, null, 2).replace(/</g, "\\u003c");
    return {
      title: "Contact Info & Search for student",
      description: "Search for enrolled students and find community contact information.",
      content: `
        <h1>Contact Info &amp; Search for student</h1>
        <p>
          Use the search box to filter students by name, grade, or ID. Results update instantly in the table below. This
          interactive experience keeps the page responsive without reloading.
        </p>
        <div class="space-y-4">
          <label class="block text-sm font-medium text-slate-700" for="student-query">Search students</label>
          <input
            id="student-query"
            type="search"
            placeholder="Search by name, grade, or ID"
            class="w-full max-w-xl rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-brand-blue focus:outline-none"
          />
          <div class="overflow-x-auto">
            <table class="table-basic text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody id="student-rows"></tbody>
            </table>
          </div>
        </div>
        <script type="application/json" id="student-data">${serializedStudents}</script>
        <script>
          const dataElement = document.getElementById('student-data');
          const students = dataElement ? JSON.parse(dataElement.textContent || '[]') : [];
          const input = document.getElementById('student-query');
          const tbody = document.getElementById('student-rows');

          const renderRows = (list) => {
            const rows = list
              .map((student) =>
                '<tr>' +
                  '<td class="font-mono">' + student.id + '</td>' +
                  '<td>' + student.name + '</td>' +
                  '<td>' + student.grade + '</td>' +
                  '<td><a href="mailto:' + student.email + '" class="hover:underline">' + student.email + '</a></td>' +
                '</tr>'
              )
              .join('');
            tbody.innerHTML = rows;
          };

          const filterStudents = (query) => {
            const q = query.toLowerCase();
            return students.filter((student) =>
              [student.name, student.grade, student.id].some((value) => value.toLowerCase().includes(q))
            );
          };

          renderRows(students);
          input?.addEventListener('input', () => {
            renderRows(filterStudents(input.value));
          });
        </script>
      `
    };
  },
  "/404/": ({ withBase }) => ({
    title: "Page not found",
    description: "The page you are looking for does not exist.",
    content: `
      <h1>Page not found</h1>
      <p>
        We could not locate the page you requested. Return to the <a href="${withBase("/")}">homepage</a> or explore the main
        sections through the navigation above.
      </p>
    `
  })
};
