export const toIconId = (src: string) => {
  const file = src.split("/").pop() ?? src;
  return file.split(".")[0];
};
