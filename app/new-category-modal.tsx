import { useState } from "react";
import { YStack, Input, Button, XStack, Circle } from "tamagui";
import { addCategory } from './services/database';

export default function ModalScreen() {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') return;
    await addCategory(newCategoryName);
    setNewCategoryName('');
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
          <Circle key={color} size="$2" backgroundColor={color} borderColor="white" borderWidth="$0.75" />
        ))}
      </XStack>
      <Button onPress={handleAddCategory}>Add Category</Button>
    </YStack>
  )
}
