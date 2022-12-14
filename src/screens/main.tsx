import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {services, useServices} from '../services';
import {useStores} from '../stores';
import {Section} from '../components/section';
import {BButton, HeaderButton} from '../components/button';
import {Row} from '../components/row';
import {useAppearance} from '../utils/hooks';
import { WeekDays } from '../utils/help';
import { format } from 'date-fns';

export const Main: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const { weekExpenses} = useStores();
  const {t, navio} = useServices();

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({
      headerRight: () => (
        <Row>
          <HeaderButton label={t.do('section.week.today')} onPress={() => navio.push('Expenses', { day: format(new Date(), "EEEE").toLowerCase() })} />
        </Row>
      ),
    });
  };

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always">
        {/* <Section title="Expo">
          <Text text60R textColor>
            Session ID: {Constants.sessionId}
          </Text>
          <Text text60R textColor>
            App name: {Application.applicationName}
          </Text>
        </Section> */}

        <Section title={`Limite diário R$ ${weekExpenses.expenses.limit}`}>
          {WeekDays.map((day, index) => {
            return (
              <BButton key={index} marginV-s1 label={`${t.do(`section.week.days.${day}`)}`} onPress={() => navio.push('Expenses', { day })} />
            )
          })} 
          </Section>
        
      </ScrollView>
    </View>
  );
});
Main.options = () => ({
  title: services.t.do('home.title'),
});
