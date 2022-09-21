export type ESClientCloud = {
  cloud: { id: string };
  auth: { username: string; password: string };
};

type CreateClientUserData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type CreateClientUQuestionData = {
  id: number;
  question: string;
};

type clientSubQueryFirstName = {
  fuzzy: { firstName: string; fuzziness: "AUTO"; max_expansions: 50; prefix_length: 0; transpositions: true; rewrite: "constant_score" };
};

type clientSubQueryLasttName = {
  fuzzy: { lastName: string; fuzziness: "AUTO"; max_expansions: 50; prefix_length: 0; transpositions: true; rewrite: "constant_score" };
};

type clientSubQueryQuestion = {
  fuzzy: { question: string; fuzziness: "AUTO"; max_expansions: 50; prefix_length: 0; transpositions: true; rewrite: "constant_score" };
};

export type ClientIndexDocType = {
  index: string;
  document: CreateClientUserData | CreateClientUQuestionData;
};

export type ClientSearchDocType = {
  index: string;
  query: clientSubQueryFirstName | clientSubQueryLasttName | clientSubQueryQuestion;
};
