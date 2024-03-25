import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchTransactions, deleteTransaction } from '../services/database';
import { Text, ScrollView, Button, Card, YStack } from 'tamagui'
import { categories } from '../categories';
import { format, parseISO } from 'date-fns';

interface Transaction {
  id: number;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export default function TabHistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        try {
          const loadedTransactions = await fetchTransactions();
          setTransactions(loadedTransactions);
        } catch (error) {
          console.error('Failed to load transactions:', error);
        }
      };
      loadTransactions();
    }, [])
  );

  const getCategoryName = (slug: string) => {
    const category = categories.find(category => category.slug === slug);
    return category ? category.name : slug;
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <ScrollView padding="$3">
      <YStack gap="$3">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <Card.Header padded>
              <YStack gap="$2">
                <Text>Amount: ${transaction.amount}</Text>
                <Text>Category: {getCategoryName(transaction.category)}</Text>
                <Text>Date: {format(parseISO(transaction.date), 'MM/dd/yyyy')}</Text>
                {transaction.note && <Text>Note: {transaction.note}</Text>}
              </YStack>
            </Card.Header>
            <Card.Footer padded>
              <Button size="$3" onPress={() => handleDeleteTransaction(transaction.id)}>Delete Transaction</Button>
            </Card.Footer>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
}
