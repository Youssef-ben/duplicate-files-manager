#!/usr/bin/env python3
"""
Abstract Base manager class, contains the shared methods
between the folders comparision and finding duplicates.
"""
# pylint: disable=no-self-use
# pylint: disable=too-few-public-methods

# Based on the following solutions :
#   - `https://www.pythoncentral.io/finding-duplicate-files-with-python/`
#   - `https://gist.github.com/vinovator/a2ba7306e829bf3a9010`

from abc import ABC
from collections import defaultdict
from os import path, walk

# Custom
from ..core import custom_printer as log
from ..core import utils


class BaseManager(ABC):
    """Summary:\n
    Module that offers the base methods required by the managers.
    """
    # Folders to scan and output folder
    output_folder: str
    folders_to_scan: list

    # Attributes for summary.
    scanned_folders: int = 0

    # Attributes for data.
    current_folder: str = ''
    loaded_files: defaultdict(list)
    duplicate_files: list

    def __init__(self):
        # Get the list of folders to scan.
        self.folders_to_scan = utils.get_folders_to_scan()

        # Get the output file.
        self.output_folder = utils.get_output_folder()

    def __load_files(self, folder_path: str, files_list: list, with_duplicates: bool):
        """Summary:\n
        Load the files of the given folder in a dictionary.

        Args:\n
            folder_path (str): 'The folder from which we are loading the files.'
            files_list (list): 'The list of files in the specified folder.'
            with_duplicates (bool): 'Indicate if we want to load duplicate files too.'

        Returns:\n
            (dict(list)): 'Returns a dictionary of lists.'
        """
        # Dictionary to hold the Hash and files paths.
        result = defaultdict(list)

        for item in files_list:
            full_path = path.join(folder_path, item)

            file_hash = utils.genrate_md5_hash(full_path)

            if (file_hash not in result) and (not with_duplicates):
                result[file_hash].append(full_path)
            else:
                result[file_hash].append(full_path)

        return result

    def _find_duplicates(self):
        """Summary:\n
        Find and return the list of duplicate files from the given dictionary.

        Returns:
            list: 'The list of duplicate files.'
        """
        self.duplicate_files = list(
            filter(lambda x: len(x) > 1, self.loaded_files.values()))

        if len(self.duplicate_files) < 1:
            log.print_warning(
                f'No duplicate files were found in the folder ({self.current_folder})!')
            return defaultdict(list)

        return self.duplicate_files

    def _explore_folder(self, base_folder: str, with_duplicates=True):
        """Summary:\n
        Walks the given folder and load its files.

        Args:\n
            base_folder (str): 'The folder we want to load.'
            with_duplicates (bool, optional): 'Indicate if we want to load duplicate files too.'

        Raises:\n
            Exception: 'Thrown when the base folder is not supplied.'

        Returns:\n
            dict(list): 'Returns the loaded files.'
        """
        if not base_folder:
            raise Exception(
                'Base folder required! please specify a valid folder!')

        log.print_title(f'Searching the base folder ({base_folder})...')

        if not path.exists(base_folder):
            log.print_warning(
                f"Folder ({base_folder}) doesn't exists! Skipping...")

        self.current_folder = base_folder
        self.scanned_folders = 0
        self.loaded_files = defaultdict(list)

        # Scan the folder and load the files into a dictionary.
        for folder_name, _, files_list in walk(self.current_folder):
            log.print_ok(f'Searching the folder: ({folder_name})...')
            self.scanned_folders += 1

            files_in_folder = self.__load_files(
                folder_name, files_list, with_duplicates)

            utils.merge_dictionaries(self.loaded_files, files_in_folder)

        return self.loaded_files

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
        '----------------------------------------------------------------------------------------'\n
        """
        # Get the name of the parent folder being searched for
        # duplicates, to set the name of the file with it.
        folder_name = path\
            .split(self.current_folder)[1]\
            .strip('\\').strip('/').strip(' ')

        output_file = path.join(
            self.output_folder,  f'{folder_name}_result.txt')
        output_file = utils.unify_separator(output_file)

        log.print_title(
            f'Saving the result to the file: ({output_file}).')

        current_folder_msg = f'Base folder: ({self.current_folder}).'
        scanned_folders_msg = f'Scanned sub-folders: ({self.scanned_folders}).'
        loaded_files_msg = f'Loaded files: ({len(self.loaded_files)}).'
        duplicates_msg = f'Duplicate files: ({len(self.duplicate_files)}).'

        # Print to file.
        repeat = 40
        output_file = open(output_file, "w", encoding='utf-8')
        output_file.write(f'{"="*repeat} SUMMARY {"="*repeat}\n')
        output_file.write(f'{current_folder_msg}\n')
        output_file.write(f'{scanned_folders_msg}\n')
        output_file.write(f'{loaded_files_msg}\n')
        output_file.write(f'{duplicates_msg}\n')
        output_file.write(f'{"="*(repeat*2 + 9)}\n\n')

        for item in self.duplicate_files:
            for sub_item in item:
                output_file.write(f'{sub_item}\n')

            output_file.writelines(f'{"-"*(repeat*2 + 9)}\n\n')

        output_file.close()

        # Print to screen.
        repeat = 40
        log.print_debug(f'{"="*repeat} SUMMARY {"="*repeat}')
        log.print_debug(current_folder_msg)
        log.print_debug(scanned_folders_msg)
        log.print_debug(loaded_files_msg)
        log.print_debug(duplicates_msg)
        log.print_debug(f'{"="*(repeat*2 + 9)}')
        print()
