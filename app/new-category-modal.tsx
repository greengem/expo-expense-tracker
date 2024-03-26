import { useState } from "react";
import { YStack, Input, Button, XStack, Circle } from "tamagui";
import { addCategory } from './services/database';
import { router } from 'expo-router';

export default function ModalScreen() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '' || selectedColor.trim() === '') return;
    await addCategory(newCategoryName, selectedColor);
    setNewCategoryName('');
    setSelectedColor('');

    router.back();
  };

  const labelColours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink'];
  return (
    <YStack gap="$3" padding="$3">
      <Input
        placeholder='New Category...'
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        autoFocus
      />
      <XStack gap="$2">
      {labelColours.map((color) => (
          <Circle
            key={color}
            size="$3"
            backgroundColor={color}
            borderColor={selectedColor === color ? "white" : "black"}
            borderWidth={selectedColor === color ? "$1" : "$0"}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </XStack>
      <Button onPress={handleAddCategory}>Add Category</Button>
    </YStack>
  )
}
