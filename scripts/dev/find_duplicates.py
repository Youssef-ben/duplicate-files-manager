from manager.core.custom_printer import print_error
from manager.core.utils import getExceptionMessage
from manager.duplicates.get_by_md5_hash import findDuplicateFiles

if __name__ == "__main__":
    try:
        findDuplicateFiles()
    except Exception as message:
        error = getExceptionMessage(message)
        print_error(error)
