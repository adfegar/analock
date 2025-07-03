import { getOpenLibraryBooksBySubject } from "../services/books.services";
import { useEffect, useState } from "react";
import {
  getSelectedBooks,
  setSelectedBooks,
  setStorageBook,
} from "../services/storage.services";

export interface useOpenLibraryBooksBySubjectResult {
  openLibraryBooksBySubject: InternetArchiveBook[];
  error: string | undefined;
}

export function useOpenLibraryBooksBySubject(
  params: OpenLibraryRequest,
): useOpenLibraryBooksBySubjectResult {
  const [openLibraryBooksBySubject, setOpenLibraryBooksBySubject] = useState<
    InternetArchiveBook[]
  >([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const selectedBooks = getSelectedBooks();

    if (selectedBooks.length > 0) {
      setOpenLibraryBooksBySubject(selectedBooks);
    } else {
      getOpenLibraryBooksBySubject(params)
        .then((books) => {
          setOpenLibraryBooksBySubject(books);
          setSelectedBooks(books);
          setStorageBook(books.map(book => ({ id: book.identifier } as StorageBook)))
        })
        .catch((error) => setError(error));
    }
  }, []);

  return { openLibraryBooksBySubject, error };
}
