#! /usr/bin/python3.6
# -*- encoding:utf-8 -*-

import os

def main():
    filename = os.path.join(os.path.dirname(__file__), 'temp_data.dat')
    with open(filename, 'w'): pass


main()    
