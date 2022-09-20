export type ESClientCloud = {
  cloud: { id: string };
  auth: { username: string; password: string };
};

type CreateClientData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type ClientIndexDocType = {
  index: string;
  document: CreateClientData;
};
