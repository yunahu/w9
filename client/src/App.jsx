import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Outlet, Link, useParams } from "react-router-dom";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/notes/:id" element={<EditPage />}></Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("http://localhost:3000/notes");
      setNotes(await res.json());
    };
    run();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3000/notes/delete/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotes(notes.filter((x) => x.id !== id));
    }
  };

  const handleAdd = async () => {
    const input = document.querySelector("#noteInput");

    const res = await fetch(`http://localhost:3000/notes/`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ noteText: input.value }),
    });

    setNotes(await res.json());
  };

  return (
    <div>
      <h1>YANT</h1>
      {notes &&
        notes.map((x) => {
          return (
            <div key={x.id}>
              <div className="notes">
                <Link to={`/notes/${x.id}`}>
                  <h2>{x.text}</h2>
                </Link>
                <button onClick={() => handleDelete(x.id)}>Delete</button>
              </div>
              <hr></hr>
            </div>
          );
        })}
      <input id="noteInput" type="text" />
      <button onClick={handleAdd}>Add a new Note</button>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>About page...</p>
    </div>
  );
}

const EditPage = () => {
  const { id } = useParams();
  const [noteText, setNoteText] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("http://localhost:3000/notes");
      const notes = await res.json();
      const note = notes.filter((x) => x.id === id)[0];
      setNoteText(note.text);
    };
    run();
  }, []);

  const input = document.querySelector("#inputEdit");

  const handleEdit = async () => {
    const text = input.value;
    const res = await fetch(`http://localhost:3000/notes/edit/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setNoteText(text);
    }
  };

  const generateImage = async () => {
    const text = input.value;
    if (noteText !== text)
      alert(
        "To generate an image from your input, click the Edit button first"
      );
    if (noteText) {
      let result = await fetch(`http://localhost:3000/notes/photo/${noteText}`);
      result = await result.json();
      setPhoto(result);
    }
  };

  return (
    <div>
      <h2>Note ID: {id}</h2>
      <input id="inputEdit" type="text" placeholder={noteText} />
      <button onClick={handleEdit}>Edit</button>
      <div>
        <button onClick={generateImage}>Generate Image!</button>
      </div>
      {photo && (
        <div>
          <img src={photo.url} alt={photo.alt} width={400} />
          <div>
            <span>Photo by </span>
            <span>{photo.author}</span>
            <div>({photo.link})</div>
          </div>
        </div>
      )}
    </div>
  );
};

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
