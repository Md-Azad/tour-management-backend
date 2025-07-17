export const makeSlug = (name: string) => {
  let slug = name?.split(" ").join("-") as string;
  slug = slug.toLowerCase();

  return slug;
};
