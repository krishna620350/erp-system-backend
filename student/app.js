import express from "express";

const app = express();
const port = 8003;

app.use("/", (req, res) => {
  res.json({ message: "welcome to student!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
