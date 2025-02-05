import { NavigatorScreenParams } from '@react-navigation/native'

export type RootStackParamList = {
  HELLO: undefined
  WELCOME_SCREEN: undefined
  UI: undefined
  SIGN_UP: undefined
  SIGN_UP_AVATAR: undefined
  SIGN_IN: undefined
  FORGOT: { email: string }
  FORGOT_PASSWORD_SUBMIT: { email: string }
  CONFIRM_SIGN_UP: { email: string }
  SIGN_UP_USERNAME: { email: string }
  USER: undefined
  USER_EDIT: {
    firstName: string
    lastName: string
    email: string
  }
  PLAYRA_SCREEN: undefined
  MAIN: NavigatorScreenParams<RootTabParamList>
  RULES_SCREEN: undefined
  SUBSCRIPTION_SCREEN: undefined
  RULES_DETAIL_SCREEN: {
    title: string
    content: string
  }
  PLANS_SCREEN: undefined
  SELECT_PLAYERS_SCREEN: undefined
  PLANS_DETAIL_SCREEN: {
    plan: number
    report?: boolean
  }
  PROFILE_SCREEN: undefined
  ONLINE_GAME_SCREEN: undefined
  RADIO_SCREEN: {
    id: number
    title: string
    content: string
    url: string
  }
  DETAIL_POST_SCREEN: {
    postId: string
    comment?: boolean
    translatedText?: string
    hideTranslate?: boolean
  }
  POST_SCREEN: undefined
  REPLY_MODAL: {
    buttons: ButtonsModalT[]
  }
  INPUT_TEXT_MODAL: {
    onSubmit?: (text: string) => void
    onError?: (err: any) => void
  }
  EXIT_MODAL: undefined
  NETWORK_MODAL: undefined
  VIDEO_SCREEN: {
    uri: string
    poster: string
  }
  PLAN_REPORT_MODAL: {
    plan: number
  }
  UPDATE_VERSION_MODAL: undefined
  CHANGE_INTENTION_SCREEN: {
    prevIntention?: string
    blockGoBack?: boolean
    title?: string
  }
  USER_PROFILE_SCREEN: {
    ownerId: string
    editable: boolean
  }
}

export type RootTabParamList = {
  TAB_BOTTOM_0: undefined
  TAB_BOTTOM_1?: {
    scrollToId?: number
  }
  TAB_BOTTOM_3: undefined
  TAB_BOTTOM_2: undefined
  TAB_BOTTOM_4: undefined
  TAB_BOTTOM_5: undefined
  SUBSCRIPTION_SCREEN: undefined
}

export type PlansT = number
export interface UserT {
  email: string
  finish: boolean
  firstGame: boolean
  firstName: string
  lastName: string
  lastStepTime: number
  owner: string
  plan: number
  start: boolean
  history: HistoryT[]
  isReported: boolean
  avatar?: string
  lang?: string
  tokens?: string[]
  status?: statusT
  flagEmoji?: string
  intention?: string
}

export interface OtherUsersT {
  email: string
  firstName: string
  lastName: string
  plan: number
  owner: string
  isOnline: boolean
  avatar?: string
  status?: statusT
}
export type statusT = 'ban' | 'Admin' | 'Free' | null
export interface HistoryT {
  plan: number
  count: number
  status: string
  createDate: number
}

export interface SelfT {
  player: number
  start: boolean
  finish: boolean
  plan: number
  planPrev: number
  rate?: boolean
  history: HistoryT[]
}

export interface FormPostT {
  text?: string
  plan?: number
  systemMessage: string
  planText: string
  pro: boolean
}

export interface MessageAIT {
  systemMessage: string
  message: string
  planText: string
  pro: boolean
}
export interface PostT extends FormPostT {
  id: string
  comments?: string[]
  createTime?: number
  email?: string
  liked?: string[]
  language?: string
  accept?: boolean
  flagEmoji?: string
  ownerId: string
}

export interface FormCommentT {
  text: string
  postId: string
  postOwner: string
  ownerId?: string
  pro?: boolean
}

export interface HandleCommentAiParamsT {
  curItem: PostT | undefined
  systemMessage: string
  message: string
  planText?: string
  pro: boolean
}

export interface CommentT extends FormCommentT {
  firstName: string
  lastName: string
  ownerId: string
  createTime: number
  email: string
  reply: false
  id: string
}

export interface FormReplyCom {
  text: string
  commentId: string
  commentOwner: string
  postId: string
}

export interface ReplyComT extends FormReplyCom {
  firstName: string
  lastName: string
  ownerId: string
  createTime: number
  email: string
  id: string
  reply: true
}

export interface ButtonsModalT {
  onPress: () => void
  title: string
  icon: string
  key: string
  color?: string
}
