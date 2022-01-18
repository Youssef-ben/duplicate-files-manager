"""
Custom logger for the project.
"""

from colorama import init
from termcolor import colored

init(autoreset=True, convert=True)


def print_inf(msg: str):
    """Print information message.

    Args:
        msg (str): Message to be printed.
    """
    print(msg)


def print_title(msg: str):
    """Print title message with {magenta} color.

    Args:
        msg (str): Message to be printed.
    """
    print(colored(msg, 'magenta'))


def print_ok(msg: str):
    """Print ok message with {green} color.

    Args:
        msg (str): Message to be printed.
    """
    print(colored(msg, 'green'))


def print_error(msg: str):
    """Print error message with {red} color.

    Args:
        msg (str): Message to be printed.
    """
    print(colored(msg, 'red'))


def print_debug(msg: str):
    """Print debug message with {cyan} color.

    Args:
        msg (str): Message to be printed.
    """
    print(colored(msg, 'cyan'))


def print_warning(msg: str):
    """Print warning message with {yellow} color.

    Args:
        msg (str): Message to be printed.
    """
    print(colored(msg, 'yellow'))
