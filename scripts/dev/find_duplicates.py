"""
Process to find duplicates in the given folder.
"""

from manager import DuplicatesInFolder

if __name__ == "__main__":
    dupFinder = DuplicatesInFolder()

    # Start The process
    dupFinder.find_in_folders()
