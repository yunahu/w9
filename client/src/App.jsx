import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Routes, Route, Outlet, Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";

const GetNotes = gql`
  query {
    notes {
      id
      text
    }
  }
`;

const GetPhoto = gql`
  query Photo($search: String) {
    photo(search: $search) {
      url
      author
      link
      alt
    }
  }
`;

const AddNote = gql`
  mutation AddNote($noteText: String) {
    addNote(noteText: $noteText)
  }
`;

const EditNote = gql`
  mutation EditNote($id: String, $text: String) {
    editNote(id: $id, text: $text)
  }
`;

const DeleteNote = gql`
  mutation DeleteNote($id: String) {
    deleteNote(id: $id)
  }
`;

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
  const { loading, error, data, refetch } = useQuery(GetNotes);
  const [deleteNote] = useMutation(DeleteNote);
  const [addNote] = useMutation(AddNote);

  const handleDelete = async (id) => {
    const res = await deleteNote({ variables: { id } });
    if (res.data.deleteNote) refetch();
  };

  const handleAdd = async () => {
    const input = document.querySelector("#noteInput");
    const res = await addNote({ variables: { noteText: input.value } });
    if (res.data.addNote) refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>YANT</h1>
      {data &&
        data.notes.map((x) => {
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
  const [photo, setPhoto] = useState(null);
  const { loading, error, data, refetch } = useQuery(GetNotes);
  const [editNote] = useMutation(EditNote);
  const noteText = useMemo(
    () => data?.notes?.find((x) => x.id === id)?.text,
    [data, id]
  );
  const [getPhoto] = useLazyQuery(GetPhoto);

  const handleEdit = async () => {
    const input = document.querySelector("#inputEdit");
    const text = input.value;
    const res = await editNote({ variables: { id, text } });
    if (res.data.editNote) refetch();
  };

  const generateImage = async () => {
    const input = document.querySelector("#inputEdit");
    const text = input.value;
    if (noteText !== text)
      alert(
        "To generate an image from your input, click the Edit button first"
      );

    if (noteText) {
      let result = await getPhoto({ variables: { search: noteText } });
      setPhoto(result.data.photo);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
