.PHONEY: pack clean

setup: clean-env clean ## Clean the virtual env is exists and setup a new one.
	@echo "Installing python virtual environment...."
	@py -m venv .venv --clear --upgrade-deps > /dev/null

	@echo "export PYTHONPATH=$$PWD" >> $(PWD)/.venv/Scripts/activate
	@echo "pip install -r requirements.txt > /dev/null" >> $(PWD)/.venv/Scripts/activate

install: 
	@echo "Installing the requirements..."
	@pip install -r requirements.txt 

pack:
	@python setup.py clean sdist

clean: ## Clean the {__pycache__} and the {dist, build and *.egg-info} folders.
	@echo "Cleaning the python cache folders..."
	@find . ! -path "./.venv/*" | grep -E "(__pycache__|.pytest_cache)" | xargs rm -rf

	@echo "Cleaning the distribution folders...."
	@find . ! -path "./.venv/*" | grep -E "(dist|build|*.egg-info|output)" | xargs rm -rf

clean-env:
	@echo "Cleaning the virtual environment..."
	@rm -rf .venv

find-dup:
	@py scripts/dev/find_duplicates.py
	