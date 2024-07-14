import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Button, Keyboard, Dimensions } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';
// import TradingScreen from './screens/Trading/TradingMain'
import TryTasteScreen from './screens/TryTaste/TryTasteMain'
// import TradingLoginScreen from './screens/Trading/Login/Login'
import TryLoginScreen from './screens/TryTaste/Login/Login'
import SignUpScreen from './screens/TryTaste/SignUp';
// import BuildKitchenScreen from './screens/Trading/BuildKitchen'
import Notification from './screens/components/Notification';
import _ from 'lodash'

// import AddDishScreen from './screens/Trading/Dishes/AddDish';
import WelcomeScreen from './screens/WelcomeScreen';
import userForgotPasswordScreen from './screens/TryTaste/Login/userForgotPasswordScreen';
// import kitchenForgotPasswordScreen from './screens/Trading/Login/kitchenForgotPasswordScreen'
// import ChangePasswordScreen from './screens/Trading/Settings/ChangePasswordScreen';
import PasswordChange from './screens/TryTaste/Settings/PasswordChange';
// import CameraScreen from './screens/Trading/Dishes/CameraScreen';
import * as Network from 'expo-network';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';
import { Provider }         from "react-redux"
import store from './store'

const {width, height} = Dimensions.get('window');

firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createSwitchNavigator({

  LoadingScreen: LoadingScreen,
  WelcomeScreen: WelcomeScreen,
  LoginScreen: LoginScreen,

  // CameraScreen: CameraScreen, 
  // TradingLoginScreen: TradingLoginScreen,
  TryLoginScreen: TryLoginScreen,

  SignUpScreen: SignUpScreen,
  // BuildKitchenScreen: BuildKitchenScreen,

  // TradingScreen: TradingScreen,
  TryTasteScreen: TryTasteScreen,

  // DashboardScreen: DashboardScreen,
  // AddDishScreen: AddDishScreen,

  // ChangePasswordScreen: ChangePasswordScreen, //kitchen
  PasswordChange: PasswordChange, //user
  userForgotPasswordScreen: userForgotPasswordScreen,
  // kitchenForgotPasswordScreen: kitchenForgotPasswordScreen, 



});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class App extends React.Component {

  state = { isKeyboardOpen: false, keyboardHeight: 0, network: null}

  componentDidMount = () => {
    console.disableYellowBox = true;
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.checkInternet()
  }

  checkInternet = async () => {
    var network = await Network.getNetworkStateAsync();
    console.log("network", network)
    this.setState({ network })
  }

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (e) => {
    this.setState({ isKeyboardOpen: true, keyboardHeight: Dimensions.get('window').height - e.endCoordinates.height })
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpen: false })
  }

  render() {
    return (
    <Provider store={store}>
      <AppNavigator style={{maxHeight: this.state.isKeyboardOpen ? this.state.keyboardHeight - 50 : height}}/>
      <View style={{height: 40, display: _.get(this.state.network, 'isConnected') ? 'none' : 'flex'}} onPress={this.checkInternet}>
        <Notification
          coreStyle={{textAlign: 'center', backgroundColor: '#ffcc00', opacity: 0.7}}
          showNotification={!_.get(this.state.network, 'isConnected')}
          handleCloseNotification={() => console.log("closing notification")}
          type="Error"
          firstLine="No internect connection! Connecting..."
        />
      </View>
    </Provider>
  );
 }
};


export default App;
