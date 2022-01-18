"""
Compare two folders for duplicates and create a folder of non duplicates files
from the source folder.
"""
# pylint: disable=too-few-public-methods
# pylint: disable=broad-except

from collections import defaultdict

# Custom
from ..core import utils
from .base_manager import BaseManager
from ..core import custom_printer as log


class CompareFolders(BaseManager):
    """
    Compare two folders for duplicates and create a folder of non duplicates files
    from the source folder.
    """

    source_files: dict = defaultdict(list)
    destination_files: dict = defaultdict(list)
    non_duplicate_files: list = []

    def __compare_folders_for_duplicates(self):
        self.duplicate_files = []
        self.non_duplicate_files = []

        # Loop on source files and test against the destination folder.
        for key, value in self.source_files.items():
            if key in self.destination_files:
                self.duplicate_files.append(value[0])
            else:
                self.non_duplicate_files.append(value[0])

    def __move_duplicate_files(self):
        # Should copy the duplicate files into a result folder.
        duplicate_folder = utils.create_folder(self.output_folder, True)
        non_duplicate_folder = utils.create_folder(self.output_folder, False)

        # Copy duplicates
        log.print_ok('Extracting the duplicate files...')
        utils.copy_files(duplicate_folder, self.duplicate_files)

        # Copy non-duplicates
        log.print_ok('Extracting the non-duplicate files...')
        utils.copy_files(non_duplicate_folder, self.non_duplicate_files)

    def compare(self):
        """
        Compare the given folders for duplicates.
        """

        try:
            log.print_inf('Loading the files from the source folder!')
            self.source_files = self._explore_folder(
                self.folders_to_scan[0], False)

            log.print_debug(
                f'Loaded ({len(self.source_files)}) file(s) from ({self.folders_to_scan[0]}).')
            print()

            log.print_inf('Loading the files from the destination folder!')
            self.destination_files = self._explore_folder(
                self.folders_to_scan[1], False)

            log.print_debug(
                f'Loaded ({len(self.destination_files)}) file(s) from ({self.folders_to_scan[1]}).')
            print()

            log.print_inf(
                'Compare folders (Source/Destination) for duplicates!')
            self.__compare_folders_for_duplicates()

            log.print_inf('Filtering the result!')
            self.__move_duplicate_files()

        except Exception as message:
            error = utils.format_error_message(message)
            log.print_error(error)
