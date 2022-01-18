"""
Utility file that contains the needed function
for this library.
"""
import sys
import re
import ntpath
import traceback
from hashlib import md5
from platform import system
from os import environ as env
from os import path, sep, makedirs
from shutil import copy2, rmtree
from pathlib import Path

# Custom imports
import manager.core.constants as const


def __sanitize_paths(paths: str):
    """Sanitize the given string from spaces
    and remove any extras ';'

    Args:
        paths (str): Path to be sanitized.

    Returns:
        (str): Sanitized path.
    """
    # Convert path separator to current os.
    paths = unify_separator(paths)

    # Sanitize the paths
    paths = paths\
        .replace('\n', ';')\
        .replace('\r', ';')\
        .replace(' ;', ';')\
        .replace('; ', ';')\
        .lstrip(' ')\
        .rstrip(' ')\
        .lstrip(';')\
        .rstrip(';')

    return paths


def __get_from_environment():
    """Get the folder path of the folder to be scanned
    from the environment variable (SCAN_FOLDERS).

    Returns:
        list[str]: List of paths to be scanned.
    """
    folders = env.get(const.E_SCAN_FOLDERS)
    if not folders:
        return []

    folders = __sanitize_paths(folders)
    return folders.split(';')


def __get_from_system_args():
    """Get the list of folder to be scanned from
    the system args.

    Returns:
        list[str]: List of paths to be scanned.
    """
    result = []
    if len(sys.argv) < 2:
        return result

    index = 0
    for arg in sys.argv:
        if index < 1:
            index += 1
            continue

        result.append(arg)

    return result


def __get_from_user_input():
    """Get the list of folder to scan from user input.

    Returns:
        list[str]: List of paths to be scanned.
    """
    values = input(
        'Enter the list of parent/Source-Destination folders (ex: <path1>;<path2>): ')

    if not values:
        return []

    result = __sanitize_paths(values)
    return result.split(';')


def unify_separator(paths: str):
    """Change the path separators based on the current system.

    Args:
        paths (str): paths to be updated.

    Returns:
        (str): Updated paths
    """
    # Convert path separator to current os.
    paths = paths.replace('\\', sep).replace('/', sep)

    # If windows fix the path
    if system() == 'Windows':
        expr = r'\\([a-z])\\'

        regex = re.compile(expr)
        match = re.findall(regex, paths)

        for item in match:
            rep = f'{item.upper()}:{sep+sep}'
            paths = re.sub(rf'\\({item})\\', rep, paths)

    return paths


def get_folders_to_scan():
    """Summary:\n
    Return a list of parent folders that we want to scan for duplicate files.

    The method get the parent folder from the following steps:
    - The Environment variables {SCAN_FOLDERS}: ex: '<folder/path1>;<folder/path2>'.
    - The Arguments when running the command. ex: 'python <cmd> <args1 arg2 ...>'.
    - The User input.

    Raises:\n
        Exception: 'No folder was given.'

    Returns:\n
        list(str): 'The list of parent folder to scan.'
    """
    # Get the list from the environment variable first.
    folders = __get_from_environment()

    # Get the list from the system arguments, if the list is empty.
    if not folders:
        folders = __get_from_system_args()

    # Last, Get the list from the user input.
    if not folders:
        folders = __get_from_user_input()

    if not folders:
        raise Exception(
            'You must specify at least one folder to check for duplicates!')

    return folders


def get_output_folder():
    """Get the output folder were to store the result

    Returns:
        (str): The output folder path.
    """
    # Check if the env var `OUTPUT_FOLDER` is set.
    # Otherwise set it to the current user home directory.
    output_folder = env.get(const.E_OUTPUT_FOLDER)

    # Default to user home folder if no input.
    if not output_folder:
        output_folder = str(Path.home())

    # Create the output folder if not exits.
    output_folder = path.join(output_folder, const.C_OUT_FOLDER_NAME)
    output_folder = unify_separator(output_folder)

    # Create the output folder if not exists.
    if not path.exists(output_folder):
        makedirs(output_folder)

    return output_folder


def copy_files(dest_folder: str, files_list: list):
    """Copy the given files to the destination folder.

    Args:
        dest_folder (str): The folder where the files will be copied to.
        files_list (list): The files to be copied.
    """
    for item in files_list:
        filename = ntpath.basename(str(item))
        file_path = path.join(dest_folder, filename)
        file_path = unify_separator(file_path)
        copy2(item, file_path)


def create_folder(output_folder: str, for_duplicates: bool):
    """Create folder for the duplicate and non duplicate files.

    Args:
        output_folder (str): The base folder where to create the duplicate or non-duplicate folder.
        for_duplicates (bool): Specify if we want ot create duplicate or non-duplicate folder.

    Returns:
        (str): The folder path.
    """
    # Set the folder name.
    folder_name = const.C_DUPLICATES_FOLDER if for_duplicates else const.C_NON_DUPLICATES_FOLDER

    # Setup the path
    folder_path = path.join(output_folder,  folder_name)
    folder = unify_separator(folder_path)

    # Clear and remove if any exists
    # This will allow to always start fresh.
    if path.exists(folder):
        rmtree(folder)

    makedirs(folder, exist_ok=True)

    return folder


def format_error_message(ex):
    """Summary:\n
    Format the exception message and adds more details.

    Args:\n
        ex (Exception): 'The exception you want to format.'

    Returns:\n
        message (str): 'Formatted exception message.'
    """
    # Getting the traceback
    str_list = traceback.format_tb(ex.__traceback__)
    for index, value in enumerate(str_list):
        str_list[index] = '\t' + \
            value.replace('\n', ' ').replace(' '*5, ' ==> ')

    traceback_str = '\n'.join(str_list)

    en_str_value = str(ex)

    if not en_str_value.startswith('\n'):
        en_str_value = f'\n    {str(en_str_value)}'

    # Add the source of the exception
    en_str_value = '{}\n    Source: (\n{}\n\t)'.format(
        en_str_value.rstrip(), traceback_str)

    return en_str_value


def merge_dictionaries(base_dictionary, dict_to_be_merged):
    """Merge two dictionaries into one.

    Args:
        base_dictionary (dict): First Dictionary
        dict_to_be_merged (dict): Seconde Dictionary.

    Returns:
        (dict): Merged dictionaries.
    """
    for key in dict_to_be_merged.keys():
        if key in base_dictionary:
            base_dictionary[key] = base_dictionary[key] + \
                dict_to_be_merged[key]
        else:
            base_dictionary[key] = dict_to_be_merged[key]

    return base_dictionary


def genrate_md5_hash(file_path, buffer_size=const.C_DEFAULT_BUFFER_SIZE):
    """Summary:\n
    Generate the MD5 checksum hash of the given file.

    Args:\n
        filePath(str): 'The files you want to generate hash from.'
        bufferSize(int): 'The buffer size that we want read the file. default to (65536)'

    Returns:\n
        (str): 'Checksum hash of the file.'
    """
    hasher = md5()

    with open(file_path, "rb") as file_to_read:
        # Initialize the buffer.
        buffer = file_to_read.read(buffer_size)

        # Read the file until the end and update the hash at the same time.
        while buffer:
            hasher.update(buffer)
            buffer = file_to_read.read(buffer_size)

    # Return the file hash.
    return hasher.hexdigest()
