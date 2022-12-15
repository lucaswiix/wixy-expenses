import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Text, View, SegmentedControl, Colors, Spacings} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {Section} from '../components/section';
import {Row} from '../components/row';
import {
  appearances,
  appearancesUI,
  appearanceUIToInternal,
  languages,
  languagesUI,
  languageUIToInternal,
} from '../utils/types/enums';
import {useAppearance} from '../utils/hooks';
import {useStores} from '../stores';
import {HeaderButton} from '../components/button';
import {services, useServices} from '../services';

export const Settings: NavioScreen = observer(({}) => {
  useAppearance();
  const {ui, weekExpenses} = useStores();

  const [limit, setLimit] = useState(weekExpenses?.expenses?.limit ? weekExpenses?.expenses?.limit.toString().replace(".", ",") : "0,00")
  const navigation = useNavigation();
  const {t} = useServices();


  // State
  const [appearance, setAppearance] = useState(ui.appearance);
  const [language, setLanguage] = useState(ui.language);

  // Computed
  const unsavedChanges = ui.appearance !== appearance || ui.language !== language;

  const appearanceInitialIndex = appearances.findIndex(it => it === appearance);
  const appearanceSegments = appearancesUI.map(it => ({label: it}));

  const languageInitialIndex = languages.findIndex(it => it === language);
  const languageSegments = languagesUI.map(it => ({label: it}));

  // Start
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        unsavedChanges ? <HeaderButton onPress={handleSave} label={t.do('settings.save')} /> : null,
    });
  }, [unsavedChanges, appearance, language]);

  // Methods
  const handleAppearanceIndexChange = (index: number) =>
    setAppearance(appearanceUIToInternal[appearancesUI[index]]);
  const handleLanguageIndexChange = (index: number) =>
    setLanguage(languageUIToInternal[languagesUI[index]]);

  const handleSave = () => {
    ui.setMany({
      appearance,
      language,
    });
  };

  const SubmitLimit = () => {
    let price = limit.replace(",", ".")
    weekExpenses.set("expenses", {...weekExpenses.expenses, limit: parseFloat(price) })
  }
  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <Section title={t.do('settings.limits')} >
        <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  {t.do('settings.dailyLimit')}
                </Text>
              </View><Text textColor>R$ </Text>
              <TextInput
               keyboardType="numeric"
              style={styles.textField}
              value={limit}
              onChangeText={(value: string) => setLimit(value)}
              />
              <TouchableOpacity onPress={() => SubmitLimit()} disabled={weekExpenses.expenses.limit == parseFloat(limit.replace(",", "."))}>
                <Text style={{color: weekExpenses.expenses.limit == parseFloat(limit.replace(",", ".")) ? Colors.black : Colors.primary, marginLeft: 10}}>{t.do('settings.save')}</Text>
              </TouchableOpacity>
            
            </Row>

          </View>
        </Section>
        <Section title={'UI'}>
          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Appearance
                </Text>
              </View>

              <SegmentedControl
                initialIndex={appearanceInitialIndex}
                segments={appearanceSegments}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
                onChangeIndex={handleAppearanceIndexChange}
              />
            </Row>
          </View>

          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Language
                </Text>
              </View>

              <SegmentedControl
                initialIndex={languageInitialIndex}
                segments={languageSegments}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
                onChangeIndex={handleLanguageIndexChange}
              />
            </Row>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
});
Settings.options = () => ({
  title: services.t.do('settings.title'),
});


const styles = StyleSheet.create({
  button: {
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.primary,
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