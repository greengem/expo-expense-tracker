import { Text, Card, YStack } from 'tamagui'
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { fetchCurrentBalance } from '../services/database';

export default function TabOneScreen() {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadCurrentBalance = async () => {
        try {
          const balance = await fetchCurrentBalance();
          setCurrentBalance(balance);
        } catch (error) {
          console.error('Failed to fetch current balance:', error);
        }
      };

      loadCurrentBalance();
    }, [])
  );

  const formattedBalance = currentBalance !== null ? `$${currentBalance.toFixed(2)}` : '$0.00';

  return (
    <YStack gap="$3" padding="$3">
      <Card>
        <Card.Header padded>
          <Text>Current Balance</Text>
        </Card.Header>
        <Card.Footer padded><Text fontSize="$10">{formattedBalance}</Text></Card.Footer>
      </Card>
    </YStack>
  );
}
