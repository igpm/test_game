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
        self.filename = os.path.join(os.path.dirname(__file__), 'temp_data.dat')
        try:
            with open(self.filename, 'rb') as fl:
                self.current_board = pickle.load(fl)
        except EOFError:
                self.current_board = [[[None, None, None], [None, None, None], [None, None, None]],0]

    
    def update_board(self, x, y, s):
        self.current_board[GAME_BOARD][x][y] = s
        self.current_board[TRY_COUNT] += 1
    

    def check_state(self ,e):
        if self.current_board[TRY_COUNT] == 9:
            with open(self.filename,'w'):pass
            return{'state':'tie', 'element':None, 'x':None, 'y':None}
        elif self.current_board[GAME_BOARD][0][0] == e and self.current_board[GAME_BOARD][0][1] == e and self.current_board[GAME_BOARD][0][2] == e:
            with open(self.filename,'w'):pass
            return{'state':'win', 'element':e, 'x':0, 'y':0}
        else:
            return{'state':'continue', 'element':None, 'x':None, 'y':None}

    def get_coords(self):
        cell_coords = []
        for row_index, row_items in enumerate(self.current_board[GAME_BOARD]):
            for col_index, col_item in enumerate(row_items):
                if col_item is None:
                    cell_coords.append([row_index, col_index])
        rand_number = random.randrange(len(cell_coords))
        return {'x':cell_coords[rand_number][0], 'y':cell_coords[rand_number][1]}


    def save_changes(self):
        with open(self.filename, 'wb') as fl:
            pickle.dump(self.current_board, fl)


def run(in_gdata):
#    sys.stdin = open('/dev/tty')
#    pdb.set_trace()
    g = GameState()
    for item in ('x', 'o'):
        if item is 'o':
            in_gdata = g.get_coords()
        g.update_board(in_gdata['x'], in_gdata['y'], item)
        out_gdata = g.check_state(item)
        if out_gdata['state'] == 'tie' or out_gdata['state'] == 'win':
            return out_gdata
    g.save_changes()
    out_gdata['x'] = in_gdata['x']
    out_gdata['y'] = in_gdata['y']
    return out_gdata


