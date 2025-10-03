import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findById(id_param);

  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findByIdAndDelete({
    _id: id_param,
  });

  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findByIdAndUpdate(
  { _id: id_param },
  req.body,
  { new: true },
  );
  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};



