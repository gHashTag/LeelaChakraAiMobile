import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import {
  black,
  captureException,
  goBack,
  gray,
  lightGray,
  openUrl,
  secondary,
  white
} from '../../constants'
import { Loading, PurchaseButton, Space, Text } from '../../components'

import { PurchasesPackage } from 'react-native-purchases'

import { useTheme } from '@react-navigation/native'
import { ms } from 'react-native-size-matters'
import { useTranslation } from 'react-i18next'

import React, { useState } from 'react'
import Emoji from 'react-native-emoji'

import { useRevenueCat } from '../../providers/RevenueCatProvider'
// @ts-ignore
import Ganesha from './ganesha.jpg'

const SubscriptionScreen: React.FC = () => {
  const { t } = useTranslation()

  const { packages, purchasePackage, restorePermissions, isLoading } =
    useRevenueCat()

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null)

  const handlePackageSelection = (pack: PurchasesPackage) => {
    setSelectedPackage(pack)
  }

  const handlePurchase = async () => {
    if (purchasePackage && selectedPackage) {
      try {
        await purchasePackage(selectedPackage)
        goBack()
      } catch (error) {
        captureException(error, 'handlePurchase')
        Alert.alert(
          'Error',
          `There was an error processing your purchase. ${error}}`
        )
      }
    }
  }

  const onPress = () => goBack()

  const onAlreadyBought = async () => {
    try {
      if (restorePermissions) {
        await restorePermissions()
      }
    } catch (error) {
      captureException(error, 'onAlreadyBought')
      Alert.alert(
        'Error',
        `There was an error processing your purchase. ${error}}`
      )
    }
  }

  const onFree = async () =>
    openUrl('https://zealy.io/c/leelaai/invite/qHjc-3WznJ-3su7ChaAOw')

  const { dark } = useTheme()
  const backgroundColor = dark ? black : white

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <ImageBackground style={styles.poster} source={Ganesha}>
        <Pressable onPress={onPress} style={styles.iconStyle}>
          <Emoji name=":heavy_multiplication_x:" style={styles.leftIconStyle} />
        </Pressable>
      </ImageBackground>

      <View style={styles.container}>
        <Text
          h="h4"
          textStyle={styles.test}
          title={t('descriptionSubscriptions')}
        />
        <Text
          h="h1"
          textStyle={styles.header}
          title={t('chooseSubscription')}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {packages.map((pack) => (
              <TouchableOpacity
                key={pack.identifier}
                onPress={() => handlePackageSelection(pack)}
                style={[
                  styles.packageItem,
                  selectedPackage === pack && styles.selectedPackage
                ]}
              >
                <Text
                  h="h0"
                  textStyle={styles.packageTitle}
                  title={t(`${[pack.identifier]}.title`)}
                />
                <Text
                  h="h0"
                  textStyle={styles.packagePrice}
                  title={pack.product.priceString}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
        <Space height={10} />
        <PurchaseButton
          title="buy"
          selectedPackage={selectedPackage}
          onPress={handlePurchase}
        />
        <Space height={10} />
        {/* <Text
          h="h4"
          textStyle={styles.bought}
          title={t('free')}
          onPress={onFree}
        />

        <Text h="h4" title={t('or')} onPress={onAlreadyBought} /> */}
        <Text
          h="h4"
          textStyle={styles.bought}
          title={t('alreadyBought')}
          onPress={onAlreadyBought}
        />
        <Space height={50} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  poster: {
    flex: 1,
    width: '100%',
    height: '90%'
  },
  iconStyle: {
    marginTop: 60,
    marginLeft: 20
  },
  leftIconStyle: {
    fontSize: Platform.OS === 'ios' ? ms(30, 0.6) : ms(20, 0.6),
    bottom: Platform.OS === 'ios' ? 0 : 30
  },
  header: {
    fontSize: ms(23, 0.6),
    fontWeight: 'bold',

    marginBottom: 20
  },
  bought: {
    fontSize: ms(13, 0.6),
    fontWeight: 'bold',
    color: gray,
    alignSelf: 'center',
    textDecorationLine: 'underline'
  },
  test: {
    fontSize: ms(15, 0.6),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
    bottom: Platform.OS === 'ios' ? ms(15, 0.6) : ms(10, 0.6)
  },
  packageItem: {
    borderWidth: 1,
    borderColor: secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectedPackage: {
    backgroundColor: lightGray
  },
  packageTitle: {
    fontSize: ms(21, 0.6),
    fontWeight: 'bold'
  },
  packagePrice: {
    fontSize: ms(22, 0.6)
  }
})

export { SubscriptionScreen }
