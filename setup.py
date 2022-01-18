"""
Duplicate files manager (dfm) setup file.
"""
from setuptools import find_packages
from setuptools import setup

setup(
    name='duplicate-files-manager',
    version='1.0.0',
    description='Utilities library for finding and handling duplicate files.',
    platforms="OS Independent",

    author='Youssef-Ben',
    license='MIT',

    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: MIT",
        "Operating System :: OS Independent",
    ],

    # Defining the modules source code folder and setting up an alias for the library.
    # This will allow to import the code as follow:
    # from filesmanager import <module_name>
    package_dir={
        'dfm': 'manager'
    },

    # This allow to group the modules under one folder.
    packages=[f'dfm.{mod}' for mod in find_packages('manager')],

    setup_requires=[
        'termcolor',
        'colorama'
    ],
)
