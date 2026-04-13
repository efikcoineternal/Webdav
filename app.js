import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, 
  ActivityIndicator, Modal, Switch, Clipboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// ========== CONTRACT ADDRESS & ABI (BSC Mainnet) ==========
const TOKEN_ADDRESS = '0x9F8C29E496ECB6C39c221458f211234DfCB233E0';
const ADMIN_ADDRESS = '0xC5AD5cfcF81AD63a94227334b898eafCe6B27cCA';
const BSC_RPC = 'https://bsc-dataseed.binance.org/';
const TOKEN_ABI = [
  // Minimal ABI for balanceOf, transfer, decimals, symbol
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "success", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
];

// ========== HELPERS ==========
const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);

// Wallet creation / storage
async function saveWallet(wallet, password) {
  const encrypted = await wallet.encrypt(password);
  await AsyncStorage.setItem('encryptedWallet', encrypted);
  await AsyncStorage.setItem('walletAddress', wallet.address);
  return wallet;
}

async function loadWallet(password) {
  const encrypted = await AsyncStorage.getItem('encryptedWallet');
  if (!encrypted) return null;
  return await ethers.Wallet.fromEncryptedJson(encrypted, password);
}

async function getBalance(address) {
  const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatUnits(balance, 18);
}

// ========== SCREENS ==========

// Home Screen (Balance, Send, Receive)
function HomeScreen({ wallet, setWallet, navigation }) {
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (wallet) refreshBalance();
  }, [wallet]);

  const refreshBalance = async () => {
    if (!wallet) return;
    setLoading(true);
    const bal = await getBalance(wallet.address);
    setBalance(bal);
    setLoading(false);
  };

  const sendTransaction = async () => {
    if (!wallet) { Alert.alert('No wallet', 'Create or import a wallet first'); return; }
    if (!sendAddress || !sendAmount) { Alert.alert('Error', 'Fill address and amount'); return; }
    if (!ethers.utils.isAddress(sendAddress)) { Alert.alert('Error', 'Invalid address'); return; }
    setLoading(true);
    try {
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, wallet.connect(provider));
      const amountWei = ethers.utils.parseUnits(sendAmount, 18);
      const tx = await contract.transfer(sendAddress, amountWei);
      await tx.wait();
      Alert.alert('Success', `Sent ${sendAmount} ECE`);
      refreshBalance();
      setModalVisible(false);
      setSendAddress('');
      setSendAmount('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Your ECE Balance</Text>
        <Text style={styles.balance}>{balance}</Text>
        <TouchableOpacity style={styles.button} onPress={refreshBalance}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Wallet Address</Text>
        <Text style={styles.address}>{wallet?.address?.slice(0,20)}...{wallet?.address?.slice(-8)}</Text>
        <TouchableOpacity onPress={() => { Clipboard.setString(wallet.address); Alert.alert('Copied'); }}>
          <Text style={styles.copyLink}>Copy Address</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Send ECE</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Send ECE</Text>
          <TextInput style={styles.input} placeholder="Recipient Address" placeholderTextColor="#aaa" value={sendAddress} onChangeText={setSendAddress} />
          <TextInput style={styles.input} placeholder="Amount" placeholderTextColor="#aaa" keyboardType="numeric" value={sendAmount} onChangeText={setSendAmount} />
          <TouchableOpacity style={styles.button} onPress={sendTransaction}><Text style={styles.buttonText}>Send</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
        </View>
      </Modal>
      {loading && <ActivityIndicator size="large" color="#00c6fb" />}
    </ScrollView>
  );
}

