import { View, Text } from 'react-native';

export default function IndexScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0d0f14',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: '#ffffff',
          fontSize: 32,
          fontWeight: 'bold',
        }}
      >
        FINZY
      </Text>

      <Text
        style={{
          color: '#7c6af7',
          fontSize: 18,
          marginTop: 10,
        }}
      >
        TESTE OK
      </Text>
    </View>
  );
}