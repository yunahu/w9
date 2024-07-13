import express from "express";
import { notes, addNote, removeNote, editNote } from "../persistence.js";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send(notes());
});

router.post("/", function (req, res, next) {
  const noteText = req.body.noteText;
  if (noteText) addNote(noteText);
  res.send(notes());
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

router.get(`/photo/:search`, async function (req, res, next) {
  const search = req.params.search;
  let result = await fetch(
    `https://api.unsplash.com/search/photos?query=${search}&client_id=${process.env.UNSPLASH_ACCESSKEY}`
  );
  result = await result.json();
  result = result.results[0];
  const url = result.urls.regular;
  const author = result.user.name;
  const link = result.links.html;
  const alt = result.alt_description;
  res.send({ url, author, link, alt });
});

export default router;
