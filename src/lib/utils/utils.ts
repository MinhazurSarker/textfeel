export const objectify = (data: object) => {
  return JSON.parse(JSON.stringify(data));
};
export function getLast11Digits(phoneNumber: string) {
  const numericPhone = phoneNumber.replace(/\D/g, "");
  return numericPhone.slice(-11);
}
