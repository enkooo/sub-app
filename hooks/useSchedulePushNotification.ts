import * as Notifications from 'expo-notifications'

export const useSchedulePushNotification = async (
  notificationDate: Date,
  subscriptionDate: Date,
  subscriptionName: string,
) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${subscriptionName} subscription`,
      body: `The next payment is due on ${subscriptionDate.toLocaleDateString()} ${subscriptionDate.toLocaleTimeString()}`,
      data: {
        data: `The next payment is due on ${subscriptionDate.toLocaleDateString()} ${subscriptionDate.toLocaleTimeString()}`,
      },
    },
    trigger: { date: notificationDate },
  })

  return id
}
