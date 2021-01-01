import ntpath
from collections import defaultdict
from os import path, makedirs
from shutil import copyfile, copy2


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

    def __compare_folders_for_duplicates(self):
        self.DuplicateFiles = []
        self.NonDuplicateFiles = []

        # Loop on source files and test against the destination folder.
        for key, value in self.SourceFiles.items():
            if key in self.DestinationFiles:
                self.DuplicateFiles.append(value[0])
            else:
                self.NonDuplicateFiles.append(value[0])

    def __move_duplicate_files(self, sourcePath: str):
        # Should copy the duplicate files into a result folder.
        dupFolder = utils.createFolder(self.OutputFolder, 'Duplicates')
        nonDupFolder = utils.createFolder(self.OutputFolder, 'Non-Duplicates')

        # Copy duplicates
        log.print_ok('Extracting the duplicate files...')
        utils.copyFiles(dupFolder, self.DuplicateFiles)

        # Copy non-duplicates
        log.print_ok('Extracting the non-duplicate files...')
        utils.copyFiles(nonDupFolder, self.NonDuplicateFiles)

    def compare(self):

        try:
            log.print_inf('Loading the files from the source folder!')
            self.SourceFiles = self._explore_folder(
                baseFolder=self.FoldersToScan[0], withDuplicates=False)
            log.print_debug(
                f'Loaded ({len(self.SourceFiles)}) file(s) from ({self.FoldersToScan[0]}).')
            print()

            log.print_inf('Loading the files from the destination folder!')
            self.DestinationFiles = self._explore_folder(
                baseFolder=self.FoldersToScan[1], withDuplicates=False)
            log.print_debug(
                f'Loaded ({len(self.DestinationFiles)}) file(s) from ({self.FoldersToScan[1]}).')
            print()

            log.print_inf(
                'Compare folders (Source/Destination) for duplicates!')
            self.__compare_folders_for_duplicates()

            log.print_inf('Filtring the result!')
            self.__move_duplicate_files(self.FoldersToScan[0])

        except Exception as message:
            error = utils.getExceptionMessage(message)
            log.print_error(error)
