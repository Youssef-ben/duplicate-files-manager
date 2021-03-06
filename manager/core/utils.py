"""
Utility file that contains the needed function
for this library.
"""
import time
import sys
import re
import ntpath
from platform import system
from os import environ as env
from os import path, sep, getcwd, makedirs, remove
from shutil import copy2, rmtree
from pathlib import Path

from .custom_printer import print_ok
from .constants import E_SCAN_FOLDERS, E_OUTPUT_FOLDER, C_OUT_FOLDER_NAME


def __sanitizePaths(paths: str):
    # Convert path separator to current os.
    paths = fixSeparator(paths)

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


def __getFromEnvVar():
    folders = env.get(E_SCAN_FOLDERS)
    if not folders:
        return []

    folders = __sanitizePaths(folders)
    return folders.split(';')


def __getFromSystemArgs():
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


def __getFromUserInput():
    userInput = input(
        'Enter the list of parent/Source-Destination folders (ex: <path1>;<path2>): ')

    if not userInput:
        return []

    result = __sanitizePaths(userInput)
    return result.split(';')


def fixSeparator(paths: str):
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


def getFoldersToScan():
    """Summary:\n
    Return a list of parent folders that we want to scan for duplicate files.

    The method get the parent folder from the following steps:
    - The Environment variables {SCAN_FOLDERS}: ex: '<folder/path1>;<folder/path2>'.
    - The Arguments when running the command. ex: 'pyhton <cmd> <args1 arg2 ...>'.
    - The User input.

    Raises:\n
        Exception: 'No folder was given.'

    Returns:\n
        list(str): 'The list of parent folder to scan.'
    """
    # Get the list from the environment variable first.
    folders = __getFromEnvVar()

    # Get the list from the system arguments, if the list is empty.
    if not folders:
        folders = __getFromSystemArgs()

    # Last, Get the list from the user input.
    if not folders:
        folders = __getFromUserInput()

    if not folders:
        raise Exception(
            'You must specify at least one folder to check for duplicates!')

    return folders


def getOutputFolder():
    # Check if the env var `OUTPUT_FOLDER` is set.
    # Otherwise set it to the current user home directory.
    userHomeFolder = str(Path.home())
    outputFolder = env.get(E_OUTPUT_FOLDER)

    # If not specified, first prompt the user.
    if not outputFolder:
        outputFolder = input(
            f'Enter the output folder (Default to {userHomeFolder}): ')

    # Defaul tot user Home folder if no input.
    if not outputFolder:
        outputFolder = userHomeFolder

    outputFolder = path.join(outputFolder, C_OUT_FOLDER_NAME)
    outputFolder = fixSeparator(outputFolder)

    # Create the output folder if not exists.
    if not path.exists(outputFolder):
        makedirs(outputFolder)

    return outputFolder


def copyFiles(baseFolder: str, filesList: list):
    for item in filesList:
        filename = ntpath.basename(str(item))
        filePath = path.join(baseFolder, filename)
        filePath = fixSeparator(filePath)
        copy2(item, filePath)


def createFolder(outputFolder: str, folderName: str):
    folderPath = path.join(outputFolder,  folderName)
    folder = fixSeparator(folderPath)
    if path.exists(folder):
        rmtree(folder)

    makedirs(folder, exist_ok=True)

    return folder


def getExceptionMessage(ex):
    """Summary:\n
    Format the exception message and adds more details.

    Args:\n
        ex (Exception): 'The exception you want to format.'

    Returns:\n
        message (str): 'Formatted exception message.'
    """
    import traceback

    # Getting the traceback
    listStr = traceback.format_tb(ex.__traceback__)
    for index, value in enumerate(listStr):
        listStr[index] = '\t' + \
            value.replace('\n', ' ').replace(' '*5, ' ==> ')
    traceback_str = '\n'.join(listStr)

    en_str_value = str(ex)

    if not en_str_value.startswith('\n'):
        en_str_value = f'\n    {str(en_str_value)}'

    # Add the source of the exception
    en_str_value = '{}\n    Source: (\n{}\n\t)'.format(
        en_str_value.rstrip(), traceback_str)

    return en_str_value


def mergeDictionaries(dict1, dict2):
    for key in dict2.keys():
        if key in dict1:
            dict1[key] = dict1[key] + dict2[key]
        else:
            dict1[key] = dict2[key]

    return dict1


def printExecutionTime(start_time: time):
    print()
    timer = "{:.5f}".format(time.time() - start_time)
    print_ok(f'---------------------------------------')
    print_ok(f'----- Finished in {timer} seconds -----')
    print_ok(f'---------------------------------------')
