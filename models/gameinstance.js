const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game" },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used"],
    default: "New",
  },
});

// Virtual for game's URL
GameInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/gameinstance/${this._id}`;
});

GameInstanceSchema.virtual("price").get(function () {
  if (this.game && this.game.price) {
    if (this.condition === "New") {
      return this.game.price;
    } else {
      return this.game.price * 0.75;
    }
  }
  return null;
});

// Export model
module.exports = mongoose.model("GameInstance", GameInstanceSchema);