// Staking Screen (simulated)
function StakingScreen({ wallet }) {
  const [staked, setStaked] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadStaking();
  }, []);

  const loadStaking = async () => {
    const s = await AsyncStorage.getItem('staked_ece');
    const r = await AsyncStorage.getItem('rewards_ece');
    setStaked(s || '0');
    setRewards(r || '0');
  };

  const stake = async () => {
    if (!wallet) { Alert.alert('No wallet'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    // Simulate staking
    const newStaked = parseFloat(staked) + amt;
    const newRewards = parseFloat(rewards) + amt * 0.08;
    await AsyncStorage.setItem('staked_ece', newStaked.toString());
    await AsyncStorage.setItem('rewards_ece', newRewards.toString());
    setStaked(newStaked.toString());
    setRewards(newRewards.toString());
    Alert.alert('Staked', `${amt} ECE staked (simulated)`);
    setAmount('');
  };

  const unstake = async () => {
    const total = parseFloat(staked) + parseFloat(rewards);
    if (total <= 0) return;
    await AsyncStorage.setItem('staked_ece', '0');
    await AsyncStorage.setItem('rewards_ece', '0');
    setStaked('0');
    setRewards('0');
    Alert.alert('Unstaked', `Received ${total.toFixed(2)} ECE (simulated)`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Staked ECE</Text>
        <Text style={styles.balance}>{staked}</Text>
        <Text style={styles.label}>Pending Rewards</Text>
        <Text style={styles.balance}>{rewards}</Text>
        <TextInput style={styles.input} placeholder="Amount to stake" placeholderTextColor="#aaa" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <TouchableOpacity style={styles.button} onPress={stake}><Text style={styles.buttonText}>Stake</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, {marginTop:10}]} onPress={unstake}><Text style={styles.buttonText}>Unstake All</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Mining Game (simulated)
function MiningScreen({ wallet }) {
  const [eceMined, setEceMined] = useState('0');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    loadMining();
  }, []);

  const loadMining = async () => {
    const mined = await AsyncStorage.getItem('eceMined');
    const lvl = await AsyncStorage.getItem('miningLevel');
    setEceMined(mined || '0');
    setLevel(parseInt(lvl) || 1);
  };

  const mine = async () => {
    const newMined = parseFloat(eceMined) + level;
    await AsyncStorage.setItem('eceMined', newMined.toString());
    setEceMined(newMined.toString());
  };

  const upgrade = async () => {
    const cost = 10;
    if (parseFloat(eceMined) >= cost) {
      const newMined = parseFloat(eceMined) - cost;
      const newLevel = level + 1;
      await AsyncStorage.setItem('eceMined', newMined.toString());
      await AsyncStorage.setItem('miningLevel', newLevel.toString());
      setEceMined(newMined.toString());
      setLevel(newLevel);
      Alert.alert('Upgraded', `Mining level ${newLevel}`);
    } else {
      Alert.alert('Insufficient', `Need ${cost} ECE`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>ECE Mined</Text>
        <Text style={styles.balance}>{eceMined}</Text>
        <Text style={styles.label}>Mining Power Level</Text>
        <Text style={styles.balance}>{level}</Text>
        <TouchableOpacity style={styles.button} onPress={mine}><Text style={styles.buttonText}>Mine ⛏️</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, {marginTop:10}]} onPress={upgrade}><Text style={styles.buttonText}>Upgrade (Cost 10 ECE)</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Settings / Wallet Management
function SettingsScreen({ wallet, setWallet, navigation }) {
  const [password, setPassword] = useState('');
  const [newWalletPassword, setNewWalletPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const createWallet = async () => {
    if (!newWalletPassword || newWalletPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    const newWallet = ethers.Wallet.createRandom();
    await saveWallet(newWallet, newWalletPassword);
    setWallet(newWallet);
    Alert.alert('Success', 'Wallet created!');
    navigation.navigate('Home');
  };

  const importWallet = async () => {
    if (!mnemonic || !newWalletPassword) {
      Alert.alert('Error', 'Enter seed phrase and password');
      return;
    }
    try {
      const walletFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic);
      await saveWallet(walletFromMnemonic, newWalletPassword);
      setWallet(walletFromMnemonic);
      Alert.alert('Success', 'Wallet imported');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Invalid seed phrase');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('encryptedWallet');
    await AsyncStorage.removeItem('walletAddress');
    setWallet(null);
  };

  if (!wallet) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Create New Wallet</Text>
          <TextInput style={styles.input} placeholder="Storage Password" placeholderTextColor="#aaa" secureTextEntry value={newWalletPassword} onChangeText={setNewWalletPassword} />
          <TouchableOpacity style={styles.button} onPress={createWallet}><Text style={styles.buttonText}>Create</Text></TouchableOpacity>
          <View style={{marginTop:20}} />
          <Text style={styles.label}>Import Existing Wallet</Text>
          <TextInput style={styles.input} placeholder="Seed Phrase (12 words)" placeholderTextColor="#aaa" value={mnemonic} onChangeText={setMnemonic} />
          <TextInput style={styles.input} placeholder="Storage Password" placeholderTextColor="#aaa" secureTextEntry value={newWalletPassword} onChangeText={setNewWalletPassword} />
          <TouchableOpacity style={styles.button} onPress={importWallet}><Text style={styles.buttonText}>Import</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Wallet Address</Text>
        <Text style={styles.address}>{wallet.address}</Text>
        <TouchableOpacity onPress={logout} style={[styles.button, {backgroundColor:'red'}]}>
          <Text style={styles.buttonText}>Logout / Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ========== MAIN APP ==========
const Tab = createBottomTabNavigator();

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredWallet = async () => {
      const addr = await AsyncStorage.getItem('walletAddress');
      if (addr) {
        // Need password to decrypt, but we can't store password. So we ask user to re-enter password each session.
        // Simpler: store encrypted and ask on launch. For demo, we'll just show that a wallet exists but needs login.
        // For full experience, we'll ask user to enter password on app start.
        setWallet({ address: addr }); // placeholder
      }
      setLoading(false);
    };
    loadStoredWallet();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#00c6fb" style={{flex:1}} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Staking') iconName = 'trending-up-outline';
            else if (route.name === 'Mining') iconName = 'hammer-outline';
            else if (route.name === 'Settings') iconName = 'settings-outline';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00c6fb',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#0a0f1e' },
          headerTitleStyle: { color: 'white' },
          headerTintColor: 'white',
        })}
      >
        <Tab.Screen name="Home">
          {props => <HomeScreen {...props} wallet={wallet} setWallet={setWallet} />}
        </Tab.Screen>
        <Tab.Screen name="Staking">
          {props => <StakingScreen {...props} wallet={wallet} />}
        </Tab.Screen>
        <Tab.Screen name="Mining">
          {props => <MiningScreen {...props} wallet={wallet} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {props => <SettingsScreen {...props} wallet={wallet} setWallet={setWallet} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e', padding: 16 },
  card: { backgroundColor: 'rgba(15,25,45,0.7)', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0,255,255,0.25)' },
  label: { color: '#aaa', fontSize: 14, marginBottom: 5 },
  balance: { color: '#00c6fb', fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  address: { color: 'white', fontSize: 14, marginBottom: 10, fontFamily: 'monospace' },
  button: { backgroundColor: '#005bea', padding: 12, borderRadius: 30, alignItems: 'center', marginTop: 5 },
  buttonPrimary: { backgroundColor: '#00c6fb', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  input: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15, padding: 12, marginVertical: 8, color: 'white', borderWidth: 1, borderColor: '#00c6fb' },
  modalView: { backgroundColor: '#1a1f2e', margin: 30, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: 'white' },
  cancel: { color: '#dc2626', marginTop: 15, fontSize: 16 },
  copyLink: { color: '#00c6fb', textDecorationLine: 'underline', marginTop: 5 },
});
