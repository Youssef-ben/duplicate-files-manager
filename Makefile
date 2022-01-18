.PHONEY: pack clean

setup: clean-env clean ## Clean the virtual env if exists and setup a new one.
	@echo "Installing python virtual environment...."
	@py -m venv .venv --clear --upgrade-deps > /dev/null

	@echo "export PYTHONPATH=$$PWD" >> $(PWD)/.venv/Scripts/activate
	@echo "pip install -r requirements.txt > /dev/null" >> $(PWD)/.venv/Scripts/activate

install: ## Install requirements
	@echo "Installing the requirements..."
	@pip install -r requirements.txt 

pack: ## Create a distibution package.
	@python setup.py clean sdist

clean: ## Clean the {__pycache__} and the {dist, build and *.egg-info} folders.
	@echo "Cleaning the python cache folders..."
	@find . ! -path "./.venv/*" | grep -E "(__pycache__|.pytest_cache)" | xargs rm -rf

	@echo "Cleaning the distribution folders...."
	@find . ! -path "./.venv/*" | grep -E "(dist|build|*.egg-info|output)" | xargs rm -rf

clean-env: ## Remove the .venv folder.
	@echo "Cleaning the virtual environment..."
	@rm -rf .venv

find-dup: ## Find duplicates in the given folder.
	@py scripts/dev/find_duplicates.py $(PATHS)

cmp-folders: ## Compare two folder for duplicates
	@py scripts/dev/compare_folders.py $(PATHS)
	

help: ## Shows the Current Makefile Commands.
	@echo ''
	@echo '======================================= [BASE COMMANDS] ========================================'
	@grep -E '^[a-zA-Z_-]+:.*$$' ./Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo '================================================================================================'