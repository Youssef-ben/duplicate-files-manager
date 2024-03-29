"""
Get the list of all duplicate files in the given folder.
"""
# pylint: disable=too-few-public-methods
# pylint: disable=broad-except

# Custom
from .base_manager import BaseManager
from ..core import utils
from ..core import custom_printer as log


class DuplicatesInFolder(BaseManager):
    """
    Get the list of all duplicate files in the given folder.
    """

    def find_in_folders(self):
        """Summary:\n
        Find duplicate files in the given folders and write the
        result to a file in the specified output folder.
        """

        try:
            print()
            log.print_inf('Starting the duplicate search process')

            for folder in self.folders_to_scan:

                # Start exploring the folder.
                self._explore_folder(folder, True)

                # Clean the loaded files and return the duplicates.
                self._find_duplicates()

                # Write the result of each folder into a dedicated file.
                self._write_to_file()

            log.print_inf(
                'Finished the duplicate search process for the given folders!')

        except Exception as message:
            error = utils.format_error_message(message)
            log.print_error(error)
