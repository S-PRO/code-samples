// @flow


/* REACT */
import React, { Component } from 'react';
import { AppState, Text, View } from 'react-native';

/* MODULES */
import { observer } from 'mobx-react';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

/* CONFIGS */
import DATE_CONFIG from '/config/date.config.js';

/* STYLES */
import styles from './styles.js';

/* TYPES */
import type { _t_appStore } from '/store/types';
import type { _t_timerTabStore } from '/types';


@observer
export default class Timer extends Component {

  // ================
  // ===== FLOW =====
  // ================


  props: {
    appStore: _t_appStore,
    timerTabStore: _t_timerTabStore,
  };

  _appState: string;


  // ===========================
  // ===== CLASS FUNCTIONS =====
  // ===========================


  constructor(props: Object): void {
    super(props);

    this._appState = 'active';

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }


  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }


  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  // ============================
  // ===== CUSTOM FUNCTIONS =====
  // ============================


  /**
   * Handle when app become active
   *
   * @param {string} nextAppState - next app state (inactive | background | active)
   */
  _handleAppStateChange(nextAppState: string): void {
    if (this._appState.match(/inactive|background/) && (nextAppState === 'active')) {
      this.props.timerTabStore.onAppStart();
    }

    if (this._appState.match(/active/) && (nextAppState === 'inactive' || nextAppState === 'background')) {
      this.props.timerTabStore.onChangeStateToBackground();
    }

    this._appState = nextAppState;
  }


  // ==================
  // ===== RENDER =====
  // ==================


  render() {
    const {
      timerHours,
      timerMinutes,
      timerSeconds,
      clockInTime,
      isTimerActivated
    } = this.props.timerTabStore;


    return (
      <View>
        <View style={styles.timerTitle} >
          <View style={styles.clockInRowCenterBlock} >
            <Text style={styles.timerDate} >
              {moment().format(DATE_CONFIG.timerDate)}
            </Text>
          </View>

          <View style={styles.timerBlockStatusWrapper} >
            {
              <Text style={styles.timerBlockStatus} >
                {
                  this.props.timerTabStore.isTimerRunning
                    ? `Break time ${this.props.timerTabStore.getBreakTime}`
                    : 'On Break'
                }
              </Text>
            }
          </View>
        </View>

        <View style={styles.timerWrapper} >
          <Text style={styles.timerValue} >
            {timerHours < 10 ? '0' + timerHours : timerHours}
            {':'}
            {timerMinutes < 10 ? '0' + timerMinutes : timerMinutes}
          </Text>

          <Text style={styles.secondsText} >
            {timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}
          </Text>
        </View>

        <View style={styles.timerLabelsWrapper} >
          <View style={styles.timerLabelsBlockHours} >
            <Text style={styles.timerLabel} >
              hrs
            </Text>
          </View>

          <View style={styles.timerLabelsBlock} >
            <Text style={styles.timerLabel} >
              mins
            </Text>
          </View>
        </View>

        <View style={styles.timerClockedWrapper} >
          {
            isTimerActivated &&
            <Animatable.Text animation="flipInX" style={styles.timerClockedTitle} >
              Clocked in at {moment(clockInTime).format(DATE_CONFIG.timeOfDay)}
            </Animatable.Text>
          }
        </View>
      </View>
    );
  }
}
