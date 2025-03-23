interface User {
  _id: string;
  name: string;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: string;
  simslot2: string;
  webFileNumber: string;
  ivac: string;
  mission: string;
  visaType: string;
  familyNumbers: {
    fullName: string;
    webFileNumber: string;
  }[];
}
