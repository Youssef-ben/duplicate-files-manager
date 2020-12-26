#!/usr/bin/env python3

# Based on the following solutions :
#   - `https://www.pythoncentral.io/finding-duplicate-files-with-python/`
#   - `https://gist.github.com/vinovator/a2ba7306e829bf3a9010`

"""
Get the list of all duplicate files in the given folder.

This module create a checksum of each file using the MD5
hashing to determine the files duplicate.
"""

import time
import os
import sys
import hashlib

from collections import defaultdict
from pathlib import Path

# Custom
from ..core import utils
from ..core import custom_printer as log


def __get_md5_hash(filePath, bufferSize=65536):
    """Summary:\n
    Generate the MD5 checksum hash of the given file.

    Args:\n
        filePath(str): 'The files you want to generate hash from.'
        bufferSize(int): 'The buffer size that we want read the file.'
    """
    hasher = hashlib.md5()

    with open(filePath, "rb") as f:
        # Initialize the buffer.
        buffer = f.read(bufferSize)

        # Read the file until the end and update hash at the same time.
        while buffer:
            hasher.update(buffer)
            buffer = f.read(bufferSize)

    # Return the file hash.
    return hasher.hexdigest()


def __loadFiles(folderName, filesList: list):

    # Dictionary to hold the Hash with duplicate files paths.
    result = defaultdict(list)

    for item in filesList:
        fullPath = os.path.join(folderName, item)

        file_hash = __get_md5_hash(fullPath)
        result[file_hash].append(fullPath)

    return result


def __findDuplicates(baseFolder: str, loadedFiles: dict):
    results = list(filter(lambda x: len(x) > 1, loadedFiles.values()))
    if len(results) < 1:
        log.print_warning(
            f'No duplicate files were found in the folder ({baseFolder})!')
        return defaultdict(list)

    return results


def __writeResults(baseFolder: str, duplicates, folderCount: int, filesCount: int):

    f = open(utils.getOutputFile(baseFolder), "w")

    xrpt = 40
    f.write(f'{"="*xrpt} SUMMARY {"="*xrpt}\n')
    f.write(f'Base folder: ({baseFolder}).\n')
    f.write(f'Scanned sub-folders: ({folderCount}).\n')
    f.write(f'Loaded files: ({filesCount}).\n')
    f.write(f'Duplicate files: ({len(duplicates)}).\n')
    f.write(f'{"="*(xrpt*2 + 9)}\n\n')

    for item in duplicates:
        for subItem in item:
            f.write(f'{subItem}\n')
        f.writelines(f'{"-"*(xrpt*2 + 9)}\n\n')

    f.close()


def __exploreFolder(folderPath: str):
    if not folderPath or not os.path.exists(folderPath):
        log.print_warning(
            'Folder not specified or doesn\'t exists! Skipping...')

    scannedSubFolders = 0
    results = defaultdict(list)
    for folderName, subfolders, filesList in os.walk(folderPath):
        scannedSubFolders += 1

        folderFiles = __loadFiles(folderName, filesList)
        utils.mergeDictionaries(results, folderFiles)

    return (results, scannedSubFolders)


def findDuplicateFiles():
    start_time = time.time()
    print(f'Starting the duplicate search process')

    for folder in utils.getFoldersToScan():

        xrpt = 30
        log.print_debug(f'{"="*xrpt} SUMMARY {"="*xrpt}')
        log.print_debug(f'Base folder: ({folder}).')

        # Start exploring the folder.
        # 0: loadedFiles
        # 1: Number of sub folder scanned.
        result = __exploreFolder(folder)

        # Clean the loaded files and return the duplicates.
        duplicates = __findDuplicates(folder, result[0])

        # Set Count
        filesCount = len(result[0])

        # Write the result of each folder into a dedicated file.
        __writeResults(folder, duplicates, result[1], filesCount)

        log.print_debug(f'Scanned sub-folders: ({result[1]}).')
        log.print_debug(f'Loaded files: ({filesCount}).')
        log.print_debug(f'Duplicate files: ({len(duplicates)}).')
        log.print_debug(f'{"="*(xrpt*2 + 9)}')

    print(f'Finished the duplicate search process for the given folders!')

    utils.printExecutionTime(start_time)
