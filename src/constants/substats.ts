import { Substat } from '@/types';

const substats: {
    [key: string]: Substat;
} = {
    'percent-hp': {
        'parse': ['hp', '%'],
        'canonical': 'HP',
        'base': 3.456000052392483,
        'step': 0.43200000654906034,
        'precision': 1,
        'weight': 1,
    },
    'percent-atk': {
        'parse': ['atk', '%'],
        'canonical': 'ATK',
        'base': 3.456000052392483,
        'step': 0.43200000654906034,
        'precision': 1,
        'weight': 1,
    },
    'percent-def': {
        'parse': ['def', '%'],
        'canonical': 'DEF',
        'base': 4.3199999956414104,
        'step': 0.5399999907240272,
        'precision': 1,
        'weight': 1,
    },
    'flat-hp': {
        'parse': ['hp'],
        'canonical': 'HP',
        'base': 33.870039001107216,
        'step': 4.23375500086695,
        'precision': 0,
        'weight': 0.5,
    },
    'flat-atk': {
        'parse': ['atk'],
        'canonical': 'ATK',
        'base': 16.935019000666216,
        'step': 2.1168770007789135,
        'precision': 0,
        'weight': 0.5,
    },
    'flat-def': {
        'parse': ['def'],
        'canonical': 'DEF',
        'base': 16.935019000666216,
        'step': 2.1168770007789135,
        'precision': 0,
        'weight': 0.5,
    },
    'speed': {
        'parse': ['spd'],
        'canonical': 'Speed',
        'base': 2,
        'step': 0.3000000002793968,
        'precision': 0,
        'weight': 1,
    },
    'effect-hit-rate': {
        'parse': ['hit'],
        'canonical': 'Effect Hit Rate',
        'base': 3.456000052392483,
        'step': 0.43200000654906034,
        'precision': 1,
        'weight': 1,
    },
    'effect-res': {
        'parse': ['res'],
        'canonical': 'Effect RES',
        'base': 3.456000052392483,
        'step': 0.43200000654906034,
        'precision': 1,
        'weight': 1,
    },
    'break-effect': {
        'parse': ['break'],
        'canonical': 'Break Effect',
        'base': 5.184000078588724,
        'step': 0.6480000447481871,
        'precision': 1,
        'weight': 1,
    },
    'crit-rate': {
        'parse': ['rate'],
        'canonical': 'Crit Rate',
        'base': 2.592000039294362,
        'step': 0.32400002237409353,
        'precision': 1,
        'weight': 1,
    },
    'crit-damage': {
        'parse': ['mg'],
        'canonical': 'Crit DMG',
        'base': 5.184000078588724,
        'step': 0.6480000447481871,
        'precision': 1,
        'weight': 1,
    },
};

export default substats;