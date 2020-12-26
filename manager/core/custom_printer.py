from colorama import init, Fore
from termcolor import colored

init(autoreset=True, convert=True)


def print_ok(msg: str):
    print(colored(msg, 'green'))


def print_error(msg: str):
    print(colored(msg, 'red'))


def print_debug(msg: str):
    print(colored(msg, 'cyan'))


def print_warning(msg: str):
    print(colored(msg, 'yellow'))
