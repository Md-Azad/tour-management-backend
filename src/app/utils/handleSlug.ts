export const makeSlug = (name: string, lastPart = "") => {
  const baseSlug = name.toLowerCase().split(" ").join("-") as string;

  if (lastPart !== "") {
    const slug = `${baseSlug}-${lastPart}`;
    return slug;
  }

  return baseSlug;
};
