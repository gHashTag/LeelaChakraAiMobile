import React, { useEffect, useState } from 'react'

import firestore from '@react-native-firebase/firestore'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { s, vs } from 'react-native-size-matters'

import { Header, PostCard, Space, Spin, Text } from '../../../components'
import { captureException } from '../../../constants'
import { DiceStore, OnlinePlayer, PostStore } from '../../../store'
import { RootTabParamList } from '../../../types/types'
import { lang } from '../../../i18n'

interface Ipost {
  navigation: NativeStackNavigationProp<RootTabParamList, 'TAB_BOTTOM_1'>
  route: RouteProp<RootTabParamList, 'TAB_BOTTOM_1'>
}

export const PostScreen = observer(({}: Ipost) => {
  const [limit, setLimit] = useState(15)

  const { t } = useTranslation()
  const isAdmin = OnlinePlayer.store.status === 'Admin'

  useEffect(() => {
    const fetchPosts = async () => {
      if (DiceStore.online) {
        let query = firestore()
          .collection('Posts')
          .orderBy('createTime', 'desc')
          .limit(limit)

        if (!isAdmin) {
          query = query.where('language', '==', lang)
        }

        const subPosts = query.onSnapshot(PostStore.fetchPosts)
        return () => {
          subPosts()
        }
      }
    }

    fetchPosts()
  }, [limit, isAdmin])

  const data = PostStore.store.posts
  const newLimit = () => {
    if (data.length <= limit) {
      setLimit((pr) => pr + 15)
    }
  }
  const load = PostStore.store.loadPosts && data.length === 0

  return load ? (
    <Spin centered />
  ) : (
    <FlatList
      removeClippedSubviews={false}
      onScrollToIndexFailed={(error) =>
        captureException(error, 'PostScreen: Flatlist')
      }
      showsVerticalScrollIndicator={false}
      data={data}
      onEndReached={newLimit}
      onEndReachedThreshold={0.1}
      keyExtractor={(a) => a.id}
      renderItem={({ item }) => <PostCard postId={item.id} />}
      ItemSeparatorComponent={() => <Space height={vs(10)} />}
      ListHeaderComponent={
        <>
          <Header textAlign="center" title={t('online-part.reports')} />
          <Space height={vs(10)} />
        </>
      }
      ListEmptyComponent={
        <View style={{ paddingHorizontal: s(20) }}>
          <Text
            textStyle={styles.noPostText}
            h={'h4'}
            title={t('online-part.noPosts')}
          />
        </View>
      }
    />
  )
})

const styles = StyleSheet.create({
  noPostText: {
    textAlign: 'center'
  }
})
