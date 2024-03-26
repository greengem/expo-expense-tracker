import { useState,  useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, Input, Button, Text, YStack, XStack } from 'tamagui';
import { fetchCategories, addTransaction } from '../services/database';
import { router } from 'expo-router';

interface FormData {
  amount: string;
  category: number | null;
  note: string;
}

interface Category {
  id: number;
  name: string;
}

export default function TabNewTransactionScreen() {
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPickerShow, setIsPickerShow] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, reset, trigger, setError, clearErrors } = useForm<FormData>({
    defaultValues: {
      amount: '',
      category: null,
      note: '',
    }
  });
  

  useFocusEffect(
    useCallback(() => {
      const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      };
      loadCategories();
    }, [])
  );

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);
    const isFormValid = await trigger();
    if (data.category === null) {
      setError('category', {
        type: 'manual',
        message: 'You must select a category',
      });
      return;
    }
  
    // If the form is valid and a category is selected, proceed with submission
    if (isFormValid) {
      try {
        await addTransaction(Number(data.amount), data.category, date.toISOString(), data.note || '');
        reset();
        setDate(new Date());
        router.push('/');
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
    }
  };
  

  const handleCategorySelect = (categoryId: number) => {
    setValue('category', categoryId, { shouldValidate: true });
    setSelectedCategoryId(categoryId);
    clearErrors('category');
  };
  

  const formatDate = (date: Date) => {
    // Example format: January 01, 2024
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  

  return (
    <View padding="$3">
      <YStack gap="$3">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              placeholder='Amount'
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
          name="amount"
          rules={{ required: 'You must enter an amount' }}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Note"
            />
          )}
          name="note"
        />
        <XStack flexWrap="wrap" gap="$2">
          {categories.map((category) => (
            <Button 
              size='$2' 
              key={category.id.toString()} 
              onPress={() => handleCategorySelect(category.id)}
              style={category.id === selectedCategoryId ? { backgroundColor: 'red', color: 'white' } : {}}
              disabled={category.id === selectedCategoryId}
            >
              {category.name}
            </Button>
          ))}
        </XStack>
        {errors.category && <Text style={styles.errorText}>You must select a category</Text>}

        <Input
          placeholder="Select Date"
          value={formatDate(date)}
          onFocus={() => setIsPickerShow(true)}
          editable={false} // Make the input non-editable
        />

        {isPickerShow && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default" // Adjust this based on your preference
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date;
              setIsPickerShow(false); // Hide picker
              setDate(currentDate); // Set the new date
            }}
          />
        )}


        <Button onPress={handleSubmit(onSubmit)}>Add Transaction</Button>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
