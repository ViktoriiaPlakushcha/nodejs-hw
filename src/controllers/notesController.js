import createHttpError from "http-errors";
import { Note } from "../models/note.js";


export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;

  const notesQuery = Note.find({userId: req.user._id});


  if (tag) {
    notesQuery.where("tag").equals(tag);
  }

  if (search && search.trim() !== '') {
    notesQuery
      .where({ $text: { $search: search } })
      .sort({ score: { $meta: "textScore" } });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPageNum),
  ]);

  const totalPages = Math.ceil(totalNotes / perPageNum);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findOne({ _id: id_param, userId: req.user._id });

  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findOneAndDelete({ _id: id_param, userId: req.user._id });

  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const id_param = req.params.noteId;
  const note = await Note.findOneAndUpdate(
    {_id: id_param, userId: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!note) {
    next(createHttpError(404,'Note not found'));
    return;
  }
  res.status(200).json(note);
};



