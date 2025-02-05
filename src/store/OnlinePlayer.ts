import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import {makeAutoObservable} from 'mobx'
import * as Keychain from 'react-native-keychain'
import i18next from '../i18n'

import {upStepOnline} from './helper'
import {delTokenOnSignOut} from './MessagingStore'

import {DiceStore, actionSubscribeStore, actionsDice} from './'
import {captureException, navigate} from '../constants'
import {
  getFireBaseRef,
  getIMG,
  getProfile,
  resetHistory,
  resetPlayer,
  updatePlan,
} from '../screens/helper'
import {HistoryT, statusT} from '../types/types'

const initProfile = {
  firstName: '',
  lastName: '',
  email: '',
  intention: '',
}

const initHistory = () => [
  {
    createDate: Date.now(),
    plan: 68,
    count: 0,
    status: 'start',
  },
]

export const OnlinePlayer = makeAutoObservable<Istore>({
  store: {
    start: false,
    finish: false,
    stepTime: 0,
    timeText: ' ',
    canGo: false,
    plan: 68,
    // addons
    firstGame: false,
    loadingProf: true,
    history: initHistory(),
    isReported: true,
    avatar: '',
    profile: initProfile,
    isPosterLoading: false,
  },
  async resetGame(): Promise<void> {
    try {
      OnlinePlayer.store = {
        ...OnlinePlayer.store,
        start: false,
        finish: false,
        plan: 68,
        history: initHistory(),
      }
      await resetPlayer()
      await resetHistory()
      await updatePlan(68)
      DiceStore.online = false
    } catch (err) {
      captureException(err, 'resetGame')
    }
  },
  async SignOut(): Promise<void> {
    try {
      const userUid = auth().currentUser?.uid
      await getFireBaseRef(`/online/${userUid}`).set(false)
      await delTokenOnSignOut()
      OnlinePlayer.store = {
        ...OnlinePlayer.store,
        profile: initProfile,
        avatar: '',
        start: false,
        finish: false,
        plan: 68,
        history: initHistory(),
        canGo: false,
        stepTime: 0,
        timeText: ' ',
        loadingProf: true,
      }
      actionsDice.resetPlayer()
      await Keychain.resetInternetCredentials('auth')
      await auth().signOut()
      actionSubscribeStore.resetStore()
      DiceStore.online = false
      navigate('HELLO')
    } catch (err) {
      captureException(err, 'SignOut')
    }
  },
  async SignOutToOffline(): Promise<void> {
    try {
      OnlinePlayer.store = {
        ...OnlinePlayer.store,
        profile: initProfile,
        avatar: '',
        start: false,
        finish: false,
        plan: 68,
        history: initHistory(),
        canGo: false,
        stepTime: 0,
        timeText: ' ',
        loadingProf: true,
      }
      actionsDice.resetPlayer()
      actionSubscribeStore.resetStore()
      await auth().signOut()
    } catch (err) {
      captureException(err, 'SignOutToOffline')
    }
  },
  async getProfile(): Promise<void> {
    try {
      OnlinePlayer.store.loadingProf = true
      const curProf = await getProfile()
      if (curProf) {
        OnlinePlayer.store = {
          ...OnlinePlayer.store,
          plan: curProf.plan,
          start: curProf.start,
          finish: curProf.finish,
          firstGame: curProf.firstGame,
          profile: {
            firstName: curProf.firstName,
            lastName: curProf.lastName,
            email: curProf.email,
            intention: curProf.intention || '',
          },
          isReported: curProf.isReported,
          flagEmoji: curProf.flagEmoji,
          stepTime: curProf.lastStepTime,
          canGo: Date.now() - curProf.lastStepTime >= 86400000,
          status: curProf?.status,
          history: curProf.history
            .sort((a, b) => b.createDate - a.createDate)
            .slice(0, 30),
        }
        if (curProf.plan === 68 && !curProf.finish) {
          actionsDice.setMessage(i18next.t('sixToBegin'))
        } else {
          actionsDice.setMessage(' ')
        }
        OnlinePlayer.store.avatar = await getIMG(curProf.avatar)
        DiceStore.startGame = curProf.start
      }
      OnlinePlayer.store.loadingProf = false
    } catch (error) {
      captureException(error, 'getProfile')
    }
  },
  async uploadImage(ipfsImageUrl: string): Promise<void> {
    console.log(ipfsImageUrl, 'ipfsImageUrl')
    try {
      if (ipfsImageUrl) {
        const currentUser = auth().currentUser
        console.log(currentUser, 'currentUser')
        if (currentUser) {
          await currentUser.updateProfile({
            photoURL: ipfsImageUrl,
          })
          console.log(currentUser.photoURL, 'currentUser.photoURL')

          await firestore().collection('Profiles').doc(currentUser.uid).update({
            avatar: ipfsImageUrl,
          })

          OnlinePlayer.store.avatar = ipfsImageUrl

        } else {
          captureException('User is not authenticated.', 'uploadImage')
        }
      }
    } catch (error) {
      captureException(error, 'uploadImage')
    }
  },
  async updateStep(): Promise<void> {
    upStepOnline()
  },
  getLeftTime(lastTime) {
    const day = 86400000
    const hour = 3600000
    const min = 60000
    const sec = 1000
    const dateNow = Date.now()
    const passTime = dateNow - lastTime
    const difference = day - passTime

    if (difference <= 0) {
      return '0'
    } else if (difference < min) {
      const secCount = Math.round(difference / sec)
      return `${secCount} ${i18next.t('timestamps-short.sec')}`
    } else if (difference < hour) {
      const minCount = Math.round(difference / min)
      return `${minCount} ${i18next.t('timestamps-short.min')}`
    } else {
      const hourCount = Math.round(difference / hour)
      return `${hourCount} ${i18next.t('timestamps-short.h')}`
    }
  },
  async deleteUser() {
    try {
      const userUid = auth().currentUser?.uid
      await getFireBaseRef(`/online/${userUid}`).set(false)
      await delTokenOnSignOut()
      let user = auth().currentUser
      user === null
        ? null
        : user.delete().catch(error => captureException(error, 'deleteUser'))
      navigate('HELLO')
    } catch (err) {
      captureException(err, 'deleteUser')
    }
  },
})

interface Istore {
  store: OnlinePlayerStore
  resetGame: () => Promise<void>
  SignOut: () => Promise<void>
  getProfile: () => Promise<void>
  uploadImage: (ipfsImageUrl: string) => Promise<void>
  updateStep: () => Promise<void>
  SignOutToOffline: () => Promise<void>
  getLeftTime: (lastTime: number) => string
  deleteUser: () => Promise<void>
}

interface OnlinePlayerStore {
  // game
  start: boolean
  finish: boolean
  stepTime: number
  timeText: string
  canGo: boolean
  plan: number
  // addons
  firstGame: boolean
  loadingProf: boolean
  history: HistoryT[]
  isReported: boolean
  avatar: string
  profile: {
    firstName: string
    lastName: string
    email: string
    intention: string
  }
  isPosterLoading: boolean
  flagEmoji?: string
  status?: statusT
}
