import React, { useState, useContext, useRef, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput, ScrollView, Keyboard,  } from "react-native";
import { Button, Dialog, TouchableRipple, Subheading, Text, Portal, RadioButton, Caption, ActivityIndicator, Appbar, Snackbar, FAB} from "react-native-paper";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { HideWithKeyboard } from "react-native-hide-with-keyboard";
import PhoneInput from 'react-native-smooth-phone-input';

import CountryPicker from 'react-native-country-picker-modal'
import ErrorMessage from "../components/ErrorMessage";
import { Subheader } from "react-native-paper/lib/typescript/src/components/List/List";
import { store } from "../context/store";
import Axios from "axios";
import { API } from "../constants";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label("Nombre Completo")
    .required("Por favor ingresa el nombre del cliente"),
  phone: Yup.string()
    .label("Teléfono")
    .required()
    .min(6, "El teléfono debe tener al menos 6 caracteres")
});

interface EditProps {
  navigation: Object,
}

const EditClient = ({ navigation }: EditProps) => {
  const phoneRef = useRef(null);

  const globalState = useContext(store);

  const { dispatch, state: { metaData } } = globalState;
  const [clientData, setClient] = useState({})
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCityDialog, setVisibleCityDialog] = useState(false)
  const [citySelected, setCity] = useState({})
  const [visibleSubsidiaryDialog, setVisibleSubsidiaryDialog] = useState(false)
  const [subsidiarySelected, setSubsidiary] = useState({})
  const [countryCode, setCountryCode] = useState('PA')


  useEffect(() => {
    setData();
  }, [])

  const setData = () => {
    const client = navigation.getParam('client');
    setCity(client.city)
    setClient(client)
    setSubsidiary(client.subsidiary)
    console.log(client);

  }

  async function handleCreateClients(values, actions) {
    const { name, phone } = values;
    setIsLoading(true);
    setShowSuccess(false);
    const data = {
      id: clientData.id,
      name,
      phone: phoneRef.current.getInternationalFormatted(),
      city_id: citySelected.id,
      subsidiary_id: subsidiarySelected.id
    }
    console.log(data);
    console.log(clientData.id);

    try {
      const response = await Axios.put(`${API}/clients/${clientData.id}`, data);
      setShowSuccess(true);
      setIsLoading(false);

    } catch (error) {
      console.log(error.response);
      setIsLoading(false);
      setShowSuccess(false);
 
    }
  }
  async function handleDelete() {
    setShowDeleteDialog(false);
    setIsLoading(true);
    setShowSuccess(false);

    try {
      const response = await Axios.delete(`${API}/clients/${clientData.id}`);
      setShowSuccess(true);
      navigation.navigate('App')
      setIsLoading(false);

    } catch (error) {
      console.log(error.response);
      setIsLoading(false);
      setShowSuccess(false);
 
    }
  }
  
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)

  }

  return (
    <Portal>
      <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate('App')} />
        <Appbar.Content title="Editar Cliente" />
      </Appbar.Header>
    
        <View style={{ 
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 20,
              top: 120,
              zIndex: 9999
        }}>
          <FAB
            icon="trash-can-outline"
            style={{ margin: 8, backgroundColor: '#e91e63'}}
            onPress={() => setShowDeleteDialog(true)}
            visible
          />

        </View>
      <View style={styles.container}>
        <Portal>
        
          <Dialog onDismiss={() => setVisibleCityDialog(false)} visible={visibleCityDialog}>
            <Dialog.Title>Selecciona una opcion</Dialog.Title>
            <Dialog.ScrollArea style={{ maxHeight: 400, paddingHorizontal: 0 }}>
              <ScrollView>
                {metaData.cities.map(val => (
                  <View key={val.id.toString()} >
                    <TouchableRipple
                      onPress={() => {
                        setVisibleCityDialog(false);
                        setCity(val)
                      }}
                    >
                      <View style={styles.row}>
                        <View pointerEvents="none">
                          <RadioButton
                            status={citySelected.id && citySelected.id === val.id  ? 'checked' : 'unchecked'}
                          />
                        </View>
                        <Subheading style={styles.text}>{val.name}</Subheading>
                      </View>
                    </TouchableRipple>

                  </View>

                ))}
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
          <Dialog onDismiss={() => setVisibleSubsidiaryDialog(false)} visible={visibleSubsidiaryDialog}>
            <Dialog.Title>Selecciona una opcion</Dialog.Title>
            <Dialog.ScrollArea style={{ maxHeight: 400, paddingHorizontal: 0 }}>
              <ScrollView>
                {metaData.subsidiaries.map(val => (
                  <View key={val.id.toString()} >
                    <TouchableRipple
                      onPress={() => {
                        setVisibleSubsidiaryDialog(false);
                        setSubsidiary(val)
                      }}
                    >
                      <View style={styles.row}>
                        <View pointerEvents="none">
                          <RadioButton
                            status={subsidiarySelected.id && subsidiarySelected.id === val.id  ? 'checked' : 'unchecked'}
                          />
                        </View>
                        <Subheading style={styles.text}>{val.name}</Subheading>
                      </View>
                    </TouchableRipple>

                  </View>

                ))}
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
        
        
          <Dialog onDismiss={() => setShowDeleteDialog(false)} visible={showDeleteDialog}>
            <Dialog.Title  >ATENCIÓN</Dialog.Title>
            <Dialog.Content><Text>¿Está seguro de eliminar "{clientData.name}"?</Text></Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => console.log("Cancel")}>Cancelar</Button>
              <Button onPress={() => handleDelete()}>Sí, estoy seguro</Button>
            </Dialog.Actions>
          </Dialog>
        
        
          
        </Portal>

        <Snackbar
    
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            },
          }}
        >
          Cliente editado satisfactoriamente!
        </Snackbar>


        <HideWithKeyboard style={styles.logoContainer}>
          <FontAwesome name="user-secret" size={100} color="#BABABA" />

        </HideWithKeyboard>
        <View style={{ marginHorizontal: 20 }}>
          <Formik
            initialValues={clientData}
            onSubmit={(values, actions) => {
              handleCreateClients(values, actions);
            }}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              touched,
              handleBlur,
              isSubmitting
            }) => (
              <>
                <TextInput
                  name="name"
                  onSubmitEditing={() => phoneRef.current.focus()}
                  returnKeyType='next'
                  mode='outlined'
                  value={values.name}
                  onChangeText={handleChange("name")}
                  placeholder="Nombre Completo"
                  autoCapitalize="none"
                  iconName="ios-mail"
                  iconColor="#2C384A"
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  
                  onBlur={handleBlur("name")}
                />
                <ErrorMessage errorValue={touched.name && errors.name} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* <CountryPicker
                  
                    countryCode={countryCode}
                    withFilter
                    withFlag
                    withCallingCode
                    withAlphaFilter
                    withEmoji

                    visible={visibleCountryCodeDialog}
                  /> */}
                  <PhoneInput
                    ref={phoneRef}
                    style={[styles.input, { flex: 1 }, touched.phone && errors.phone && styles.inputError]}
                    // onPressFlag={this.onPressFlag}
                    initialCountry={countryCode.toLowerCase()}
                    autoFormat
                    textProps={{
                      placeholder: 'Número de teléfono',
                      keyboardType: 'phone-pad',
                      textContentType: 'telephoneNumber',
                    }}
                    onChangePhoneNumber={handleChange("phone")}
                    value={values.phone}
                  >
                    {countryCode}
                  </PhoneInput>
                  {/* <TextInput
                    style={{ flex: 1, zIndex: 1 }}
                    mode='outlined'
                    name="phone"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    placeholder="Numero de teléfono"
                    iconName="ios-lock"
                    iconColor="#2C384A"
                    onBlur={handleBlur("phone")}
                    error={touched.phone && errors.phone}
                  
                  /> */}

                </View>
                {/* <FormInput
                  name="password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  placeholder="Enter password"
                  secureTextEntry={passwordVisibility}
                  iconName="ios-lock"
                  iconColor="#2C384A"
                  onBlur={handleBlur("password")}
                  rightIcon={
                    <TouchableOpacity onPress={handlePasswordVisibility}>
                      <Ionicons name={rightIcon} size={28} color="grey" />
                    </TouchableOpacity>
                  }
                /> */}
                <ErrorMessage errorValue={touched.phone && errors.phone} />


                <TouchableRipple
                  style={[styles.input, { justifyContent: 'center'}]}
                  onPress={() => { 
                    Keyboard.dismiss();
                    setVisibleCityDialog(true)
                  }}
                >
                  {citySelected.id ? (
                    <Text>{citySelected.name}</Text>
                  ) : (
                    <Caption>Selecciona la ciudad</Caption>

                  )}
                </TouchableRipple>
                <TouchableRipple
                  style={[styles.input, { justifyContent: 'center', marginTop: 30}]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setVisibleSubsidiaryDialog(true)
                  }}
                >
                  {subsidiarySelected.id ? (
                    <Text>{subsidiarySelected.name}</Text>
                  ) : (
                    <Caption>Selecciona la sucursal</Caption>

                  )}
                </TouchableRipple>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={handleSubmit}
                    disabled={!isValid || !citySelected.id || !subsidiarySelected.id || isSubmitting}
                    mode='contained'

                  >
                    {isLoading ? <ActivityIndicator color="#FFF" /> : 'GUARDAR'}
                  </Button>
                  {/* <FormButton
                    buttonType="outline"
                    onPress={handleSubmit}
                    title="LOGIN"
                    buttonColor="#039BE5"
                    disabled={!isValid || isSubmitting}
                    loading={isSubmitting}
                  /> */}
                </View>
                <ErrorMessage errorValue={errors.general} />
              </>
            )}
          </Formik>


        </View>
      </View>
    
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: "center"
  },
  buttonContainer: {
    marginVertical: 25
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 1,
  },
  inputError: {


    borderColor: '#A53939',
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default EditClient
