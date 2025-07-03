import axios from "axios";

/**
 * Gets books from OpenLibrary API, based on the request parameters.
 *
 * @param req the request object. Contains the parameters used to filter among all books.
 * @returns an array of internet archive books
 */
export async function getOpenLibraryBooksBySubject(
  req: OpenLibraryRequest,
): Promise<InternetArchiveBook[]> {
  const GET_BOOKS_QUERY = `https://archive.org/advancedsearch.php?q=collection:opensource+AND+language:english+AND+subject:${encodeURIComponent(req.subject)}+AND+mediatype:texts&fl=title,creator,identifier&sort[]=downloads+desc&sort[]=avg_rating+desc&rows=${req.limit + 10}&page=1&output=json`;
  const selectedBooks: InternetArchiveBook[] = [];

  try {
    const booksResponse = await axios({
      url: GET_BOOKS_QUERY,
      method: "GET",
      responseType: "json",
    });
    const res = booksResponse.data.response as OpenLibraryResponse;
    const internetArchiveResponseBooks = res.docs;

    for (const book of internetArchiveResponseBooks) {
      if (selectedBooks.length === req.limit) break

      const bookMetadata = await getBookMetadata({ id: book.identifier });
      book.epubFile = bookMetadata?.files.find(
        (file) => file.format === "EPUB",
      )?.name;

      if (book.epubFile) {
        selectedBooks.push(book)
      }
    }
  } catch {
    throw Error("Error retrieving books from open library API");
  }

  return selectedBooks;
}

/**
 * Gets a book's metadata.
 *
 * @param req the metadata request object, containing the ID of the book to get the metadata from
 */
export async function getBookMetadata(
  req: InternetArchiveMetadataRequest,
): Promise<InternetArchiveMetadataResponse | null> {
  let result = null;
  const getMetadataQuery = `https://archive.org/metadata/${req.id}`;

  try {
    const bookMetadataResponse = await axios({
      url: getMetadataQuery,
      method: "GET",
      responseType: "json",
    });
    result = bookMetadataResponse.data as InternetArchiveMetadataResponse;
  } catch (error) {
    console.error(error);
  }

  return result;
}
