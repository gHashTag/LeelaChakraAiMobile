import DeviceInfo from 'react-native-device-info'
import {createNavigationContainerRef} from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import axios from 'axios'
import {Alert, Dimensions, Linking, Platform} from 'react-native'
import Rate from 'react-native-rate'
import i18next from './i18n'

import {PostStore} from './store'
import {ButtonsModalT, HandleCommentAiParamsT, MessageAIT} from './types/types'

export const navRef = createNavigationContainerRef<any>()

export const navigate = (name: string, params?: any) => {
  if (navRef.isReady()) {
    navRef.navigate(name, params)
  }
}

export const generateComment = async ({
  message,
  systemMessage,
  planText,
  pro,
}: MessageAIT): Promise<{response: string; gpt: string}> => {
  const modelGPT = 'gpt-4o'

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: modelGPT,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: message,
          },
          {
            role: 'assistant',
            content: planText,
          },
        ],
        max_tokens: 800,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )
    console.log(response, 'response')

    return {
      response: response?.data?.choices[0]?.message?.content ?? '',
      gpt: response?.data?.model,
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      console.error(
        'Server error occurred while generating comment:',
        error.message,
      )
      throw new Error(
        'Unable to generate comment due to server error. Please try again later.',
      )
    }
    captureException(error, 'generateComment')
    throw error
  }
}

export const onLeaveFeedback = (onAction: (success: any) => void) => {
  const options = {
    AppleAppID: '1296604457',
    GooglePackageName: 'com.leelagame',
    OtherAndroidURL:
      'https://play.google.com/store/apps/details?id=com.leelagame',
    preferInApp: true,
    openAppStoreIfInAppFails: true,
  }
  Rate.rate(options, onAction)
}

export const handleCommentAi = async ({
  curItem,
  systemMessage,
  message,
  planText = ' ',
  pro,
}: HandleCommentAiParamsT): Promise<void> => {
  const aiComment: {response: string; gpt: string} = await generateComment({
    message,
    systemMessage,
    planText,
    pro,
  })
  if (curItem && aiComment) {
    await PostStore.createComment({
      text: aiComment.response,
      postId: curItem.id,
      postOwner: curItem.ownerId,
      ownerId: process.env.LEELA_ID,
    })
  }
}

export function OpenNetworkModal() {
  if (navRef.isReady()) {
    navRef.navigate('NETWORK_MODAL')
  }
}

export function OpenUpdateVersionModal() {
  if (navRef.isReady()) {
    navRef.navigate('UPDATE_VERSION_MODAL')
  }
}

export function OpenExitModal() {
  if (navRef.isReady()) {
    navRef.navigate('EXIT_MODAL')
  }
}

interface VideoModalT {
  uri: string
  poster: string
}

export function OpenVideoModal({uri, poster}: VideoModalT) {
  if (navRef.isReady()) {
    navRef.navigate('VIDEO_SCREEN', {uri, poster})
  }
}

export function OpenPlanReportModal(plan: number) {
  if (navRef.isReady()) {
    navRef.navigate('PLAN_REPORT_MODAL', {plan})
  }
}

export function OpenActionsModal(modalButtons: ButtonsModalT[]) {
  if (navRef.isReady()) {
    navRef.navigate('REPLY_MODAL', {buttons: modalButtons})
  }
}

export const banAlert = () => {
  Alert.alert(
    i18next.t('online-part.youBanned'),
    i18next.t('online-part.banText'),
    [{text: 'OK', onPress: () => navigate('HELLO')}],
  )
}
export const accountHasBanAlert = () => {
  Alert.alert(i18next.t('online-part.accountBanned'), undefined, [{text: 'OK'}])
}

export const captureException = (error: any, target: string) => {
  if (!error) {
    console.log(
      '%c captureException called with messing or incorrect arguments',
      'background: #555; color: yellow',
    )
    return
  }
  console.error(`On:${target}/ My Error: ${error} `)
  if (!__DEV__) {
    Sentry.captureException(error)
  }
}

export const win = Dimensions.get('window')
export const W = win.width
export const H = win.height
export const imgH = Math.round((W * 9) / 16)
export const isIos = Platform.OS === 'ios'

export const openUrl = async (url: string) => {
  await Linking.openURL(url)
}

export const goBack = () => {
  if (navRef.isReady()) {
    navRef.goBack()
  }
}
//@ts-ignore
export const goHome = navigation => () => navigation.popToTop()()

export const primary = '#50E3C2'
export const secondary = '#ff06f4'
export const gray = '#949494'
export const white = '#ffffff'
export const black = '#1c1c1c'
export const dimGray = '#707070'
export const lightGray = '#D1CDCD'
export const classicRose = '#FDBEEA'
export const mustard = '#F3DE50'
export const fuchsia = '#FF06F4'
export const trueBlue = '#007ACD'
export const paleBlue = '#BEFCE5'
export const brightTurquoise = '#1EE4EC'
export const red = '#FC2847'
export const orange = '#FFB700'
export const blackOpacity = 'rgba(0, 0, 0, 0.8)'
export const grayBlackOpacity = 'rgba(139, 139, 139, 0.1)'

export const revenuecat = 'BeIMIIfptWXlouosYudFEWQDkwDvJUzv'

export const defUrl =
  'https://leelachakra.com/resource/LeelaChakra/Mantra/mantra.json'

export const ENTITLEMENT_ID = 'Pro'

export const openURLPolicy = () => {
  Linking.openURL('https://www.leelachakra.com/docs/policy').catch(error =>
    captureException(error, 'Linking.openURL'),
  )
}

export const openURLEula = () => {
  Linking.openURL('https://www.leelachakra.com/docs/eula').catch(error =>
    captureException(error, 'Linking.openURL'),
  )
}

export const bundleVersion = DeviceInfo.getVersion()
export const buildVersion = DeviceInfo.getBuildNumber()
