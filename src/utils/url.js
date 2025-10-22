export const createWithBase = (base = "/") => {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  };
};
