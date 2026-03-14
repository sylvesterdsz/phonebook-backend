const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("Connection to DB established");
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error.message);
  });

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [8, "Phone number must be at least 8 characters long"],
    validate: {
      validator: function (v) {
        // Custom validator for the format: XX-XXXXXXX or XXX-XXXXXXX
        // Split by '-'
        const parts = v.split("-");
        if (parts.length !== 2) return false;

        const [first, second] = parts;

        // First part: 2 or 3 digits
        if (!/^\d{2,3}$/.test(first)) return false;

        // Second part: only digits
        if (!/^\d+$/.test(second)) return false;

        return true;
      },
      message: (props) =>
        `${props.value} is not a valid phone number. Correct format: XX-XXXXXXX or XXX-XXXXXXX`,
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", phoneBookSchema);
