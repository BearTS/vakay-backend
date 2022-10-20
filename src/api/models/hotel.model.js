const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    image: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    availableRooms: [
      {
        date: { type: Date, required: true },
        price: { type: Number, required: true },
        available: { type: Number, required: true },
      },
    ],
    bookedRooms: [
      {
        date: { type: Date, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", HotelSchema);
