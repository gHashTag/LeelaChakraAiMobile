import {makeAutoObservable} from 'mobx'
import {makePersistable} from 'mobx-persist-store'
// import { RU_STORE } from '@env'

const SubscribeStore = makeAutoObservable({
  isBlockGame: true, // defaut true
})

const actionSubscribeStore = {
  unBlock: async () => {
    SubscribeStore.isBlockGame = false
  },
  blockGame: async () => {
    SubscribeStore.isBlockGame = true
  },
  resetStore: async () => {
    SubscribeStore.isBlockGame = false
  },
}

makePersistable(SubscribeStore, {
  name: 'SubscribeStore',
  //properties: ['isBlockGame']
})

export {SubscribeStore, actionSubscribeStore}