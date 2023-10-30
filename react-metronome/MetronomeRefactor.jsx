import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MetronomeRefactor() {
    const [tempo, setTempo] = useState(120)
    const [running, setRunning] = useState(false)
    const [timeSinceTap, setTimeSinceTap] = useState(0);
    const [tapTime, setTapTime] = useState(0);
    const [tapCount, setTapCount] = useState(0);
    const [tapTimeTotal, setTapTimeTotal] = useState(0);
    const [likelihood, setLikelihood] = useState(100);
    const [random, setRandom] = useState(false);
    const [beats, setBeats] = useState(1);
    const [divisor, setDivisor] = useState(2);
    const [secondaryRunning, setSecondaryRunning] = useState(false);
    const [subs, setSubs] = useState(0);
    const [ternaryRunning, setTernaryRunning] = useState(false);
    const [polyTop, setPolyTop] = useState(2);
    const [polyBottom, setPolyBottom] = useState(2);

    function promisedSetState(setter, newState) {
        return new Promise((resolve) => setter(newState));
    }

    function reset() {
        if (running) {
            clearInterval(metLoop);
            clearInterval(secondaryMetLoop);
            clearInterval(ternaryMetLoop);
            ballEl.style.animation = "none";
            this.playMet();
        }
    }

    function stop() {
        setRunning(false)
        clearInterval(metLoop);
        clearInterval(secondaryMetLoop);
        clearInterval(ternaryMetLoop);
        // ballEl.style.animation = "none";
    };


    return (
        <Text>Open up App.js to start working on your app!</Text>
    )

}