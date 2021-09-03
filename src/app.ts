import express from "express";

const startApp = () => {
  const app = express();

  app.listen(3000, () => console.log('LISTENS'));
}

export default startApp;