import { app } from "./src/express.js";
const port = 8002;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
