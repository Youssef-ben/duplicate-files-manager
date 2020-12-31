#!/usr/bin/env python3

# Based on the following solutions :
#   - `https://www.pythoncentral.io/finding-duplicate-files-with-python/`
#   - `https://gist.github.com/vinovator/a2ba7306e829bf3a9010`

from hashlib import md5
from pathlib import Path
from collections import defaultdict
from os import path, mkdir, getcwd, walk, environ as env


# Custom
from ..core import constants as const
from ..core import custom_printer as log
from ..core import utils


class BaseManager():
    """Summary:\n
    Module that offers the base methods required by the managers.
    """
    # Folders to scan and output folder
    OutputFolder: str
    FoldersToScan: list

    # Attributes for summary.
    ScannedFolders: int = 0

    # Attributes for data.
    CurrentFolder: str = ''
    LoadedFiles: defaultdict(list)
    DuplicateFiles: list

    def __init__(self):
        # Get the list of folders to scan.
        self.FoldersToScan = utils.getFoldersToScan()

        # Get the output file.
        self.OutputFolder = utils.getOutputFolder()

    def __get_md5_hash(self, filePath, bufferSize=const.C_DEFAULT_BUFFER_SIZE):
        """Summary:\n
        Generate the MD5 checksum hash of the given file.

        Args:\n
            filePath(str): 'The files you want to generate hash from.'
            bufferSize(int): 'The buffer size that we want read the file. default to (65536)'

        Returns:\n
            (str): 'Checksum hash of the file.'
        """
        hasher = md5()

        with open(filePath, "rb") as f:
            # Initialize the buffer.
            buffer = f.read(bufferSize)

            # Read the file until the end and update the hash at the same time.
            while buffer:
                hasher.update(buffer)
                buffer = f.read(bufferSize)

        # Return the file hash.
        return hasher.hexdigest()

    def __load_files_with_duplicates(self, folderPath: str, filesList: list):
        """Summary:\n
        Load the files of the given folder in a dictionary.

        Details:\n
        The method get the files MD5 hash and add it to the dictionary.\n
        If there is duplicate of the file, the method add it under the
        same key in the dictionary.

        Args:\n
            folderPath (str): 'The folder from which we are loading the files.'
            filesList (list): 'The list of files in the specified folder.'

        Returns:\n
            (dict(list)): 'Returns a dictionary of lists.'
        """
        # Dictionary to hold the Hash with duplicate files paths.
        result = defaultdict(list)

        for item in filesList:
            fullPath = path.join(folderPath, item)

            file_hash = self.__get_md5_hash(fullPath)
            result[file_hash].append(fullPath)

        return result

    def __load_files_without_duplicates(self, folderPath: str, filesList: list):
        """Summary:\n
        Load the files of the given folder in a dictionary.

        *WARNING: USE THIS METHOD WITH FOLDERs THAT DOESN'T HAVE DUPLICATES.*

        Details:\n
        The method get the files MD5 hash and add it to the dictionary.\n
        Note that it doesn't load duplicates files.

        Args:\n
            folderPath (str): 'The folder from which we are loading the files.'
            filesList (list): 'The list of files in the specified folder.'

        Returns:\n
            (dict(list)): 'Returns a dictionary of lists.'
        """
        # Dictionary to hold the Hash with duplicate files paths.
        result = defaultdict(list)

        for item in filesList:
            fullPath = path.join(folderPath, item)

            file_hash = self.__get_md5_hash(fullPath)
            if not file_hash in result:
                result[file_hash].append(fullPath)

        return result

    def _get_duplicates_in_folder(self):
        """Summary:\n
        Find and return the list of duplicate files from the given dictinary.

        Returns:
            list: 'The list of duplicate files.'
        """
        self.DuplicateFiles = list(
            filter(lambda x: len(x) > 1, self.LoadedFiles.values()))

        if len(self.DuplicateFiles) < 1:
            log.print_warning(
                f'No duplicate files were found in the folder ({self.CurrentFolder})!')
            return defaultdict(list)

        return self.DuplicateFiles

    def _explore_folder(self, baseFolder: str, withDuplicates=True):
        """Summary:\n
        Walks the given folder and load its files.

        Args:\n
            baseFolder (str): 'The folder we want to load.'
            withDuplicates (bool, optional): 'Indicate if we want to load duplicate files too.'

        Raises:\n
            Exception: 'Thrown when the base folder is not supplied.'

        Returns:\n
            dict(list): 'Returns the loaded files.'
        """
        if not baseFolder:
            raise Exception(
                'Base folder required! please specify a valid folder!')

        log.print_title(f'Searching the base folder ({baseFolder})...')

        if not path.exists(baseFolder):
            log.print_warning(
                f"Folder ({baseFolder}) doesn't exists! Skipping...")

        self.CurrentFolder = baseFolder
        self.ScannedFolders = 0
        self.LoadedFiles = defaultdict(list)

        # Define which method to call for loading the files.
        loadFiles = self.__load_files_with_duplicates
        if not withDuplicates:
            loadFiles = self.__load_files_without_duplicates

        # Scan the folder and load the files into a dictionary.
        for folderName, subfolders, filesList in walk(self.CurrentFolder):
            log.print_ok(f'Searching the folder: ({folderName})...')
            self.ScannedFolders += 1

            folderFiles = loadFiles(folderName, filesList)
            utils.mergeDictionaries(self.LoadedFiles, folderFiles)

        return self.LoadedFiles

    def _write_to_file(self):
        """Summary:\n
        Writes the summary and the result of the search in a files and print it to console.

        If the [OUTPUT_FOLDER] environment variable is not set, the method
        will default to the user home directory. (ex: <selected/path>/<folder-name>_result.txt).

        Example: \n
        ================ SUMMARY ===============================\n
        Base folder: (path/to/folder).\n
        Scanned sub-folders: (n).\n
        Loaded files: (n).\n
        Duplicate files: (n).\n
        ========================================================\n

        path/to/folder/W1.jpg\n
        path/to/duplicate/file/name.jpg\n
        '-----------------------------------------------------------------------------------------'\n
        """
        # Get the name of the parent folder being searched for
        # duplicates, to set the name of the file with it.
        folderName = path.split(self.CurrentFolder)[1]
        folderName = folderName.strip('\\').strip('/').strip(' ')
        outputFile = utils.fixSeparator(
            path.join(self.OutputFolder,  f'{folderName}_result.txt'))

        log.print_title(
            f'Saving the result to the file: ({outputFile}).')

        currentFolderMsg = f'Base folder: ({self.CurrentFolder}).'
        scannedFoldersMsg = f'Scanned sub-folders: ({self.ScannedFolders}).'
        loadedFilesMsg = f'Loaded files: ({len(self.LoadedFiles)}).'
        duplicatesMsg = f'Duplicate files: ({len(self.DuplicateFiles)}).'

        # Print to file.
        xrpt = 40
        f = open(outputFile, "w", encoding='utf-8')
        f.write(f'{"="*xrpt} SUMMARY {"="*xrpt}\n')
        f.write(f'{currentFolderMsg}\n')
        f.write(f'{scannedFoldersMsg}\n')
        f.write(f'{loadedFilesMsg}\n')
        f.write(f'{duplicatesMsg}\n')
        f.write(f'{"="*(xrpt*2 + 9)}\n\n')

        for item in self.DuplicateFiles:
            for subItem in item:
                f.write(f'{subItem}\n')
            f.writelines(f'{"-"*(xrpt*2 + 9)}\n\n')

        f.close()

        # Print to screen.
        xrpt = 40
        log.print_debug(f'{"="*xrpt} SUMMARY {"="*xrpt}')
        log.print_debug(currentFolderMsg)
        log.print_debug(scannedFoldersMsg)
        log.print_debug(loadedFilesMsg)
        log.print_debug(duplicatesMsg)
        log.print_debug(f'{"="*(xrpt*2 + 9)}')
        print()
