import {unzip} from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import {NativeModules} from 'react-native'
// Holds the root path where downloaded files are stored
export const APP_DOCUMENTS_PATH = `${RNFS.ExternalDirectoryPath}/Documents`

/*
 * Downloads and unzips the EPUB file corresponding to the given
 * Internet Archive item identifier.
 * @param ebookId - The item identifier
 */
export async function downloadAndUnzipEpub(book: InternetArchiveBook) {
  const epubUrl = `https://archive.org/download/${book.identifier}`
  const unzipPath = `${APP_DOCUMENTS_PATH}/${book.identifier}`
  const {BackgroundDownloadModule} = NativeModules

  if (epubUrl !== undefined) {
    const bookExists = await RNFS.exists(unzipPath)

    if (!bookExists) {
      if (book.epubFile !== undefined) {
        // Call to the native module to start the EPUB file's download
        try {
          const downloadedFilePath =
            await BackgroundDownloadModule.startDownload(epubUrl, book.epubFile)
          console.log(
            `book ${book.epubFile} has been downloaded to ${downloadedFilePath}`,
          )

          // Unzip the EPUB file
          await unzip(downloadedFilePath, unzipPath)
          console.log('Unzipped to:', unzipPath)

          // Remove the EPUB file to free space
          await RNFS.unlink(downloadedFilePath)
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      console.log(`Book ${unzipPath} already exists. Skipping download...`)
    }
  }
}
