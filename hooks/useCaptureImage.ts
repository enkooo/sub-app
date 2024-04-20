import * as ImagePicker from 'expo-image-picker'

export const useCaptureImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true,
  })

  return { result }
}
