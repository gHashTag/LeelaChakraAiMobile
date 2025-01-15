import {useState} from 'react'
import {captureException, secondary, white} from '../constants'
import ImagePicker from 'react-native-image-crop-picker'
import {OnlinePlayer} from '../store'
import axios from 'axios'
// Function to get image from picker
const getImagePicker = async () => {
  const image = await ImagePicker.openPicker({
    width: 400,
    height: 400,
    cropping: true,
    cropperCircleOverlay: true,
    sortOrder: 'none',
    compressImageMaxWidth: 400,
    compressImageMaxHeight: 400,
    compressImageQuality: 1,
    compressVideoPreset: 'HighestQuality',
    includeExif: true,
    cropperStatusBarColor: white,
    cropperToolbarColor: white,
    cropperActiveWidgetColor: white,
    cropperToolbarWidgetColor: secondary,
  })
  return image
}

if (!process.env.PINATA_JWT) {
  throw new Error('No PINATA_JWT')
}

// Функция для загрузки файла на Pinata
const pinFileToIPFS = async (fileUri: string, fileName: string) => {
  const formData = new FormData()
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: fileName,
  })

  const pinataMetadata = JSON.stringify({
    name: fileName,
  })
  formData.append('pinataMetadata', pinataMetadata)

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', pinataOptions)

  try {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    }

    const res = await axios(options)
    return res.data.IpfsHash
  } catch (error) {
    console.error('Ошибка при загрузке на Pinata:', error)
    throw error
  }
}

export const useChooseAvatarImage = () => {
  // Local state to replace reactive vars
  const [ava, setAva] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const chooseAvatarImage = async () => {
    try {
      setIsLoading(true)

      const image = await getImagePicker()

      if (image) {
        const fileName = image.path.split('/').pop() || 'image.jpg'
        const ipfsHash = await pinFileToIPFS(image.path, fileName)
        if (ipfsHash) {
          const ipfsImageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
          setAva(ipfsImageUrl)
          await OnlinePlayer.uploadImage(ipfsImageUrl)
          setIsLoading(false)
        } else {
          throw new Error('Не удалось получить IPFS хеш')
        }
      } else {
        captureException('No image selected.', 'useChooseAvatarImage')
      }
    } catch (error) {
      captureException(error, 'Error selecting image or uploading to IPFS:')
      setIsLoading(false)
    }
  }

  return {ava, setAva, isLoading, chooseAvatarImage}
}
