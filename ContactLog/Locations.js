import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import colors from '../assets/colors';
import {NativeModules} from 'react-native';
import {GetStoreData} from '../utils/asyncStorage';
import {connect} from 'react-redux';
import DateConverter from '../utils/date';

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    this.getLocationData().then(locations => {
      if (locations && locations.length > 0) {
        let locationList = locations;
        if (locations.length > 5) {
          locationList = locations.slice(0, 5);
        }
        NativeModules.Locations.reverseGeoCode(locationList, addresses => {
          this.setState({
            addresses,
          });
        });
      }
    });
  }

  getLocationData = () => {
    return GetStoreData('LOCATION_DATA').then(locationArrayString => {
      let locationArray = [];
      if (locationArrayString !== null) {
        locationArray = JSON.parse(locationArrayString);
      }
      return locationArray;
    });
  };

  // fetchAddresses = () => {
  //   const locations = [
  //   {
  //     latitude: 50.934430,
  //     longitude: -102.816690,
  //     time: 1587843741483,
  //   },
  //   {
  //     latitude: 50.934430,
  //     longitude: -102.816690,
  //     time: 1587843793871,
  //   },
  //   {
  //     latitude: 50.934430,
  //     longitude: -102.816690,
  //     time: 1587843806886,
  //   },
  //   {
  //     latitude: 40.742050,
  //     longitude: -73.993851,
  //     time: 1587843813376,
  //   }];
  //
  //   NativeModules.Locations.reverseGeoCode(locations, addresses => {
  //     this.setState({
  //       addresses,
  //     });
  //   });
  // }

  render() {
    const {
      contactLogData: {date}
    } = this.props;

    return (
      <>
        <Text style={styles.date}>{DateConverter.dateString(date)}</Text>
        <Text style={styles.sub_header}>RECENT LOCATIONS</Text>
        {this.state.addresses.map((address, idx) => {
          return (
            <View style={styles.address_card} key={idx}>
              <Text>{address}</Text>
            </View>
          )
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    lineHeight: 25,
    textTransform: 'capitalize',
    color: '#333333',
    padding: 20,
  },
  sub_header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 25,
    textTransform: 'uppercase',
    color: colors.gray_icon,
    paddingHorizontal: 20,
  },
  address_card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.card_border,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 15,
  }
});

const mapStateToProps = state => {
  return {
    contactLogData: state.contactLogReducer,
  };
};

export default connect(mapStateToProps)(Locations);