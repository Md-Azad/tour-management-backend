export const makeSlug = (name: string) => {
  const baseSlug = name.toLowerCase().split(" ").join("-") as string;
  const slug = `${baseSlug}-division`;
  return slug;
};
