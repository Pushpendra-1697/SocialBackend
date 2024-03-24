const { Schema, model } = require("mongoose");
const ChildSchema = require("./child.model");

// **************** Room Schema with room collection ****************
const RoomSchema = new Schema(
    {
        floorNumber: Number,
        roomType: { type: String, required: true },
        image: String,
        title: String,
        children: [ChildSchema] // Embedding child documents
    },
    { versionKey: false, timestamps: true }
);

const RoomModel = model("room", RoomSchema);

module.exports = RoomModel;