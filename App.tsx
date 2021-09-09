/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  TouchableHighlight,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const MIMEKey = 'mimeKey';
const DataKey = 'dataKey';

const App: () => Node = () => {
  const [imageMime, setImageMime] = useState('');
  const [imageData, setImageData] = useState('');

  const readFromStorage = async () => {
    const mimeValue = await AsyncStorage.getItem(MIMEKey);
    if (mimeValue !== null) {
      // value previously stored
      setImageMime(mimeValue);
    }

    const dataValue = await AsyncStorage.getItem(DataKey);
    if (dataValue !== null) {
      // value previously stored
      setImageData(dataValue);
    }
  };

  useEffect(() => {
    readFromStorage();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const darkModeStyle = {
    color: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const backgroundStyleInverse = {
    backgroundColor: isDarkMode ? Colors.lighter : Colors.darker,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <ImageBackground
          source={{uri: `data:${imageMime};base64,${imageData}`}}
          resizeMode="contain"
          style={[styles.backgroundImage, backgroundStyle]}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              ImagePicker.openPicker({
                multiple: true,
                includeBase64: true,
              }).then(images => {
                if (images && images.length > 0) {
                  setImageMime(images[0].mime);
                  AsyncStorage.setItem(MIMEKey, images[0].mime);
                  setImageData(images[0].data);
                  AsyncStorage.setItem(DataKey, images[0].data);
                }
              });
            }}>
            <Text style={styles.buttonText}>Select</Text>
          </TouchableHighlight>
          {imageData.length === 0 && (
            <Text
              style={[
                styles.instructionText,
                backgroundStyleInverse,
                darkModeStyle,
              ]}>
              Select your proof of vaccination image
            </Text>
          )}
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  instructionText: {padding: 4},
  buttonText: {color: '#fff', alignSelf: 'center'},
  button: {
    width: 100,
    alignContent: 'center',
    backgroundColor: '#aaa',
    borderColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
    padding: 4,
  },
  backgroundImage: {width: '100%', height: '100%'},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
