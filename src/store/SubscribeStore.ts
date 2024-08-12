import {makeAutoObservable} from 'mobx'
import {makePersistable} from 'mobx-persist-store'
// import { RU_STORE } from '@env'

const SubscribeStore = makeAutoObservable({
  isBlockGame: false, // defaut true
})

const unblock = false
const actionSubscribeStore = {
  unBlock: async () => {
    SubscribeStore.isBlockGame = unblock
  },
  blockGame: async () => {
    SubscribeStore.isBlockGame = true
  },
  resetStore: async () => {
    SubscribeStore.isBlockGame = unblock
  },
}

makePersistable(SubscribeStore, {
  name: 'SubscribeStore',
  //properties: ['isBlockGame']
})

export {SubscribeStore, actionSubscribeStore}
