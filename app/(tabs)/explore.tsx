import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, Button, View, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter,useSegments } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';



export default function Explore() {
  const router = useRouter();
  const segments = useSegments();
  const devices = useSelector((state: RootState) => state.devices);
  const [formVisibility, setFormVisibility] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const SignupSchema = Yup.object().shape({
    taskName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
  });
  const displayForm = () => {
    setFormVisibility(!formVisibility);
    console.log(devices);
    
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
      selection={<ThemedText type="subtitle" style={{ padding: 15 }}>Explore</ThemedText>}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.titleContainer}>
          <View style={styles.feature}>
            <View style={styles.textContainer}>
              <TouchableOpacity style={[styles.exploreButton, { backgroundColor }]} onPress={displayForm}>
                <>
                  <Ionicons name="calendar" size={24} color="#007bff" style={styles.icon} />
                  <ThemedText type="subtitle">Planification des Tâches</ThemedText>
                </>
                <Ionicons name="add-circle" size={32} color={theme === 'light' ? Colors.light.text : Colors.dark.text} />
              </TouchableOpacity>
              <ThemedText style={{ padding: 25 }}>Programmez des actions spécifiques pour les appareils, comme allumer les lumières à des moments précis.</ThemedText>
            </View>
          </View>
          {
            formVisibility ?
            <View>
              <Formik
                initialValues={{ taskName: '', email: '', password: '' }}
                validationSchema={SignupSchema}
                onSubmit={values => {
                  console.log(values);
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
                    <TextInput
                      style={[styles.input, {color: textColor, borderColor: textColor}]}
                      placeholder="Task name"
                      onChangeText={handleChange('taskName')}
                      onBlur={handleBlur('taskName')}
                      value={values.taskName}
                    />
                    {errors.taskName && touched.taskName ? (
                      <ThemedText style={styles.error}>{errors.taskName}</ThemedText>
                    ) : null}

                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                    />
                    {errors.email && touched.email ? (
                      <ThemedText style={styles.error}>{errors.email}</ThemedText>
                    ) : null}

                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                    />
                    {errors.password && touched.password ? (
                      <ThemedText>{errors.password}</ThemedText>
                    ) : null}

                    <Button onPress={() => handleSubmit()} title="Submit" />
                  </View>
                )}
              </Formik>
            </View> : 
            null
          }
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  exploreButton: {
    width: 'auto',
    alignItems: 'center',
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginRight: -40,
  },
  textContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  error: {
    marginBottom: 10,
    marginLeft: 15
  },
});
