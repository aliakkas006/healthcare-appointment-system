export type EmailData = {
  sender?: string;
  recipient: string;
  subject: string;
  body: string;
  source: string;
};

export type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

export type EmailResponse = {
  rejected: string[];
};
