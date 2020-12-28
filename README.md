# Duplicate Files Manager

Utilities library for finding and handling duplicate files. This library allows you to search a given folder for duplicate files, or compare two folder for duplicates.

The library uses two methods for looking for duplicates. First method is by using the `MD5` checksum hash, and the second is by file name.

## Future improvements

- [ ] Compare two folders.
- [ ] Copy non duplicate files to target folder.

## How to use

### Development mode

In order to start using you can set the virtual environment with the follow command:

```bash
# Create a folder ($PWD/testfiles/Images) and ($PWD/testfiles/Music) in the root folder of the project.
# Also, you can override the environment variables (SCAN_FOLDERS) and (OUTPUT_FOLDER).
# NOTE: If you choose to not set those values, you will be prompted to give the paths.
source scripts/setup.sh
```

If you choose to not set the virtual environment, you can just install the required packages and run the program.

```py
pip -r requirements.txt
```

#### Run the different actions

1. Find duplicates files in the given folder

```bash
make find-dup

or

make find-dup PATHS="<path1> <path2> ..."
```

Or

```py
python scripts/dev/find_duplicates.py

or

python scripts/dev/find_duplicates.py "<path1> <path2>"
```
