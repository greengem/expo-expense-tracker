import React from 'react';
import { ListItem, XStack, YGroup, YStack, Input, Text, Button } from 'tamagui'
import { categories } from '../categories';
import { IconX } from '@tabler/icons-react-native';

export default function TabCategoryScreen() {

  return (
    <YStack padding="$3" gap="$5">
      <YGroup>
        {categories.map((category) => (
          <YGroup.Item key={category.slug}>
            <ListItem>
              <XStack flex={1} justifyContent='space-between'>
                <Text>{category.name}</Text>
                <IconX size={20} color="red" />
              </XStack>
            </ListItem>
          </YGroup.Item>
        ))}
      </YGroup>

      <YStack gap="$2">
        <Input placeholder='New Category...' />
        <Button>Add Category</Button>
      </YStack>
    </YStack>
  );
}
