import server from "./app";
const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default server;

// import { setup } from "./app";

// export const start = () => {
//   const server = setup();

//   try {
//     server.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error: any) {
//     console.log(`Error occurred: ${error.message}`);
//   }
//   return server;
// };

// start();
