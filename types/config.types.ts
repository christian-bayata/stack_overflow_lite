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

type clientSubQueryFirstName = {
  fuzzy: { firstName: string };
};

type clientSubQueryLasttName = {
  fuzzy: { lastName: string };
};

export type ClientIndexDocType = {
  index: string;
  document: CreateClientData;
};

export type ClientSearchDocType = {
  index: string;
  query: clientSubQueryFirstName | clientSubQueryLasttName;
};
