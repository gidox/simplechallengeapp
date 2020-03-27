import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar } from "react-native";
import axios from 'axios';
import _ from 'lodash';
import { withFirebaseHOC } from "../config/Firebase";
import HomeButton from "../components/HomeButton";
import { Ionicons } from '@expo/vector-icons';
import { API } from "../constants";
import { List, Avatar, Chip, Portal, FAB, ActivityIndicator, Title, Caption } from "react-native-paper";
import { Divider } from "react-native-elements";

interface ClientsProps {
  navigation: Object,
  firebase: Object,
}


const Clients = ({ navigation, firebase }: ClientsProps) => {
  const [openFAB, setOpenFab] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  
  useEffect(() => {
    getClientsData();
  }, []);

  const getClientsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/clients`);
      console.log(response.data);
      setLoading(false);
      setClients(response.data);

    } catch (error) {
      setLoading(false);

      console.log(error)
    }
  }
  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar barStyle='dark-content' />

        <ActivityIndicator size="large" />
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      <View style={{ marginHorizontal: 10, marginTop: 20 }}>
        <Title>Clientes</Title>

      </View>
      <ScrollView style={[styles.container, { backgroundColor: '#F6F6F6', marginHorizontal: 10 }]}>
        <List.Section>
            {!_.isEmpty(clients) && clients.map((val, i) => (

              <View key={val.id.toString()}> 
                <List.Item
                  onPress={() => navigation.navigate('EditClient', { client: val })}
                 
                  left={() => (
                    <Avatar.Text label={val.name.substring(0,1)} size={54} />
                  )}
                  right={props => <List.Icon type="MaterialIcons" icon="chevron-right" />}
                  title={val.name}
                  description={({
                    ellipsizeMode,
                    color: descriptionColor,
                    fontSize,
                  }) => (
                    <View style={[styles.container, styles.column]}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode={ellipsizeMode}
                        style={{ color: descriptionColor, fontSize }}
                      >
                        <Ionicons name="ios-phone-portrait" /> 
                        {` ${val.phone}`}
                      </Text>
                      <View style={[styles.container, styles.rowChip, { paddingTop: 8 }]}>
                        <Chip icon="home-map-marker" style={{ marginHorizontal: 3 }} onPress={() => {}}>
                          {val.subsidiary.name}
                        </Chip>
                        <Chip icon="map-marker" style={{ marginHorizontal: 3 }} onPress={() => {}}>
                          {val.city.name}
                        </Chip>
                      </View>
                    </View>
                  )}
                />
                <Divider />

              </View>
             

            ))}

            {_.isEmpty(clients) && (
              <Caption>No hay clientes</Caption>
            )}

        </List.Section>


      </ScrollView>
      <Portal>
        <FAB.Group
          open={openFAB}
          icon={openFAB ? 'calendar-today' : 'plus'}
          actions={[
            { icon: 'plus', label: 'Agregar Cliente', onPress: () => { navigation.navigate('AddClient')} },

          ]}
          onStateChange={({ open }: { open: boolean }) =>
            setOpenFab(open)
          }
          onPress={() => {
            if (openFAB) {
              // do something if the speed dial is open
            }
          }}
          visible
        />
        </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 50,
    // justifyContent: "space-between",
    alignItems: "center"
  },
  rowChip: {
    flexDirection: 'row',
  },
  col: {
    flex: 5, 
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
});

export default withFirebaseHOC(Clients);
