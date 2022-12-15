import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput} from 'react-native';
import {
  Constants,
  Colors,
  Spacings,
  Keyboard,
  View,
  Text,
  Button,
  Icon,
} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';
import { EvilIcons } from '@expo/vector-icons';
import {services, useServices} from '../services';
import {useAppearance} from '../utils/hooks';
import {useStores} from '../stores';
import { isNull } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeekExpense } from '../stores/weekexpense';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderButton } from '../components/button';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Section } from '../components/section';

export type Props = {
  today?: 'montoday' | 'tuestoday' | 'wednestoday' | 'thurstoday' | 'fritoday' | 'saturtoday' | 'suntoday';
};


export const Expenses: NavioScreen<Props> = observer(({today = 'error'}) => {
  const navigation = useNavigation();
  const [trackInteractive, setTrackInteractive] = useState(true);
  const {weekExpenses} = useStores();
  const {t} = useServices();

  const [price, setPrice] = useState("");

  const isUpdated = weekExpenses?.expenses?.today && weekExpenses.expenses.today.length > 0 ;


  const addExpense = async (): Promise<void> => {
    let num = parseFloat(price.replace(",", "."))
    if(isNaN(num) || isNull(num)){
      Alert.alert("Valor não valido ou vazio")
      setPrice("")
      return
    }
    weekExpenses.addExpense(num);
    await storeData(weekExpenses)
    setPrice("")
    
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View row>
          {isUpdated ? <HeaderButton onPress={RemoveLastExpense} label="Undo" /> : ""}

          <HeaderButton onPress={showConfirmRestoreDialog} label={t.do('expense.restore')} /> 


          <HeaderButton onPress={showConfirmFlushDialog} label={t.do('expense.flush')} /> 
          
        </View>
      )
         
    });

  
  const getData = async () => {
      const jsonValue = await AsyncStorage.getItem('@expenses')
       const value = jsonValue != null ? JSON.parse(jsonValue) : null;
       if (value) {
        console.log("Return stored value", value)
        weekExpenses.set("expenses", value)
       }
  }

  getData().catch(console.error);;
  }, [])
 
  const RestoreStorage = async() => {
    const jsonValue = await AsyncStorage.getItem('@expenses')
    const value = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (value) {
      console.log("Restore stored object", value)
      weekExpenses.set("expenses", value)
    }


}

  const showConfirmRestoreDialog = () => {
    return Alert.alert(
      t.do('expense.confirmRestoreDialog.title'),
      t.do('expense.confirmRestoreDialog.description'),
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: async () => {
            await RestoreStorage();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  }

  const showConfirmFlushDialog = () => {
    return Alert.alert(
      t.do('expense.confirmFlushDialog.title'),
      t.do('expense.confirmFlushDialog.description'),
      [
        // The "Yes" button
        {
          text:  t.do('expense.yes'),
          onPress: async () => {
            await FlushCache();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: t.do('expense.no'),
        },
      ]
    );
  };


  const FlushCache = async () => {
      await AsyncStorage.clear()
      ResetToday()

  }

  const storeData = async (value: WeekExpense) => {
    try {
      const jsonValue = JSON.stringify(value.expenses)
      await AsyncStorage.setItem('@expenses', jsonValue)
    } catch (e) {
      Alert.alert("error on trying storage")
    }
  }
  
  const RemoveLastExpense= () => {
    weekExpenses.removeLastExpense()
  }

  const ResetToday = () => {
    weekExpenses.set("expenses", {...weekExpenses.expenses, today: [0]})
  }

  const renderSum = () => {
    if (weekExpenses?.expenses?.today && weekExpenses?.expenses?.today.length > 0) {
      const sum = weekExpenses.expenses.today.reduce((agg, curr) => agg+curr)
      const rest = (weekExpenses.expenses.limit - (sum || 0)).toFixed(2)
      return (
        <Text color={Colors.red20}>R$ {sum.toFixed(2).replace(".", ",")} ({rest.replace(".", ",")})</Text>
      )
    } 
    return (
      <Text color={Colors.red20}>R$ 0,00</Text>

    )
  }

  return (
    <View flex bg-bgColor>
      <View flex>
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode={'interactive'}
        showsVerticalScrollIndicator={false}
      >
       <View paddingV-s1 marginB-30>
        {(weekExpenses?.expenses?.today && weekExpenses.expenses.today.length > 0) && (
          weekExpenses.expenses.today.slice().reverse().map((item, index) => {
            return (!isNaN(item) && !isNull(item)) && item > 0 && (
              <View key={index} style={styles.listItem} row br20
              marginB-s2
              padding-s2>
                <Text>R$ {item.toFixed(2).replace(".", ",")} </Text>

              </View>
              )
          })
        )

        }
        </View>
      </ScrollView>
      <Text>a</Text>
      </View>
      <KeyboardAvoidingView style={styles.trackingToolbarContainer} behavior="padding">
        <View bg-bg2Color row spread centerV paddingH-s5 paddingV-s3>
        {renderSum()}
        </View>
        <View bg-bgColor row spread centerV paddingH-s5 paddingV-s3>
          <TextInput
            keyboardType="numeric"
            style={styles.textField}
            placeholder={t.do('expense.price')}

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
  title: `${(props?.route?.params as Props)?.today ? services.t.do(`section.week.todays.${(props?.route?.params as Props)?.today}`) : services.t.do('expense.title')}`,
});

const styles = StyleSheet.create({
  listItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    backgroundColor: Colors.grey20,
    justifyContent: "space-between",
    display: "flex"
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
    color: Colors.textColor,
    backgroundColor: Colors.bg2Color,
    paddingVertical: Spacings.s3,
    paddingHorizontal: Spacings.s4,
    borderRadius: 8,
  },
});
