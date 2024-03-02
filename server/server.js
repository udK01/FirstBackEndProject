const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());
const filePath = path.join(__dirname, "Database", "database.txt");

app.get("/api/data", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Failed to read data." });
    } else {
      const lines = data.trim().split("\n");
      const jsonData = lines.map((line) => JSON.parse(line));
      res.json(jsonData);
    }
  });
});

app.post("/api/delete", (req, res) => {
  // Read File.
  fs.readFile(filePath, "utf8", (err, data) => {
    // Handle Errors.
    if (err) {
      console.error("Error reading file:", err);
    } else {
      // Parse data as JSON objects.
      const lines = data.trim().split("\n");
      const parsedData = lines.map((line) => JSON.parse(line));

      // Filter out the line to be deleted.
      const filteredData = parsedData.filter((obj) => {
        return (
          obj.username !== req.body.username ||
          obj.password !== req.body.password
        );
      });

      // Rewrite File With Filtered Data.
      fs.writeFile(
        filePath,
        filteredData.map((obj) => JSON.stringify(obj)).join("\n"),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("Row deleted successfully.");
        }
      );
    }
  });
});

app.post("/api/login", (req, res) => {
  const dataToAppend = JSON.stringify(req.body) + "\n";

  fs.appendFile(filePath, dataToAppend, (err) => {
    if (err) {
      console.error("Error appending to file:", err);
      res.status(500).json({ error: "Failed to append data." });
    } else {
      res.json({ message: "Data Appended!" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000.");
});
