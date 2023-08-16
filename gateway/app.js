import { app } from "./src/express.js";

const port = 8000;

app.use("/", (req, res) => {
  res.json({ message: "welcome to api gateway!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
