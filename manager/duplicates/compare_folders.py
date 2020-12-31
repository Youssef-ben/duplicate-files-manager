import ntpath
from collections import defaultdict
from os import path, makedirs
from shutil import copyfile


# Custom
from .base_manager import BaseManager
from ..core import utils
from ..core import custom_printer as log


class CompareFolders(BaseManager):
    """
    Compare two folders for duplicates and create a folder of non duplicates files from the source folder.
    """

    SourceFiles: dict = defaultdict(list)
    DestinationFiles: dict = defaultdict(list)
    NonDuplicateFiles: list = []

    def __init__(self):
        super().__init__()

    def __get_duplicates_from_folders(self):
        self.DuplicateFiles = []
        self.NonDuplicateFiles = []

        # Loop on source files and test against destination.
        for key, value in self.SourceFiles.items():
            if key in self.DestinationFiles:
                self.DuplicateFiles.append(value[0])
            else:
                self.NonDuplicateFiles.append(value[0])

    def __move_duplicate_files(self, sourcePath: str):
        # Should copy the duplicate files into a result folder.
        outputFolder = r'D:\3.Workspace\1.Github\duplicate-files-manager\testfiles\results'

        # Create result folder and copy duplicate and non -duplicate Files.
        folderName = path.split(sourcePath)[1]
        folderName = folderName.strip('\\').strip('/').strip(' ')
        outputFolder = utils.fixSeparator(path.join(outputFolder,  folderName))
        dupFolder = utils.fixSeparator(path.join(outputFolder,  'duplicates'))
        nonDupFolder = utils.fixSeparator(
            path.join(outputFolder,  'non-duplicates'))

        makedirs(outputFolder, exist_ok=True)
        makedirs(dupFolder, exist_ok=True)
        makedirs(nonDupFolder, exist_ok=True)

        # Copy duplicates
        for item in self.DuplicateFiles:
            filename = utils.fixSeparator(
                path.join(dupFolder, ntpath.basename(item)))
            copyfile(item, filename)

        # Copy non duplicates
        for item in self.NonDuplicateFiles:
            filename = utils.fixSeparator(
                path.join(nonDupFolder, ntpath.basename(item)))
            copyfile(item, filename)

    def compare(self):

        try:
            print()

            log.print_inf('Setting up the folders!')
            foldersToScan = [
                r'D:\3.Workspace\1.Github\duplicate-files-manager\testfiles\copy-from',
                r'D:\3.Workspace\1.Github\duplicate-files-manager\testfiles\copy-to'
            ]

            log.print_inf('Loading the files from the source folder!')
            self.SourceFiles = self._explore_folder(
                baseFolder=foldersToScan[0], withDuplicates=False)

            log.print_inf('Loading the files from the destination folder!')
            self.DestinationFiles = self._explore_folder(
                baseFolder=foldersToScan[1], withDuplicates=False)

            log.print_inf('Searching for duplicates!')
            self.__get_duplicates_from_folders()

            print(f'Duplicates: [{len(self.DuplicateFiles)}].')
            print(f'Non-Duplicates: [{len(self.NonDuplicateFiles)}].')

            self.__move_duplicate_files(foldersToScan[0])

        except Exception as message:
            error = utils.getExceptionMessage(message)
            log.print_error(error)
