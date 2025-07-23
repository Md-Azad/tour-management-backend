export const makeSlug = (name: string) => {
  const slug = name.toLowerCase().split(" ").join("-") as string;
  return slug;
};
