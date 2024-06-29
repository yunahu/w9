import express from "express";
import { notes, addNote, removeNote, editNote } from "../persistence.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send(notes());
  res.redirect("/");
});

router.post("/", function (req, res, next) {
  const noteText = req.body.noteText;
  if (noteText) addNote(noteText);
  res.send(notes());
  res.redirect("/");
});

router.delete("/delete/:id", function (req, res, next) {
  const id = req.params.id;
  if (id) {
    removeNote(id);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.patch("/edit/:id", function (req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  if (id) {
    editNote(id, text);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

export default router;
