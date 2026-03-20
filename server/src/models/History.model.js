import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    //Use who perform the action
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    //Type of action: translate, analyze, optimize, explain
    type: {
      type: String,
      enum: {
        values: ["translate", "analyze", "optimize", "explain"],
        message: "{VALUE} is not a valid action type",
      },
      required: [true, "Action type is required"],
    },

    //User's input code
    inputCode: {
      type: String,
      required: [true, "Input code is required"],
    },

    //Language of the input code
    sourceLanguage: {
      type: String,
      default: "",
    },

    //Language to which it is to be translated
    targetLanguage: {
      type: String,
      default: "",
    },

    //Gemini's response
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Output is required"],
    },
  },
  {
    timestamps: true,
  },
);

const History = mongoose.model("History", historySchema);
export default History;