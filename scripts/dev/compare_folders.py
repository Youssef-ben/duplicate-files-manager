"""
Process to start the folders compare.
"""

from manager import CompareFolders

if __name__ == "__main__":
    cmpFolders = CompareFolders()

    # Start The process
    cmpFolders.compare()
