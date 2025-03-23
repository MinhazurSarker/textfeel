export interface User {
  _id: string;
  username: string;
  role: "admin" | "user";
  password: string;
  simslot1: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
  simslot2: {
    number: string;
    email: string;
    name: string;
    webFileNumber: string;
    ivac: string;
    mission: string;
    visaType: string;
    familyNumbers: {
      fullName: string;
      webFileNumber: string;
    }[];
    ivacLogin: string;
    ivacPass: string;
  };
}
