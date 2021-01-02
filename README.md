# Duplicate Files Manager

Utilities library for finding and handling duplicate files. This library allows you to search a given folder for duplicate files, or compare two folder for duplicates.

The library uses two methods for looking for duplicates. First method is by using the `MD5` checksum hash, and the second is by file name.

## Future improvements

- [ ] Copy non duplicate files to target folder.

## How to use

### Development mode

In order to start using you can set the virtual environment with the follow command:

```bash
# Create a folder ($PWD/testfiles/<name>) in the root folder of the project and put some files.
# Also, you can override the environment variables (SCAN_FOLDERS) and (OUTPUT_FOLDER).
# NOTE: If you choose to not set those values, you will be prompted to give the paths.
source scripts/setup.sh
```

If you choose to not set the virtual environment, you can just install the required packages and run the program.

```py
pip -r requirements.txt
```

## Library actions

### 1. Find duplicates files in the given folder

Find duplicate files in the given folders and return a `txt` file that contain the list of all the files and duplicates.

Each given directory will have its result file created with the summary and duplicates files location and names.
Those results files can be found under the folder `dfm_output` in the given output path.

**Example:** with the given path `path/to/my_images` the results will be under `path/to/output/folder/dfm_output/my_images_results.tx`

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

### 2. Compare folders for duplicates

Compare two given folders and find duplicates and non duplicates files.

The result of the action is the creation of two folders `Duplicates` and `Non_duplicates` that contains the result of the comparison, those folders can be found under the folder `dfm_output` in the given output path.

In summary, the method compare the given two paths (Source/Destination) for duplicates. At the end the method
copies the duplicates files from the source to the `dfm_output/Duplicates` folder and the non-duplicates to
`dfm_output/Non-Duplicates` folder. This makes it easy for the user to review and confirm the selection.

_Note: if the folders (Source/Destination) has duplicate files in them, the action will load only one version of it._

```python
make cmp-folders

or

make cmp-folders PATHS="<path1> <path2> ..."
```

Or

```py
python scripts/dev/compare_folders.py

or

python scripts/dev/compare_folders.py "<path1> <path2>"
```
