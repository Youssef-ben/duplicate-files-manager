echo "Cleaning the work folder..."
make setup

echo "Activating the virtual environment..."
source $PWD/.venv/Scripts/activate

echo "Setting up the test files folder..."
export SCAN_FOLDERS="$PWD/testfiles/Images;$PWD/testfiles/Music"
export OUTPUT_FOLDER="$PWD"