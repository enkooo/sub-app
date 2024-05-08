import * as Notifications from 'expo-notifications'

export const useSchedulePushNotification = async (
  date: Date,
  subscriptionName: string,
) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${subscriptionName} subscription`,
      body: `The next payment is due on ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      data: {
        data: `The next payment is due on ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      },
    },
    trigger: { date: date },
  })

  return id
}
