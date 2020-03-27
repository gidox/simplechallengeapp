import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimensions, ScrollView } from "react-native";
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { DataTable, Title, ActivityIndicator, Caption, Button, Portal, Dialog, Subheading, Chip, List } from "react-native-paper";
import { API } from "../constants";
import { store } from "../context/store";
import { Item } from "react-native-paper/lib/typescript/src/components/List/List";


interface HomeProps {
  navigation: Object,
}


const Home = ({ navigation }: HomeProps) => {
  const [loading, setLoading] = useState(false);
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false);
  const [subsidiaryFilters, setSubsidiaryFilter] = useState([]);
  const [cityFilters, setCityFilter] = useState([]);
  const filtersSum = cityFilters.length + subsidiaryFilters.length;
  const globalState = useContext(store);

  const { dispatch, state: { metaData } } = globalState;
  
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClientsData();
  }, []);

  const getClientsData = async () => {
    setLoading(true);
    try {
      let subsidiariesquery = '';
      let citiesquery = '';

      if (subsidiaryFilters.length > 0) {
        subsidiariesquery = _.join(
          _.flatMap(
            subsidiaryFilters,
            n => [n.id]
          ),
          ','
        )
      }
      if (cityFilters.length > 0) {
        citiesquery = _.join(
          _.flatMap(
            cityFilters,
            n => [n.id]
          ),
          ','
        )
      }
      console.log(`${API}/getClients/filtered?subsidiary=${subsidiariesquery}&city=${citiesquery}`);
      const response = await axios.get(`${API}/getClients/filtered?subsidiary=${subsidiariesquery}&city=${citiesquery}`);
      setLoading(false);
      setClients(response.data);

    } catch (error) {
      setLoading(false);

      console.log(error)
    }
  }

  const handleSubFilters = (val, index) => {
    val.ix = index;
    if (_.findIndex(subsidiaryFilters, { id: val.id }) < 0) {
      dispatch({ type: 'SET_META_ACTIVE', data: index })
      const filters = subsidiaryFilters;
      filters.push(val);
      return setSubsidiaryFilter(filters) 
    }
    let filters = subsidiaryFilters;
    filters = filters.filter(item => item.id !== val.id);
    console.log(filters)
    dispatch({ type: 'SET_META_DISABLE', data: index })
    setSubsidiaryFilter(filters)

    
  }
  const handleCityFilters = (val, index) => {
    val.ix = index;
    console.log(_.findIndex(cityFilters, { id: val.id }))
    if (_.findIndex(cityFilters, { id: val.id }) < 0) {
      console.log('SET_META_CITY_ACTIVE') 
      dispatch({ type: 'SET_META_CITY_ACTIVE', data: index })
      const filters = cityFilters;
      filters.push(val);
      return setCityFilter(filters) 
    }
    let filters = cityFilters;
    filters = filters.filter(item => item.id !== val.id);

    dispatch({ type: 'SET_META_CITY_DISABLE', data: index })
    setCityFilter(filters)

    
  }

  if (loading) {
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar barStyle='dark-content' />

      <ActivityIndicator size='large' />
    </SafeAreaView>
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <Portal>
        <Dialog
          onDismiss={() => setOpenFiltersDialog(false)}
          visible={openFiltersDialog}
          style={{ maxHeight: 0.6 * Dimensions.get('window').height }}
        >
          <Dialog.Title>Filtros</Dialog.Title>
          <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <List.Section title="Sucursal">
                <View style={styles.row}>
                  {metaData.subsidiaries.map((val, i) => (
                    <Chip key={val.id.toString()} selected={val.actived} style={{ marginVertical: 3}}  mode='outlined' onPress={() => handleSubFilters(val, i)}>{val.name}</Chip>

                  ))}

                </View>

              </List.Section>
              <List.Section title="Ciudad">
                <View style={styles.row}>
                  {metaData.cities.map((val, i) => (
                    <Chip key={val.id.toString()} selected={val.actived} style={{ marginVertical: 3}} mode='outlined' onPress={() => handleCityFilters(val, i)}>{val.name}</Chip>

                  ))}

                </View>

              </List.Section>
              
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => {
              setOpenFiltersDialog(false)
              getClientsData()  
            }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{ marginHorizontal: 10, marginTop: 20, marginBottom: 30 }}>
        <Title>Reportes</Title>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Button
            mode="outlined"
            color={'#03DAC6'}
            onPress={() => setOpenFiltersDialog(true)}
            style={{ flex: 0.5 }}
          >
            Filtros{filtersSum > 0 ? `(${filtersSum})` : '' }
          </Button>

        </View>
      </View>
      
      <View style={{ marginHorizontal: 10 }}>
        {!loading && !_.isEmpty(clients)
          ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Nombre</DataTable.Title>
                <DataTable.Title >Teléfono</DataTable.Title>
                <DataTable.Title >F.Creación</DataTable.Title>
    
    
              </DataTable.Header>
              {clients.map((val) => (
                <DataTable.Row key={val.id.toString()}>
                  <DataTable.Cell>{val.name}</DataTable.Cell>
                  <DataTable.Cell>{val.phone}</DataTable.Cell>
                  <DataTable.Cell>{moment(val.created_at).fromNow()}</DataTable.Cell>

                </DataTable.Row>
    
              ))}
    
            </DataTable>
        
            
          ) : (
            <Caption>No hay clientes</Caption>
          )
        
        }

        {loading && (
          <ActivityIndicator size="large" />
        )}
    
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  col: {
    flex: 5, 
    alignItems: 'center',
  }
});

export default Home;
