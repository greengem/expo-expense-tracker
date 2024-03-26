import { Text, Card, YStack, XStack, Button } from 'tamagui'
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { fetchCurrentBalance } from '../services/database';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react-native';

export default function TabOneScreen() {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [timeFrame, setTimeFrame] = useState('month');

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

  const handlePrev = () => {
    // Logic to subtract one day/month/year from selectedDate
  };

  const handleNext = () => {
    // Logic to add one day/month/year to selectedDate
  };



  const formattedBalance = currentBalance !== null ? `$${currentBalance.toFixed(2)}` : '$0.00';

  return (
    <YStack gap="$3" padding="$3">
      {/* <XStack justifyContent='space-between'>
        <Button variant='outlined' size="$3" onPress={() => setTimeFrame('day')}>Day</Button>
        <Button variant='outlined' size="$3" onPress={() => setTimeFrame('month')}>Month</Button>
        <Button variant='outlined' size="$3" onPress={() => setTimeFrame('year')}>Year</Button>
      </XStack>

      <XStack justifyContent='space-between'>
        <Button size="$3" onPress={handlePrev}><IconChevronLeft /></Button>
        <Text>The Date</Text>
        <Button size="$3" onPress={handleNext}><IconChevronRight /></Button>
      </XStack> */}

      <Card>
        <Card.Header padded>
          <Text>Expenses</Text>
        </Card.Header>
        <Card.Footer padded><Text fontSize="$10">{formattedBalance}</Text></Card.Footer>
      </Card>
    </YStack>
  );
}
