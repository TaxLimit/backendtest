import app from "./app.mjs";
import "dotenv/config";

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(
    `🚀 Server started successfully on port http://localhost:${port}`
  );
});
