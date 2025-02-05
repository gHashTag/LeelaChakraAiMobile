import React, { useState } from 'react'

import { StyleSheet, View } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { useTypedNavigation } from '../../../hooks'

import { getActions } from './ModalActions'

import { HashtagFormat, Space, Text } from '../../'
import { PlanAvatar } from '../../'
import { OpenActionsModal, fuchsia, lightGray } from '../../../constants'
import { getTimeStamp } from '../../../screens/helper'
import { PostStore } from '../../../store'
import { ReplyComT } from '../../../types/types'
import { ButtonVectorIcon } from '../../Buttons'

interface SubComT {
  item: ReplyComT
  index: number
}

export function SubCommentCard({ item }: SubComT) {
  const [hideTranslate, setHideTranslate] = useState(true)
  const [transText, setTransText] = useState('')
  const { navigate } = useTypedNavigation()

  const date = getTimeStamp({ lastTime: item.createTime, type: '-short' })
  const avaUrl = PostStore.getAvaById(item.ownerId)

  async function handleTransText() {
    if (hideTranslate && transText === '') {
      const translated = await PostStore.translateText(item.text)
      setTransText(translated)
    }
    setHideTranslate((pr) => !pr)
  }

  const OpenModal = () => {
    const modalButtons = getActions({ handleTransText, hideTranslate, item })
    OpenActionsModal(modalButtons)
  }

  const handleProfile = () => {
    if (item?.ownerId) {
      navigate('USER_PROFILE_SCREEN', { ownerId: item?.ownerId })
    }
  }
  const text = hideTranslate ? item.text : transText
  const curName = PostStore.getOwnerName(item.ownerId, false)
  return (
    <View style={styles.container}>
      <View style={styles.commentHead}>
        <PlanAvatar
          avaUrl={avaUrl}
          isAccept={true}
          onPress={handleProfile}
          plan={PostStore.getComPlan(item.ownerId)}
          size="small"
        />
        <Space width={s(6)} />
        <View style={styles.infoContainer}>
          <View style={styles.infoLine}>
            <Text numberOfLines={1} h={'h6'} title={curName as string} />
            <Text
              numberOfLines={1}
              h={'h6'}
              title={` ${date}`}
              oneColor={lightGray}
            />
          </View>
        </View>
        <ButtonVectorIcon
          size={s(10)}
          name="chevron-down"
          onPress={OpenModal}
        />
        <Space width={s(8)} />
      </View>
      <Space height={vs(3)} />
      <View style={styles.textContainer}>
        <Space width={s(5)} />
        <HashtagFormat hashTagColor={fuchsia} title={text} h="h6" selectable />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(5)
  },
  infoLine: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  infoContainer: {
    flexDirection: 'column',
    flex: 1
  },
  commentHead: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  textContainer: {
    flexDirection: 'row'
  }
})
