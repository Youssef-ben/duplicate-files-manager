echo "Cleaning the work folder..."
make setup

echo "Activating the virtual environment..."
source $PWD/.venv/Scripts/activate

echo "Setting up the test files folder..."
# Duplicate files in the same folder.
# export SCAN_FOLDERS="$PWD/testfiles/Images;$PWD/testfiles/Music"

# Duplicate files in the Source/Destination folder.
export SCAN_FOLDERS="$PWD/testfiles/copy-from;$PWD/testfiles/copy-to"
export OUTPUT_FOLDER="$PWD"