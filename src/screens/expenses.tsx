import React, {useEffect, useState} from 'react';
import {FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput} from 'react-native';
import {
  Constants,
  Colors,
  Spacings,
  Keyboard,
  View,
  Text,
  TextField,
  Button,
  ListItem,
} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {services, useServices} from '../services';
import {useAppearance} from '../utils/hooks';
import {useStores} from '../stores';
import { isNull } from 'lodash';
import { number } from 'yup';

export type Props = {
  day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
};

const KeyboardTrackingView = Keyboard.KeyboardTrackingView;

export const Expenses: NavioScreen<Props> = observer(({day = 'error'}) => {
  useAppearance(); // for Dark Mode
  const navigation = useNavigation();
  const {t, navio} = useServices();
  const [trackInteractive, setTrackInteractive] = useState(true);
  const {weekExpenses} = useStores();
  const [price, setPrice] = useState("");
  const [dayExpense, setDayExpense] = useState([0]);

  const addExpense = async (): Promise<void> => {
    let num = parseFloat(price)
    if(isNull(num) || isNull(num)){
      setPrice("")
      return
    }
    weekExpenses.addExpense(num);
    setPrice("")
  };
  // Start
  useEffect(() => {
    configureUI();
    weekExpenses.set("expenses", {limit: 100, day: [0]})
    // setDayExpense(weekExpenses.expenses.week[WeekDays.indexOf(day)]);
    // console.log("weekday", weekExpenses.expenses.week)
  }, []);

  const ResetDay = () => {
    weekExpenses.set("expenses", {...weekExpenses.expenses, day: [0]})
  }

  const renderSum = () => {
    if (weekExpenses?.expenses?.day && weekExpenses?.expenses?.day.length > 0) {
      const sum = weekExpenses.expenses.day.reduce((agg, curr) => agg+curr)
      const rest = (weekExpenses.expenses.limit - sum).toFixed(2)
      return (
        <Text color={Colors.red20}>R$ {sum.toFixed(2).replace(".", ",")} ({rest.replace(".", ",")})</Text>
      )
    } 
    return (
      <Text color={Colors.red20}>R$ 0,00</Text>

    )
    
  }
  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  return (
    <View flex bg-bgColor>
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode={trackInteractive ? 'interactive' : 'none'}
        showsVerticalScrollIndicator={false}
      >
        {(weekExpenses?.expenses?.day && weekExpenses.expenses.day.length > 0) && (
          weekExpenses.expenses.day.map((item, index) => {
            return (!isNaN(item) && !isNull(item)) && item > 0 && (
              <View key={index} style={styles.listItem}>
                <Text>R$ {item.toFixed(2).replace(".", ",")} </Text>
              </View>
              )
          })
        )

        }
      </ScrollView>
      <KeyboardAvoidingView style={styles.trackingToolbarContainer} behavior="padding">
        <View bg-bgColor row spread centerV paddingH-s5 paddingV-s3>
        {renderSum()}
          <Button label="Reset" onPress={ResetDay} />
        </View>
        <View bg-bgColor row spread centerV paddingH-s5 paddingV-s3>
          <TextInput
            keyboardType="numeric"
            style={styles.textField}
            placeholder={'Price'}
            value={price}
            onChangeText={(value: any) => setPrice(value)}
          />
          <Button label="Add" marginL-s4 onPress={addExpense} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
});

Expenses.options = props => ({
  headerBackTitleStyle: false,
  title: `${(props?.route?.params as Props)?.day ? services.t.do(`section.week.days.${(props?.route?.params as Props)?.day}`) : 'Gasto Hoje'}`,
});

const styles = StyleSheet.create({
  listItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    backgroundColor: Colors.grey20,
  },
  scrollContainer: {
    paddingHorizontal: Spacings.s5,
  },
  trackingToolbarContainer: {
    position: Constants.isIOS ? 'absolute' : 'relative',
    bottom: 0,
    width: '100%',
    borderWidth: 0,
  },
  textField: {
    flex: 1,
    color: Colors.$textDefault,
    backgroundColor: Colors.bg2Color,
    paddingVertical: Spacings.s3,
    paddingHorizontal: Spacings.s4,
    borderRadius: 8,
  },
});
