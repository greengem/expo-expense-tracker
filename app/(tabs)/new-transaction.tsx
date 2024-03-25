import { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, Input, Button, Text, YStack, XStack } from 'tamagui';
import { categories } from '../categories';
import { addTransaction } from '../services/database';

interface FormData {
  amount: string;
  category: string;
  note: string;
}

export default function TabNewTransactionScreen() {
  const [date, setDate] = useState(new Date());
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>();
  const amountInputRef = useRef<Input>(null);


  const onSubmit = async (data: FormData) => {
    try {
      await addTransaction(Number(data.amount), data.category, date.toISOString(), data.note || '');
      reset();
      setDate(new Date());
      amountInputRef.current?.focus();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setValue('category', categorySlug);
  };

  return (
    <View padding="$3">
      <YStack gap="$3">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input 
              ref={amountInputRef}
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
              key={category.slug} 
              onPress={() => handleCategorySelect(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </XStack>

        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />

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
