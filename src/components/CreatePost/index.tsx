import { yupResolver } from '@hookform/resolvers/yup'
import auth from '@react-native-firebase/auth'
import React, { useMemo, useState } from 'react'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { PostT } from '../../types/types'
import * as yup from 'yup'

import { Button, Input, Space } from '..'
import { Loading } from '../'
import {
  captureException,
  dimGray,
  handleCommentAi,
  navigate
} from '../../constants'
import { startStepTimer } from '../../screens/helper'
import { PostStore } from '../../store'
import { useRevenueCat } from '../../providers/RevenueCatProvider'

interface CreatePostT {
  plan: number
}

export const CreatePost: React.FC<CreatePostT> = ({ plan }) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { user } = useRevenueCat()
  const systemMessage = t('system')

  const schema = useMemo(
    () =>
      yup
        .object()
        .shape({
          text: yup
            .string()
            .trim()
            .min(100, t('fewChars') || '')
            .required(t('requireField') || '')
        })
        .required(),
    [t]
  )

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setLoading(true)
      const userUid = auth().currentUser?.uid
      methods.reset()
      startStepTimer()
      const postId = await PostStore.createPost({
        text: data.text,
        plan: plan,
        systemMessage,
        planText: t(`plan_${plan}.content`),
        pro: user.pro
      })
      const curItem: PostT = {
        ...(PostStore.store.posts.find((a) => a.id === postId?.id) || {}),
        systemMessage,
        ownerId: userUid || '',
        id: postId?.id || '',
        planText: t(`plan_${plan}.content`),
        pro: user.pro
      }
      handleCommentAi({
        curItem,
        systemMessage,
        message: data.text,
        planText: t(`plan_${plan}.content`),
        pro: user.pro
      })
      navigate('TAB_BOTTOM_1')
      setLoading(false)
    } catch (error) {
      console.error('error')
    }
  }

  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  return loading ? (
    <Loading />
  ) : (
    <FormProvider {...methods}>
      <Input
        name="text"
        color={dimGray}
        multiline
        placeholder={t('placeholderReport')}
        additionalStyle={styles.input}
      />
      <Space height={20} />
      <Button
        title={t('actions.send')}
        onPress={methods.handleSubmit(handleSubmit, (err) =>
          captureException(err, 'CreatePost: handleSubmit')
        )}
      />
    </FormProvider>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    alignItems: 'center'
  }
})
