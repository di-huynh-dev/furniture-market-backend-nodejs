"use strict";

const mongoose = require("mongoose");
const DOCUMENT_NAME = "User"; //Record/Row name
const COLLECTION_NAME = "Shops"; // Table name

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    roles: {
      type: Array,
      default: [],
    },
    birthDate: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collation: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
