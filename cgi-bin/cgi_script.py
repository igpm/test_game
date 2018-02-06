#! /usr/bin/python3.6
# -*- encoding:utf-8 -*-

import sys, json
import step_processing
import cgitb
#cgitb.enable()

def run():
    in_data = json.loads(sys.stdin.readline())
    out_data = step_processing.run(in_data)
    print("Content-Type: application/json")
    print("Cache-Control: no-cache")
    print()
    print(json.JSONEncoder().encode(out_data))

run()
