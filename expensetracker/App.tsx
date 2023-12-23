import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
interface ExpenseItem {
  id: String;
  expense: String;
  amount: String;
  category: String;
}

const App = () => {
  const [category, setCategory] = useState('food');
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([] as ExpenseItem[]);

  const saveExpensesToStorage = () => {
    try {
      AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving data', error);
    }
  };
  const loadExpensesFromStorage = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses !== null) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  useEffect(() => {
    loadExpensesFromStorage();
  }, []);

  useEffect(() => {
    saveExpensesToStorage();
  });

  const handleAddExpense = async () => {
    if (expense && amount) {
      setExpenses([
        ...expenses,
        {id: Date.now().toString(), expense, amount, category},
      ]);
      setExpense('');
      setAmount('');
    }
  };
  const clearExpenses = async () => {
    setExpenses([]);
    try {
      AsyncStorage.removeItem('expenses');
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      borderColor: '#000',
      borderWidth: 1,
      marginBottom: 10,
    },
    topLable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topLable}>
        <Text>Expense Tracker</Text>
        <Button title="Clear" onPress={clearExpenses} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Expense"
        onChangeText={setExpense}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        onChangeText={setAmount}
      />
      <Picker
        selectedValue={category}
        onValueChange={itemValue => setCategory(itemValue)}>
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Travel" value="travel" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Button title="Add" onPress={handleAddExpense} />
      <View>
        {expenses.map(item => (
          <View key={item.id as string}>
            <Text>
              {item.expense}: ${item.amount} ({item.category})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default App;
