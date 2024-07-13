import { ApolloServer } from "@apollo/server";
import { addNote, editNote, notes, removeNote } from "./persistence.js";

// Schema definition
const typeDefs = `#graphql
  type Note {
    id: String
    text: String
  }

	type Photo {
		url: String
		author: String
		link: String
		alt: String
	}

  type Query {
		notes: [Note]
		photo(search: String): Photo
  }

	type Mutation {
		addNote(noteText: String): Boolean
		editNote(id: String, text: String): Boolean
		deleteNote(id: String): Boolean
	}
`;

const resolvers = {
  Query: {
    notes: () => notes(),
    photo: async (_, { search }) => {
      console.log(search);
      let result = await fetch(
        `https://api.unsplash.com/search/photos?query=${search}&client_id=${process.env.UNSPLASH_ACCESSKEY}`
      );
      result = await result.json();
      result = result.results[0];
      const url = result.urls.regular;
      const author = result.user.name;
      const link = result.links.html;
      const alt = result.alt_description;
      return { url, author, link, alt };
    },
  },
  Mutation: {
    addNote: (_, { noteText }) => {
      addNote(noteText);
      return true;
    },
    editNote: (_, { id, text }) => {
      if (id) {
        editNote(id, text);
        return true;
      } else {
        return false;
      }
    },
    deleteNote: (_, { id }) => {
      if (id) {
        removeNote(id);
        return true;
      } else {
        return false;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

export default server;
