export const objectify = (data: object) => {
  return JSON.parse(JSON.stringify(data));
};
