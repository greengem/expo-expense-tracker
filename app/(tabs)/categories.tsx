import React, { useState, useCallback } from 'react';
import { ListItem, XStack, YGroup, YStack, Text, Circle } from 'tamagui';
import { IconX } from '@tabler/icons-react-native';
import { deleteCategory, fetchCategories } from '../services/database';
import { useFocusEffect } from 'expo-router';

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function TabCategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    const fetchedCategories = await fetchCategories();
    setCategories(fetchedCategories);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const handleDeleteCategory = async (name: string) => {
    await deleteCategory(name);
    loadCategories();
  };

  return (
    <YStack padding="$3" gap="$5">
      <YGroup>
        {categories.map((category) => (
          <YGroup.Item key={category.id}>
            <ListItem>
              <XStack flex={1} justifyContent='space-between' alignItems='center'>
                <XStack alignItems='center' gap="$3">
                  <Circle backgroundColor={category.color} size="$1" />
                  <Text>{category.name}</Text>
                </XStack>
                <IconX size={20} color="red" onPress={() => handleDeleteCategory(category.name)} />
              </XStack>
            </ListItem>
          </YGroup.Item>
        ))}
      </YGroup>
    </YStack>
  );
}
