// @flow
import React, { memo } from 'react'

import { Image, ImageStyle, StyleProp } from 'react-native'
import { ScaledSheet, ms } from 'react-native-size-matters'

import { ICONS } from './images'

const styles = ScaledSheet.create({
  img: {
    width: ms(35, 0.5),
    height: ms(35, 0.5)
  }
})

interface TabT {
  title: string
  imageStyle?: StyleProp<ImageStyle>
}

const Tab = memo<TabT>(({ title, imageStyle }) => {
  const { img } = styles

  const source = () => ICONS.filter((x) => x.title === title)[0].path

  return <Image source={source()} style={[img, imageStyle]} />
})

export { Tab }
