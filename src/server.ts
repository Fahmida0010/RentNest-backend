import app from "./app";

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

});
}