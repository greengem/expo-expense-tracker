import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'
import { IconDashboard, IconCreditCardPay, IconInfoCircle, IconReport, IconUser, IconHistory } from '@tabler/icons-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'red',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconDashboard size={28} color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <IconInfoCircle
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="new-transaction"
        options={{
          title: 'New Transaction',
          tabBarIcon: ({ color }) => <IconCreditCardPay color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <IconReport color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconHistory color={color} />,
        }}
      />
    </Tabs>
  )
}
