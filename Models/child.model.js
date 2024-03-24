const { Schema, model } = require("mongoose");

// **************** Child Schema ****************
const ChildSchema = new Schema(
    {
        title: String,
        subTitle: String,
        price: Number,
        link: String,
        longitude: Number,
        latitude: Number
    },
    { versionKey: false, timestamps: true }
);

module.exports = ChildSchema;