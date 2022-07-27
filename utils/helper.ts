import CryptoJS from "crypto-js";

const formatUserData = (data: any) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "!@#109Tyuuryfqowp085rjf{}[])_+.//||").toString();
  return ciphertext;
};

export default {
  formatUserData,
};
