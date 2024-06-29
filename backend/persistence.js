import { v4 as uuidv4 } from "uuid";

let _notes = [
  { id: "2", text: "CPSC 2650" },
  { id: "1", text: "An awesome web dev Note" },
];

const notes = () => _notes;

const addNote = (text) => _notes.push({ id: uuidv4(), text });

const editNote = (id, text) => {
  const note = _notes.find((x) => x.id === id);

  if (note) note.text = text;
};

const removeNote = (id) => (_notes = _notes.filter((x) => x.id !== id));

export { notes, addNote, editNote, removeNote };
