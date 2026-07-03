import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { api } from '../api/client';

export default function NewRequestScreen({ navigation }) {
  const [supplierName, setSupplierName] = useState('');
  const [company, setCompany] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!supplierName || !company || !reason || !startDate || !endDate) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }
    setSubmitting(true);
    try {
      await api('POST', '/requests', { supplierName, company, reason, startDate, endDate });
      Alert.alert('Succès', 'Demande envoyée au DG');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nom & Prénom fournisseur</Text>
      <TextInput style={styles.input} value={supplierName} onChangeText={setSupplierName} />
      <Text style={styles.label}>Entreprise</Text>
      <TextInput style={styles.input} value={company} onChangeText={setCompany} />
      <Text style={styles.label}>Motif</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={reason} onChangeText={setReason}
        multiline numberOfLines={3}
      />
      <Text style={styles.label}>Date début</Text>
      <TextInput
        style={styles.input} value={startDate} onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Date fin</Text>
      <TextInput
        style={styles.input} value={endDate} onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
      />
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>Envoyer au DG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 12, color: '#333' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, fontSize: 15,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#1a73e8', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
