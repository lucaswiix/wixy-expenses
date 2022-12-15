import {Navio} from 'rn-navio';

import {Playground} from './playground';
import {Settings} from './settings';
import {Expenses} from './expenses';
import {Main} from './main';

import {useAppearance} from '../utils/hooks';
import {screenDefaultOptions, tabDefaultOptions, getTabBarIcon} from '../utils/designSystem';

// NAVIO
export const navio = Navio.build({
  screens: {
    Expenses,
    Settings,
    Playground: {
      component: Playground,
      options: () => ({
        title: 'Playground',
      }),
    },
  },
  stacks: {
    MainStack: ['Expenses'],
    ExampleStack: ['Expenses'],
  },
  tabs: {
    MainTab: {
      stack: 'MainStack',
      options: {
        title: 'Expenses',
        tabBarIcon: getTabBarIcon('MainTab'),
      },
    },
    SettingsTab: {
      stack: ['Settings'],
      options: () => ({
        title: 'Settings',
        tabBarIcon: getTabBarIcon('SettingsTab'),
      }),
    },
  },
  root: 'Tabs',
  hooks: [useAppearance],
  options: {
    stack: screenDefaultOptions,
    tab: tabDefaultOptions,
  },
});

export const getNavio = () => navio;
export const AppRoot = navio.Root;
