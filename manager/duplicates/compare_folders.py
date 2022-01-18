import ntpath
from collections import defaultdict
from os import path, makedirs
from shutil import copyfile, copy2


# Custom
from ..core import utils
from ..core import constants as const
from .base_manager import BaseManager
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
        self.duplicate_files = []
        self.NonDuplicateFiles = []

        # Loop on source files and test against the destination folder.
        for key, value in self.SourceFiles.items():
            if key in self.DestinationFiles:
                self.duplicate_files.append(value[0])
            else:
                self.NonDuplicateFiles.append(value[0])

    def __move_duplicate_files(self, sourcePath: str):
        # Should copy the duplicate files into a result folder.
        dupFolder = utils.create_folder(self.output_folder, True)
        nonDupFolder = utils.create_folder(self.output_folder, False)

        # Copy duplicates
        log.print_ok('Extracting the duplicate files...')
        utils.copy_files(dupFolder, self.duplicate_files)

        # Copy non-duplicates
        log.print_ok('Extracting the non-duplicate files...')
        utils.copy_files(nonDupFolder, self.NonDuplicateFiles)

    def compare(self):

        try:
            log.print_inf('Loading the files from the source folder!')
            self.SourceFiles = self._explore_folder(
                base_folder=self.folders_to_scan[0], with_duplicates=False)
            log.print_debug(
                f'Loaded ({len(self.SourceFiles)}) file(s) from ({self.folders_to_scan[0]}).')
            print()

            log.print_inf('Loading the files from the destination folder!')
            self.DestinationFiles = self._explore_folder(
                base_folder=self.folders_to_scan[1], with_duplicates=False)
            log.print_debug(
                f'Loaded ({len(self.DestinationFiles)}) file(s) from ({self.folders_to_scan[1]}).')
            print()

            log.print_inf(
                'Compare folders (Source/Destination) for duplicates!')
            self.__compare_folders_for_duplicates()

            log.print_inf('Filtering the result!')
            self.__move_duplicate_files(self.folders_to_scan[0])

        except Exception as message:
            error = utils.format_error_message(message)
            log.print_error(error)
