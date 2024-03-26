import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchTransactions, deleteTransaction } from '../services/database';
import { Text, ScrollView, Button, Card, YStack, XStack } from 'tamagui';
import { format, parseISO } from 'date-fns';
import { Alert } from 'react-native';

interface Transaction {
  id: number;
  amount: number;
  category: number;
  categoryName: string;
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
          //console.log("Loaded transactions:", loadedTransactions);
          setTransactions(loadedTransactions);
          console.log("Loaded transactions:", loadedTransactions);
        } catch (error) {
          console.error('Failed to load transactions:', error);
        }
      };
      
      loadTransactions();
    }, [])
  );



  // ...
  
  const handleDeleteTransaction = (id: number) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteTransaction(id);
              setTransactions(prev => prev.filter(transaction => transaction.id !== id));
            } catch (error) {
              console.error('Failed to delete transaction:', error);
            }
          } 
        }
      ]
    );
  };

  return (
    <ScrollView padding="$3">
      <YStack gap="$3">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>

            <Card.Header padded>
              <YStack gap="$2">
                <Text fontSize={20}>£{transaction.amount}</Text>
                <Text fontSize={13}>Category: {transaction.categoryName}</Text>
                <Text fontSize={13}>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</Text>
                {transaction.note && <Text>Note: {transaction.note}</Text>}
              </YStack>
            </Card.Header>

            <Card.Footer paddingHorizontal="$4" paddingBottom="$4">
              <XStack gap="$2">
                <Button size="$3" onPress={() => handleDeleteTransaction(transaction.id)}>Delete</Button>
                <Button size="$3" onPress={() => handleDeleteTransaction(transaction.id)}>Edit</Button>
              </XStack>
            </Card.Footer>

          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
}
