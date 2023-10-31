import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function SoundTest() {
    const [sound, setSound] = React.useState(null)

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./assets/clave.wav')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }


    return (
        <View >
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );
}
