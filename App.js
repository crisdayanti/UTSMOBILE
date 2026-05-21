import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  // State Management 
  const [transaksi, setTransaksi] = useState([]);
  const [deskripsi, setDeskripsi] = useState('');
  const [nominalInput, setNominalInput] = useState('');

  // Logika Hitung Total Saldo (Saldo awal Rp 0)
  const totalBalance = transaksi.reduce((sum, item) => {
    if (item.tipe === 'masuk') {
      return sum + item.nominal;
    } else if (item.tipe === 'keluar') {
      return sum - item.nominal;
    }
    return sum;
  }, 0);

  // Logika Hitung Ringkasan Pemasukan & Pengeluaran di Bagian Atas
  const totalIncome = transaksi
    .filter(item => item.tipe === 'masuk')
    .reduce((sum, item) => sum + item.nominal, 0);
    
  const totalExpense = transaksi
    .filter(item => item.tipe === 'keluar')
    .reduce((sum, item) => sum + item.nominal, 0);

  // Fungsi Tambah Transaksi
  const handleAddTransaction = (type) => {
    if (!deskripsi.trim() || !nominalInput.trim()) return;

    const parsedAmount = parseFloat(nominalInput);
    if (isNaN(parsedAmount) || parsedAmount < 0) return;

    const newTransaction = {
      id: Date.now().toString(),
      ket: deskripsi,
      nominal: parsedAmount,
      tipe: type, // 'masuk' atau 'keluar'
    };

    setTransaksi([newTransaction, ...transaksi]);
    
    // Reset Form Input
    setDeskripsi('');
    setNominalInput('');
  };

  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        {/* 1. HEADER BANNER UTAMA */}
        <View style={styles.headerBanner}>
          <Text style={styles.appTitle}>DOMPETKU</Text>
          <Text style={styles.appSubtitle}>Pencatat Keuangan Pribadi</Text>
          
          <Text style={styles.saldoLabel}>Total Saldo</Text>
          <Text style={styles.saldoValue}>{formatRupiah(totalBalance)}</Text>
        </View>

        {/* 2. KOTAK RINGKASAN TOP BAR (Warna ikon disamakan dengan warna angka) */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Pemasukan</Text>
            <Text style={[styles.incomeValue, { color: '#4CAF50' }]}>
              ↑ {formatRupiah(totalIncome)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Pengeluaran</Text>
            <Text style={[styles.expenseValue, { color: '#F44336' }]}>
              ↓ {formatRupiah(totalExpense)}
            </Text>
          </View>
        </View>

        {/* 3. FORM INPUT TRANSAKSI */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitleForm}>Tambah Transaksi</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Deskripsi (contoh: Beli Makan)"
            placeholderTextColor="#A3A3A3"
            value={deskripsi}
            onChangeText={setDeskripsi}
          />
          <TextInput
            style={styles.input}
            placeholder="Nominal (contoh: 50000)"
            placeholderTextColor="#A3A3A3"
            value={nominalInput}
            keyboardType="numeric"
            onChangeText={setNominalInput}
          />

          {/* DUA TOMBOL UTAMA */}
          <View style={styles.rowTombol}>
            <TouchableOpacity
              style={[styles.tombol, styles.tombolMasuk]}
              onPress={() => handleAddTransaction('masuk')}
            >
              <Text style={styles.teksTombol}>Pemasukan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tombol, styles.tombolKeluar]}
              onPress={() => handleAddTransaction('keluar')}
            >
              <Text style={styles.teksTombol}>Pengeluaran</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. LIST HISTORY RIWAYAT TRANSAKSI */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitleList}>Riwayat Transaksi</Text>
          
          <FlatList
            data={transaksi}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => {
              const isIncome = item.tipe === 'masuk';
              return (
                <View style={styles.historyCard}>
                  <Text style={styles.textKet}>{item.ket}</Text>
                  <Text style={[styles.textNominal, { color: isIncome ? '#4CAF50' : '#F44336' }]}>
                    {isIncome ? '+' : '-'} {formatRupiah(item.nominal)}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Belum ada transaksi, Bro!</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// STYLING SEMUA ELEMEN (Aesthetic Soft Pink Theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5', // Soft Pink / Lavender Blush Base
  },
  innerContainer: {
    flex: 1,
  },
  headerBanner: {
    backgroundColor: '#FFB6C1', // Light Pink Accent area atas
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  saldoLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  saldoValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 16,
    marginTop: -25, 
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 13,
    color: '#8B7E84',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#FFD1DC',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitleForm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF9FA',
    fontSize: 14,
    color: '#333333',
  },
  rowTombol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tombol: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12, 
    alignItems: 'center',
    marginHorizontal: 6,
  },
  tombolMasuk: {
    backgroundColor: '#4CAF50', 
  },
  tombolKeluar: {
    backgroundColor: '#F44336', 
  },
  teksTombol: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitleList: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DB7093', 
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD1DC', 
  },
  textKet: {
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  textNominal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#C71585', 
    fontStyle: 'italic',
    fontWeight: '500',
  },
});