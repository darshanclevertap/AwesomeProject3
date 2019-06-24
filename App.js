import React, { Component } from 'react';

import {
    Linking,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

const CleverTap = require('clevertap-react-native');

export default class App extends React.Component {

    componentDidMount() {
        CleverTap.setDebugLevel(3);
        // optional: add listeners for CleverTap Events
        CleverTap.addListener(CleverTap.CleverTapProfileDidInitialize, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapProfileDidInitialize, event); });
        CleverTap.addListener(CleverTap.CleverTapProfileSync, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapProfileSync, event); });
        CleverTap.addListener(CleverTap.CleverTapInAppNotificationDismissed, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapInAppNotificationDismissed, event); });
        CleverTap.addListener(CleverTap.CleverTapInboxDidInitialize, (event) => { this._handleCleverTapInbox(CleverTap.CleverTapInboxDidInitialize,event); });
        CleverTap.addListener(CleverTap.CleverTapInboxMessagesDidUpdate, (event) => { this._handleCleverTapInbox(CleverTap.CleverTapInboxMessagesDidUpdate,event); });
        // for iOS only: register for push notifications
        CleverTap.registerForPush();
        debugger;
        CleverTap.createNotificationChannelGroup('groupId','React Group');
        CleverTap.createNotificationChannelWithGroupId('channelID','React Channel','First React Channel',4,'groupId',true);
        CleverTap.deleteNotificationChannel('channelID');
        CleverTap.deleteNotificationChannelGroup('groupId');
        CleverTap.createNotificationChannel('channelID2','React Channel','First React Channel',3,true);
        //CleverTap.setPushToken('abcdfcm',CleverTap.FCM);
        CleverTap.initializeInbox();

        // for iOS only; record a Screen View
        //CleverTap.recordScreenView('HomeView');

        // Listener to handle incoming deep links
        Linking.addEventListener('url', this._handleOpenUrl);

        // this handles the case where a deep link launches the application
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('launch url', url);
                this._handleOpenUrl({url});
            }
        }).catch(err => console.error('launch url error', err));

        // check to see if CleverTap has a launch deep link
        // handles the case where the app is launched from a push notification containing a deep link
        CleverTap.getInitialUrl((err, url) => {
            if (url) {
                console.log('CleverTap launch url', url);
                this._handleOpenUrl({url}, 'CleverTap');
            } else if (err) {
                console.log('CleverTap launch url', err);
            }
        });
    }

    componentWillUnmount() {
        // clean up listeners
        Linking.removeEventListener('url', this._handleOpenUrl);
        CleverTap.removeListeners();
    }

    _handleOpenUrl(event, from) {
        console.log('handleOpenUrl', event.url, from);
    }

    _handleCleverTapEvent(eventName, event) {
        console.log('handleCleverTapEvent', eventName, event);
    }

    _handleCleverTapInbox(eventName,event){
        console.log('handleCleverTapInbox',eventName,event);
    }

    render() {
        debugger;
        return (
          <View style={styles.container}>
            <TouchableHighlight style={styles.button}
              onPress={this._recordEvent}>
              <Text>Record Event</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._recordChargedEvent}>
              <Text>Record Charged Event</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._updateUserProfile}>
              <Text>Update User Profile</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._getUserProfileProperty}>
              <Text>Get User Profile Property</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._enableOptOut}>
              <Text>Opt Out button</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._disableOptOut}>
              <Text>Opt In</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._enableDeviceNetworkInfo}>
              <Text>Enable Device Info</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._disableDeviceNetworkInfo}>
              <Text>Disable Device Info</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button}
              onPress={this._openInbox}>
              <Text>Open Inbox</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button}
              onPress={this._showCounts}>
              <Text>Show Counts</Text>
            </TouchableHighlight>
          </View>
        );
    }

    _recordEvent(event) {
        debugger;

        CleverTap.recordEvent('testEvent');
        CleverTap.recordEvent('testEventWithProps', {'foo': 'bar'});
        CleverTap.initializeInbox();
    }

    _recordChargedEvent(event) {
        CleverTap.recordChargedEvent({'totalValue': 20, 'category': 'books'}, [{'title': 'book1'}, {'title': 'book2'}, {'title': 'book3'}]);
    }

    _updateUserProfile(event) {
        CleverTap.profileSet({'Name': 'testUserA1', 'Identity': '123456', 'Email': 'test@test.com', 'custom1': 123});
        CleverTap.profileSetMultiValuesForKey(['a', 'b', 'c'], 'letters');
        CleverTap.profileAddMultiValueForKey('d', 'letters');
        CleverTap.profileAddMultiValuesForKey(['e', 'f'], 'letters');
        CleverTap.profileRemoveMultiValueForKey('b', 'letters');
        CleverTap.profileRemoveMultiValuesForKey(['a', 'c'], 'letters');
        CleverTap.setLocation(34.15, -118.20);
    }

    _getUserProfileProperty(event) {
        CleverTap.enablePersonalization();

        CleverTap.profileGetProperty('Name', (err, res) => {
            console.log('CleverTap Profile Name: ', res, err);
        });

        CleverTap.profileGetCleverTapID((err, res) => {
            console.log('CleverTapID', res, err);
        });

        CleverTap.profileGetCleverTapAttributionIdentifier((err, res) => {
            console.log('CleverTapAttributionIdentifier', res, err);
        });
    }

    _enableOptOut(event){
        CleverTap.setOptOut(true);
    }

    _disableOptOut(event){
        CleverTap.setOptOut(false);
    }

    _enableDeviceNetworkInfo(event){
        CleverTap.enableDeviceNetworkInfoReporting(true);
    }

    _disableDeviceNetworkInfo(event){
        CleverTap.enableDeviceNetworkInfoReporting(false);
    }

    _openInbox(event){
        CleverTap.showInbox({'tabs':['Offers','Promotions'],'navBarTitle':'My App Inbox','navBarTitleColor':'#FF0000','navBarColor':'#FFFF00','inboxBackgroundColor':'#FF00FF','backButtonColor':'#00FF00'
                                ,'unselectedTabColor':'#0000FF','selectedTabColor':'#FF0000','selectedTabIndicatorColor':'#000000','tabBackgroundColor':'#FFFF00'});
    }

    _showCounts(event){
        CleverTap.getInboxMessageCount((err, res) => {
            console.log('Total Messages: ', res, err);
        });
        CleverTap.getInboxMessageUnreadCount((err, res) => {
            console.log('Unread Messages: ', res, err);
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginBottom: 20
    }
});
