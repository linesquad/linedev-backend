import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  week: { type: String, required: true },
});

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
