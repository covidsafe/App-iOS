import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  NativeModules,
} from 'react-native';
import colors from '../assets/colors';
import {REPORT_BLE_URL} from '../utils/endpoints';

class Report extends Component {
  uploadBLE = () => {
    let seeds = [];
    this.getDeviceSeedAndRotate().then(data => {
      seeds.push(data);
      this.reportBLE(seeds);
    });
  };

  reportBLE = seeds => {
    const requestBody = {
      "seeds": seeds,
      "region": {
        "latitudePrefix": 74.12,
        "longitudePrefix": -39.12,
        "precision": 4
      }
    };

    console.log(requestBody);
    fetch(REPORT_BLE_URL, {
      method: 'PUT',
      headers: {
        'Ocp-Apim-Subscription-Key': '037bcd2a220b4f45a023e521fc129ef2',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          response.json().then(err => {
            console.log(err);
            return;
          });
        }
        return;
      })
      .catch(err => {
        console.log(err);
      });
  };

  getDeviceSeedAndRotate = () => {
    //14 days ago
    return NativeModules.BLE.getDeviceSeedAndRotate(24 * 14 * 3600).then(
      result => {
        console.log('I got: ' + JSON.stringify(result));
        return result;
      },
      error => {
        console.log('failed eth: ' + error);
      },
    );
  };

  render() {
    return (
      <SafeAreaView>
        <Image
          style={styles.reporting_logo}
          source={require('../assets/health/report_bg.png')}
        />
        <View style={styles.result_container}>
          <Text style={styles.title}>
            Positive COVID-19 diagnosis confirmed
          </Text>
          <TouchableOpacity
            style={styles.upload_trace_button}
            onPress={this.uploadBLE}>
            <Text style={styles.upload_trace_button_text}>
              Upload Trace Data
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  result_container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    lineHeight: 31,
  },
  upload_trace_button: {
    backgroundColor: colors.PURPLE_50,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  upload_trace_button_text: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
  },
});

export default Report;
