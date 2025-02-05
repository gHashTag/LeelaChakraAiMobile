import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

import { captureException } from '../constants'

export const MessagingStore = makeAutoObservable({
  path: ''
})

makePersistable(MessagingStore, {
  name: 'MessagingStore',
  properties: ['path']
})

const fetchBusinesses = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      messaging()
        .getToken()
        .then((token) => {
          return saveTokenToDatabase(token)
        })

      return messaging().onTokenRefresh((token) => {
        saveTokenToDatabase(token)
      })
    }
  }
  requestUserPermission()
}

const saveTokenToDatabase = async (token: string) => {
  const userUid = auth().currentUser?.uid
  try {
    if (userUid) {
      await firestore()
        .collection('Profiles')
        .doc(userUid)
        .update({
          tokens: firestore.FieldValue.arrayUnion(token)
        })
    }
  } catch (e) {
    captureException(e, 'saveTokenToDatabase')
  }
}

const delTokenOnSignOut = async () => {
  const userUid = auth().currentUser?.uid
  try {
    const token = await messaging().getToken()
    await firestore()
      .collection('Profiles')
      .doc(userUid)
      .update({
        tokens: firestore.FieldValue.arrayRemove(token)
      })
  } catch (error) {
    captureException(error, 'delTokenOnSignOut')
  }
}

export { saveTokenToDatabase, fetchBusinesses, delTokenOnSignOut }
