#! /usr/bin/python3.6
# -*- encoding:utf-8 -*-
import pickle
import random
import os
import sys
import pdb

GAME_BOARD = 0
TRY_COUNT = 1

class GameState():

    def __init__(self):
        self.current_board = []
        try:
            filename = os.path.join(os.path.dirname(__file__), 'temp_data.dat')
            with open(filename, 'rb') as fl:
                self.current_board = pickle.load(fl)
        except EOFError:
                self.current_board = [[[None, None, None], [None, None, None], [None, None, None]],0]

    
    def update_board(self, x, y, s):
        self.current_board[GAME_BOARD][x][y] = s
    

    def check_tries(self):
        if self.current_board[TRY_COUNT] != 7:
            self.current_board[TRY_COUNT] += 1
            return True
        else:
            filename = os.path.join(os.path.dirname(__file__), 'temp_data.dat')
            with open(filename,'w'):pass
            return False

    def get_coords(self):
        cell_coords = []
        for row_index, row_items in enumerate(self.current_board[GAME_BOARD]):
            for col_index, col_item in enumerate(row_items):
                if col_item is None:
                    cell_coords.append([row_index, col_index])
        rand_number = random.randrange(len(cell_coords))
        return {'x':cell_coords[rand_number][0], 'y':cell_coords[rand_number][1]}


    def save_changes(self):
        filename = os.path.join(os.path.dirname(__file__), 'temp_data.dat')
        with open(filename, 'wb') as fl:
            pickle.dump(self.current_board, fl)


def run(in_coords):
#    sys.stdin = open('/dev/tty')
#    pdb.set_trace()
    g = GameState()
    g.update_board(in_coords['x'], in_coords['y'], 'x')
    out_coords = g.get_coords()
    g.update_board(out_coords['x'], out_coords['y'], 'o')
    g.save_changes()
    return out_coords


